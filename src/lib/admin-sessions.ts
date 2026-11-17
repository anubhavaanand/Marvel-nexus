import crypto from 'crypto'
import { getServiceSupabase } from './service-supabase'

/** Session lifetime (8 hours). */
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

/** In-memory current password epoch (bumped whenever the password changes). */
let currentPasswordEpoch = 0

/** Hash of the ADMIN_PASSWORD value the current epoch was issued under. */
let lastKnownPasswordHash: string | null = null

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function readStoredPasswordHash(): Promise<string | null> {
  if (!(await canUseSessionsTable())) return null
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('admin_password_epoch')
      .select('password_hash')
      .eq('id', 1)
      .maybeSingle()
    if (!error && data?.password_hash) return data.password_hash as string
  } catch {
    // Best effort; treat as unknown.
  }
  return null
}

async function writeStoredPasswordHash(hash: string): Promise<void> {
  if (!(await canUseSessionsTable())) return
  try {
    const supabase = getServiceSupabase()
    await supabase.from('admin_password_epoch').update({ password_hash: hash }).eq('id', 1)
  } catch {
    // Best effort; the in-memory epoch still rotates this process.
  }
}

/**
 * Keeps the session epoch aligned with the current ADMIN_PASSWORD.
 * Called on every successful login: when the stored hash differs from the
 * credential just used, the epoch is bumped so every previously issued
 * admin_session row stops validating (#443). A first-ever observation only
 * records the hash — it must not invalidate legitimate sessions.
 */
export async function ensurePasswordEpochFresh(password: string): Promise<void> {
  const hash = hashPassword(password)
  const stored = await readStoredPasswordHash()

  if (stored === null) {
    lastKnownPasswordHash = hash
    await writeStoredPasswordHash(hash)
    return
  }
  if (stored === hash || lastKnownPasswordHash === hash) {
    lastKnownPasswordHash = hash
    return
  }

  await rotatePasswordEpoch()
  await writeStoredPasswordHash(hash)
  lastKnownPasswordHash = hash
}

/**
 * Gets the current password epoch from the database.
 * Falls back to the in-memory value if DB is unavailable.
 */
async function getCurrentPasswordEpoch(): Promise<number> {
  if (!(await canUseSessionsTable())) {
    return currentPasswordEpoch
  }
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('admin_password_epoch')
      .select('epoch')
      .eq('id', 1)
      .maybeSingle()
    if (!error && data) {
      currentPasswordEpoch = data.epoch
      return data.epoch
    }
  } catch {
    // Fall back to in-memory
  }
  return currentPasswordEpoch
}

/**
 * Increments the password epoch in the database and updates the in-memory
 * value. Sessions store their epoch at creation, so a bump invalidates them.
 */
export async function rotatePasswordEpoch(): Promise<number> {
  currentPasswordEpoch += 1
  if (!(await canUseSessionsTable())) {
    return currentPasswordEpoch
  }
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('admin_password_epoch')
      .update({ epoch: currentPasswordEpoch, updated_at: new Date().toISOString() })
      .eq('id', 1)
      .select('epoch')
      .maybeSingle()
    if (!error && data) {
      currentPasswordEpoch = data.epoch
      return data.epoch
    }
  } catch {
    // Keep the in-memory increment.
  }
  return currentPasswordEpoch
}

/** Re-probe configuration for DB availability. */
const REPROBE_BASE_DELAY_MS = 2000
const REPROBE_MAX_DELAY_MS = 30000
const REPROBE_JITTER_FACTOR = 0.3

interface DBModeState {
  /** Whether the table was available on last successful probe. */
  available: boolean
  /** Timestamp of the last probe attempt (success or failure). */
  lastProbeAt: number
  /** Next scheduled probe time (0 = no pending probe). */
  nextProbeAt: number
  /** Current backoff delay in ms. */
  backoffMs: number
  /** Whether a re-probe is currently in flight. */
  probing: boolean
}

let dbMode: DBModeState = {
  available: false,
  lastProbeAt: 0,
  nextProbeAt: 0,
  backoffMs: REPROBE_BASE_DELAY_MS,
  probing: false,
}

/** Shared in-flight probe promise, used to dedupe concurrent probes. */
let probePromise: Promise<boolean> | null = null

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Schedules a re-probe with exponential backoff and jitter.
 * Called when a DB operation fails to trigger a future re-check.
 */
function scheduleReprobe(): void {
  if (dbMode.probing) return
  const jitter = dbMode.backoffMs * REPROBE_JITTER_FACTOR * Math.random()
  const delay = Math.min(dbMode.backoffMs + jitter, REPROBE_MAX_DELAY_MS)
  dbMode.nextProbeAt = Date.now() + delay
  // Increase backoff for next failure, capped at max.
  dbMode.backoffMs = Math.min(dbMode.backoffMs * 2, REPROBE_MAX_DELAY_MS)
}

/**
 * Resets backoff to base after a successful probe.
 */
function resetBackoff(): void {
  dbMode.backoffMs = REPROBE_BASE_DELAY_MS
  dbMode.nextProbeAt = 0
}

/**
 * Probes the admin_sessions table to check availability.
 * Updates dbMode state based on result.
 */
async function probeSessionsTable(): Promise<boolean> {
  // Dedupe concurrent probes: reuse the in-flight promise instead of
  // starting a second DB probe.
  if (probePromise) return probePromise

  probePromise = (async () => {
    dbMode.probing = true
    try {
      const supabase = getServiceSupabase()
      const { error } = await supabase.from('admin_sessions').select('token_hash').limit(1)
      const available = !error
      dbMode.available = available
      dbMode.lastProbeAt = Date.now()
      if (available) {
        resetBackoff()
      } else {
        scheduleReprobe()
      }
      return available
    } catch {
      dbMode.available = false
      dbMode.lastProbeAt = Date.now()
      scheduleReprobe()
      return false
    } finally {
      dbMode.probing = false
      probePromise = null
    }
  })()

  return probePromise
}

/**
 * Returns true if the sessions table is available, probing if needed.
 * - On first call: probes immediately.
 * - If available: returns true (re-probes opportunistically on write failures).
 * - If unavailable: returns false, but schedules a re-probe with backoff.
 * - Re-probes in the background when nextProbeAt is reached.
 */
async function canUseSessionsTable(): Promise<boolean> {
  const now = Date.now()

  // Never probed yet: probe immediately.
  if (dbMode.lastProbeAt === 0) {
    return probeSessionsTable()
  }

  // Currently available: return true. Writes will trigger re-probe on failure.
  if (dbMode.available) {
    return true
  }

  // Unavailable but re-probe time reached: probe now.
  if (now >= dbMode.nextProbeAt) {
    return probeSessionsTable()
  }

  // Unavailable and re-probe not due yet: return cached false.
  return false
}

/**
 * Creates a new session token and stores its hash in the admin_sessions table.
 * Throws if the table is unavailable — admin sessions require durable revocation.
 */
export async function createSessionToken(): Promise<string> {
  if (!(await canUseSessionsTable())) {
    throw new Error('Admin sessions require the admin_sessions table')
  }

  const token = crypto.randomBytes(32).toString('base64url')
  const supabase = getServiceSupabase()
  const { error } = await supabase.from('admin_sessions').insert({
    token_hash: hashToken(token),
    expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    password_epoch: await getCurrentPasswordEpoch(),
  })
  if (error) {
    // Write failed: trigger re-probe, but keep dbMode.available=true for now
    // so validations continue to work while we re-check.
    scheduleReprobe()
    throw new Error('Failed to create admin session')
  }

  // Best-effort cleanup of expired rows; never blocks the login path.
  void pruneExpiredSessions().catch(() => {})
  return token
}

/**
 * Validates a session token against the admin_sessions table.
 * Returns false if the table is unavailable — admin sessions require the DB.
 * Keeps using DB-mode validation even after transient errors (re-probes in background).
 */
export async function validateSessionToken(token: string): Promise<boolean> {
  if (!token) return false

  if (!(await canUseSessionsTable())) {
    return false
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('token_hash, expires_at, password_epoch')
    .eq('token_hash', hashToken(token))
    .maybeSingle()
  if (error || !data) return false
  if (new Date(data.expires_at).getTime() <= Date.now()) return false
  const currentEpoch = await getCurrentPasswordEpoch()
  // Rows written before the epoch column existed carry no value; treat them as
  // epoch 0 so a fresh install is not invalidated merely by reading the epoch.
  return (data.password_epoch ?? 0) === currentEpoch
}

/**
 * Revokes a session by deleting it from the admin_sessions table.
 * This provides durable revocation that survives restarts and works across instances.
 */
export async function revokeSessionToken(token: string): Promise<void> {
  if (!token) return

  if (!(await canUseSessionsTable())) {
    // Without the DB we cannot durably revoke; treat as no-op (token would be invalid anyway).
    return
  }

  try {
    const supabase = getServiceSupabase()
    await supabase.from('admin_sessions').delete().eq('token_hash', hashToken(token))
  } catch {
    // Best effort: a failed revoke must not break logout.
    // Trigger re-probe on revoke failure too.
    scheduleReprobe()
  }
}

export async function revokeAllSessions(): Promise<void> {
  if (!(await canUseSessionsTable())) return
  try {
    const supabase = getServiceSupabase()
    await supabase.from('admin_sessions').delete().neq('token_hash', '')
  } catch {
    scheduleReprobe()
  }
}
export async function pruneExpiredSessions(): Promise<void> {
  if (!(await canUseSessionsTable())) return
  try {
    const supabase = getServiceSupabase()
    await supabase.from('admin_sessions').delete().lt('expires_at', new Date().toISOString())
  } catch {
    // Best effort maintenance.
    scheduleReprobe()
  }
}

// Exported for testing: reset internal state between tests.
export function __resetDbModeForTest(): void {
  dbMode = {
    available: false,
    lastProbeAt: 0,
    nextProbeAt: 0,
    backoffMs: REPROBE_BASE_DELAY_MS,
    probing: false,
  }
  probePromise = null
  currentPasswordEpoch = 0
  lastKnownPasswordHash = null
}

// Exported for testing: advance time and force a re-probe check.
export function __advanceTimeForTest(): void {
  // This is a no-op in production; tests can use vi.useFakeTimers() instead.
  // Kept for API compatibility if needed.
}
