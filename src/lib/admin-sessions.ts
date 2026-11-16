import crypto from 'crypto'
import { getServiceSupabase } from './service-supabase'

/** Session lifetime (8 hours). */
const SESSION_TTL_MS = 8 * 60 * 60 * 1000

let dbMode: boolean | null = null

async function canUseSessionsTable(): Promise<boolean> {
  if (dbMode !== null) return dbMode
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from('admin_sessions').select('token_hash').limit(1)
    dbMode = !error
  } catch {
    // Missing credentials or missing table: admin sessions require the DB.
    dbMode = false
  }
  return dbMode
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
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
  })
  if (error) {
    dbMode = false
    throw new Error('Failed to create admin session')
  }

  // Best-effort cleanup of expired rows; never blocks the login path.
  void pruneExpiredSessions()
  return token
}

/**
 * Validates a session token against the admin_sessions table.
 * Returns false if the table is unavailable — admin sessions require the DB.
 */
export async function validateSessionToken(token: string): Promise<boolean> {
  if (!token) return false

  if (!(await canUseSessionsTable())) {
    return false
  }

  const supabase = getServiceSupabase()
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('token_hash, expires_at')
    .eq('token_hash', hashToken(token))
    .maybeSingle()
  if (error || !data) return false
  return new Date(data.expires_at).getTime() > Date.now()
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
  }
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
