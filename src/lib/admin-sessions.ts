import crypto from 'crypto'
import { getServiceSupabase } from './service-supabase'

/** Session lifetime (8 hours). */
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

/**
 * Process-local signing secret for the stateless fallback token format.
 * It is random per process, so tokens stop validating after a restart/deploy
 * (old cookies are invalidated) and are not derived from the password.
 */
const FALLBACK_SECRET = crypto.randomBytes(32)

let dbMode: boolean | null = null

async function canUseSessionsTable(): Promise<boolean> {
  if (dbMode !== null) return dbMode
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from('admin_sessions').select('token_hash').limit(1)
    dbMode = !error
  } catch {
    // Missing credentials or missing table: fall back to signed tokens.
    dbMode = false
  }
  return dbMode
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function sign(value: string, secret: Buffer): string {
  return crypto.createHmac('sha256', secret).update(value).digest('hex')
}

/** Maximum number of fingerprints held in the in-memory revocation list. */
const MAX_REVOCATION_ENTRIES = 4096

/**
 * Process-local revocation set keyed by token fingerprint (never the raw
 * token). Survives logout and cookie clearing in stateless fallback mode
 * when the admin_sessions table is unavailable. Pruned on insert and bounded
 * so a compromised process cannot be turned into an unbounded memory sink.
 */
const revokedFingerprints = new Set<string>()

function fingerprintOf(token: string): string {
  return hashToken(token)
}

function pruneRevokedFingerprints(): void {
  if (revokedFingerprints.size <= MAX_REVOCATION_ENTRIES) return
  // Evict oldest entries first; Set iteration order is insertion order, so
  // dropping the head of the set approximates FIFO eviction.
  const overflow = revokedFingerprints.size - MAX_REVOCATION_ENTRIES
  let dropped = 0
  for (const fp of revokedFingerprints) {
    revokedFingerprints.delete(fp)
    dropped += 1
    if (dropped >= overflow) break
  }
}

/**
 * Creates a new session token and stores its hash when the admin_sessions
 * table exists. Returns a signed token (expiry + signature + random) otherwise.
 */
export async function createSessionToken(): Promise<string> {
  const token = crypto.randomBytes(32).toString('base64url')

  if (await canUseSessionsTable()) {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from('admin_sessions').insert({
      token_hash: hashToken(token),
      expires_at: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
    })
    if (!error) {
      // Best-effort cleanup of expired rows; never blocks the login path.
      void pruneExpiredSessions()
      return token
    }
    dbMode = false
  }

  const expiresAt = String(Date.now() + SESSION_TTL_MS)
  const payload = `${expiresAt}.${token}`
  return `${payload}.${sign(payload, FALLBACK_SECRET)}`
}

/**
 * Validates a session token against the database (when available) or verifies
 * the signed fallback format. Revoked tokens are rejected in both modes.
 */
export async function validateSessionToken(token: string): Promise<boolean> {
  if (!token) return false

  if (await canUseSessionsTable()) {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from('admin_sessions')
      .select('token_hash, expires_at')
      .eq('token_hash', hashToken(token))
      .maybeSingle()
    if (error || !data) return false
    return new Date(data.expires_at).getTime() > Date.now()
  }

  // Stateless fallback: reject revoked fingerprints first, then verify the
  // signed payload. This is what makes logout meaningful without a shared store.
  if (revokedFingerprints.has(fingerprintOf(token))) return false

  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [expiresAt, random, signature] = parts
  const expected = sign(`${expiresAt}.${random}`, FALLBACK_SECRET)
  const actualBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (actualBuffer.length !== expectedBuffer.length) return false
  if (!crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return false
  const expiry = Number(expiresAt)
  return Number.isFinite(expiry) && expiry > Date.now()
}

/**
 * Revokes a session server-side. In stateless fallback mode this records the
 * token fingerprint in the process-local revocation set, so logout actually
 * invalidates the token until its TTL expires or the process restarts.
 */
export async function revokeSessionToken(token: string): Promise<void> {
  if (!token) return

  if (await canUseSessionsTable()) {
    try {
      const supabase = getServiceSupabase()
      await supabase.from('admin_sessions').delete().eq('token_hash', hashToken(token))
    } catch {
      // Best effort: a failed revoke must not break logout.
    }
    return
  }

  // Fallback mode: record the fingerprint so validateSessionToken rejects it.
  revokedFingerprints.add(fingerprintOf(token))
  pruneRevokedFingerprints()
}

/** Removes expired rows; called opportunistically when creating a session. */
export async function pruneExpiredSessions(): Promise<void> {
  if (!(await canUseSessionsTable())) return
  try {
    const supabase = getServiceSupabase()
    await supabase.from('admin_sessions').delete().lt('expires_at', new Date().toISOString())
  } catch {
    // Best effort maintenance.
  }
}
