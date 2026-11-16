'use server'

import crypto from 'crypto'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Hero } from '@/lib/supabase'
import { sanitizeHeroUpdate } from '@/lib/hero-update'
import { getServiceSupabase as getAdminSupabase } from '@/lib/service-supabase'
import { createSessionToken, revokeSessionToken, validateSessionToken } from '@/lib/admin-sessions'
import { checkActionRateLimit, getClientIp } from '@/lib/action-rate-limit'
import { isRateLimited } from '@/lib/rate-limit'

const MAX_LOGIN_ATTEMPTS_PER_MINUTE = 5

/**
 * Securely compares two strings to prevent timing attacks.
 * Hashes both inputs to ensure they have the same length before comparing.
 */
function secureCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash('sha256').update(a).digest()
  const hashB = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

export interface LoginAdminResult {
  ok: boolean
  error?: string
}

/**
 * Validates the password and sets a secure HttpOnly cookie.
 * Returns a result object instead of throwing for expected conditions
 * (missing config or wrong password) so callers can surface a generic
 * failure message without revealing whether config or credentials failed.
 */
export async function loginAdminAction(password: string): Promise<LoginAdminResult> {
  const clientIp = await getClientIp()
  if (isRateLimited(`admin-login:${clientIp}`, MAX_LOGIN_ATTEMPTS_PER_MINUTE, 60_000)) {
    console.warn(`Admin login throttled for ${clientIp}`)
    return { ok: false, error: 'Too many attempts. Please try again later.' }
  }

  const correctPassword = process.env.ADMIN_PASSWORD
  if (!correctPassword) {
    return { ok: false, error: 'Login failed' }
  }
  if (secureCompare(password, correctPassword)) {
    const token = await createSessionToken()
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours, matching the session TTL
      path: '/',
    })
    return { ok: true }
  }
  return { ok: false, error: 'Login failed' }
}

/**
 * Checks if the user is authenticated based on the session cookie
 */
export async function checkAdminAuthAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    if (!sessionCookie) return false

    return validateSessionToken(sessionCookie.value)
  } catch {
    return false
  }
}

/**
 * Logs out the admin by deleting the session cookie
 */
export async function logoutAdminAction(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    if (sessionCookie) await revokeSessionToken(sessionCookie.value)
    cookieStore.delete('admin_session')
  } catch {
    // Logout must never fail because revocation failed.
  }
}

/**
 * Securely updates a hero using the admin client
 */
export async function updateHeroAction(id: string, updates: Partial<Hero>): Promise<Hero | null> {
  const isAuthenticated = await checkAdminAuthAction()
  if (!isAuthenticated) {
    throw new Error('Unauthorized admin access')
  }

  const rateLimit = await checkActionRateLimit('UPDATE_HERO')
  if (!rateLimit.ok) {
    console.warn(`updateHeroAction rate-limited: ${rateLimit.error}`)
    return null
  }

  const supabase = getAdminSupabase()
  const sanitized = sanitizeHeroUpdate(updates)
  if (!sanitized || Object.keys(sanitized).length === 0) {
    console.error('Rejected hero update: invalid or empty payload')
    return null
  }

  const { data, error } = await supabase
    .from('heroes')
    .update(sanitized)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating hero via server action:', error)
    return null
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/hero/[slug]', 'layout')
  revalidatePath('/search')
  revalidatePath('/timeline')
  return data
}

/**
 * Securely deletes a hero using the admin client
 */
export async function deleteHeroAction(id: string): Promise<boolean> {
  const isAuthenticated = await checkAdminAuthAction()
  if (!isAuthenticated) {
    throw new Error('Unauthorized admin access')
  }

  const rateLimit = await checkActionRateLimit('DELETE_HERO')
  if (!rateLimit.ok) {
    console.warn(`deleteHeroAction rate-limited: ${rateLimit.error}`)
    return false
  }

  const supabase = getAdminSupabase()
  const { error } = await supabase.from('heroes').delete().eq('id', id)

  if (error) {
    console.error('Error deleting hero via server action:', error)
    return false
  }

  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/hero/[slug]', 'layout')
  revalidatePath('/search')
  revalidatePath('/timeline')
  return true
}

/**
 * Pings Supabase with a cheap query and reports latency.
 * Never returns credentials, URLs, or raw provider messages to the client.
 */
export interface TestDatabaseConnectionResult {
  ok: boolean
  latencyMs?: number
  error?: string
}

export async function testDatabaseConnectionAction(): Promise<TestDatabaseConnectionResult> {
  const isAuthenticated = await checkAdminAuthAction()
  if (!isAuthenticated) {
    throw new Error('Unauthorized admin access')
  }

  const rateLimit = await checkActionRateLimit('TEST_DB_CONNECTION')
  if (!rateLimit.ok) {
    console.warn(`testDatabaseConnectionAction rate-limited: ${rateLimit.error}`)
    return {
      ok: false,
      error: rateLimit.error ?? 'Too many requests. Please try again later.',
    }
  }

  const started = Date.now()
  try {
    const supabase = getAdminSupabase()
    const { error } = await supabase.from('heroes').select('id', { count: 'exact', head: true })

    if (error) {
      return { ok: false, error: 'Database query failed' }
    }

    return { ok: true, latencyMs: Date.now() - started }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Database connection failed' }
  }
}
