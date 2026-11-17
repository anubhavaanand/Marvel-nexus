'use server'

import crypto from 'crypto'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Hero } from '@/lib/supabase'
import { sanitizeHeroUpdate } from '@/lib/hero-update'
import { isValidHeroUpdatePayload } from '@/lib/hero-update-guard'
import { slugifyAlias } from '@/lib/slugs'
import { getServiceSupabase as getAdminSupabase } from '@/lib/service-supabase'
import {
  createSessionToken,
  ensurePasswordEpochFresh,
  revokeSessionToken,
  validateSessionToken,
} from '@/lib/admin-sessions'
import { checkActionRateLimit, getClientIp } from '@/lib/action-rate-limit'
import { isRateLimited } from '@/lib/rate-limit'
import { getSafeErrorMessage } from '@/lib/error'

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
    // A changed ADMIN_PASSWORD must invalidate sessions issued under the old
    // credential (#443). Best-effort: never block a valid login on this.
    await ensurePasswordEpochFresh(correctPassword)
    let token: string
    try {
      token = await createSessionToken()
    } catch (err) {
      console.error('loginAdminAction: session creation failed:', err)
      return { ok: false, error: 'Login failed' }
    }
    const cookieStore = await cookies()
    const headersList = await headers()
    const forwardedProto = headersList.get('x-forwarded-proto')
    // Secure flag: mark the cookie Secure whenever the request arrived over
    // HTTPS (x-forwarded-proto: https), regardless of NODE_ENV. In local dev
    // (plain HTTP) we intentionally leave Secure off so the cookie can be set
    // without TLS. SameSite lax: strict silently drops the cookie on any
    // cross-site navigation (e.g. logging in from another subdomain), forcing
    // a fresh login. Lax still protects against CSRF on POST requests while
    // allowing the cookie to survive top-level navigations.
    // SECURITY FLOOR: in production (NODE_ENV=production) the cookie is ALWAYS
    // Secure regardless of x-forwarded-proto. The forwarded-proto header is
    // only trusted as a positive signal in non-production; proxies MUST strip
    // any client-supplied x-forwarded-proto before forwarding so it cannot be
    // spoofed to downgrade a Secure cookie to non-Secure (MitM exposure) or
    // upgrade a non-Secure cookie to Secure (self-lockout). Production enforces
    // Secure unconditionally as a defense-in-depth floor.
    const isSecure = process.env.NODE_ENV === 'production' || forwardedProto === 'https'
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'lax',
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
    return null
  }

  const rateLimit = await checkActionRateLimit('UPDATE_HERO')
  if (!rateLimit.ok) {
    console.warn(`updateHeroAction rate-limited: ${rateLimit.error}`)
    return null
  }

  let supabase: ReturnType<typeof getAdminSupabase>
  try {
    supabase = getAdminSupabase()
  } catch {
    console.error('updateHeroAction: Supabase service client is not configured')
    return null
  }

  if (!isValidHeroUpdatePayload(updates)) {
    console.error('Rejected hero update: oversized or invalid payload shape')
    return null
  }

  const sanitized = sanitizeHeroUpdate(updates)
  if (!sanitized || Object.keys(sanitized).length === 0) {
    console.error('Rejected hero update: invalid or empty payload')
    return null
  }

  // Read the current slug before updating so we can revalidate the old URL.
  const { data: existingRow } = await supabase
    .from('heroes')
    .select('slug')
    .eq('id', id)
    .maybeSingle()
  const oldSlug = (existingRow as { slug?: string } | null)?.slug

  // Recompute slug when alias changes to keep URLs consistent
  let slug: string | undefined
  if (sanitized.alias) {
    slug = slugifyAlias(sanitized.alias)
    // Check for collision with another hero (exclude current hero by id)
    const { data: existing } = await supabase
      .from('heroes')
      .select('id')
      .eq('slug', slug)
      .neq('id', id)
      .maybeSingle()
    if (existing) {
      // Collision: append short unique suffix to keep slug unique
      const suffix = crypto.randomBytes(2).toString('hex')
      slug = `${slug}-${suffix}`
    }
  }

  const payload: Record<string, unknown> = { ...sanitized }
  if (slug) payload.slug = slug

  const { data, error } = await supabase
    .from('heroes')
    .update(payload)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('Error updating hero via server action:', error)
    return null
  }
  if (!data) {
    console.error('Hero not found for update:', id)
    return null
  }

  revalidatePath('/')
  revalidatePath('/admin')
  if (data?.slug) revalidatePath(`/hero/${data.slug}`)
  if (oldSlug && oldSlug !== data?.slug) revalidatePath(`/hero/${oldSlug}`)
  revalidatePath('/search')
  revalidatePath('/timeline')
  return data
}

/**
 * Securely creates a new hero using the admin client
 */
export async function createHeroAction(updates: Partial<Hero>): Promise<Hero | null> {
  const isAuthenticated = await checkAdminAuthAction()
  if (!isAuthenticated) {
    return null
  }

  const rateLimit = await checkActionRateLimit('CREATE_HERO')
  if (!rateLimit.ok) {
    console.warn(`createHeroAction rate-limited: ${rateLimit.error}`)
    return null
  }

  let supabase: ReturnType<typeof getAdminSupabase>
  try {
    supabase = getAdminSupabase()
  } catch {
    console.error('createHeroAction: Supabase service client is not configured')
    return null
  }

  if (!isValidHeroUpdatePayload(updates)) {
    console.error('Rejected hero create: oversized or invalid payload shape')
    return null
  }

  const sanitized = sanitizeHeroUpdate(updates)
  if (!sanitized || Object.keys(sanitized).length === 0) {
    console.error('Rejected hero create: invalid or empty payload')
    return null
  }

  // create requires core fields: name, alias, franchise
  const name = (sanitized.name ?? updates.name) as string | undefined
  const alias = (sanitized.alias ?? updates.alias) as string | undefined
  const franchise = (sanitized.franchise ?? updates.franchise) as string | undefined
  if (!name || !alias || !franchise) {
    console.error('Rejected hero create: missing core fields (name, alias, franchise)')
    return null
  }
  const slugSource = alias || name
  let slug = slugSource ? slugifyAlias(slugSource) : undefined
  if (!slug) {
    console.error('Rejected hero create: could not derive slug')
    return null
  }
  // A duplicate alias yields the same base slug; append a short suffix instead
  // of letting the unique constraint turn into a 500 (#411).
  const { data: existingSlugOwner } = await supabase
    .from('heroes')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  if (existingSlugOwner) {
    slug = `${slug}-${crypto.randomBytes(2).toString('hex')}`
  }
  const payload: Record<string, unknown> = { ...sanitized }
  if (!payload.name) payload.name = name
  if (!payload.alias) payload.alias = alias
  if (!payload.franchise) payload.franchise = franchise
  payload.slug = slug

  const { data, error } = await supabase.from('heroes').insert(payload).select().maybeSingle()

  if (error) {
    console.error('Error creating hero via server action:', error)
    return null
  }
  if (!data) {
    console.error('Hero create returned no row')
    return null
  }

  revalidatePath('/')
  revalidatePath('/admin')
  if (data?.slug) revalidatePath(`/hero/${data.slug}`)
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
    return false
  }

  const rateLimit = await checkActionRateLimit('DELETE_HERO')
  if (!rateLimit.ok) {
    console.warn(`deleteHeroAction rate-limited: ${rateLimit.error}`)
    return false
  }

  let supabase: ReturnType<typeof getAdminSupabase>
  try {
    supabase = getAdminSupabase()
  } catch {
    console.error('deleteHeroAction: Supabase service client is not configured')
    return false
  }

  // Resolve slug before deletion so we can revalidate the affected hero page.
  const { data: heroRow } = await supabase.from('heroes').select('slug').eq('id', id).maybeSingle()

  // #440: dependent rows and the hero row are removed in one transaction by an
  // RPC, so a failure cannot leave orphans or a half-deleted hero.
  const { error } = await supabase.rpc('delete_hero_cascade', { p_hero_id: id })
  if (error) {
    // Pre-010 databases / test doubles without the function: fall back to the
    // previous explicit ordering. The RPC path is preferred when available.
    const notFound =
      String(error.code ?? '') === '42883' || String(error.message).includes('delete_hero_cascade')
    if (!notFound) {
      console.error('Error deleting hero via server action:', error)
      return false
    }
    const { error: canonError } = await supabase.from('canon_events').delete().eq('hero_id', id)
    if (canonError) {
      console.error('Error deleting hero canon events:', canonError)
      return false
    }
    const { error: heroMoviesError } = await supabase.from('hero_movies').delete().eq('hero_id', id)
    if (heroMoviesError) {
      console.error('Error deleting hero movie links:', heroMoviesError)
      return false
    }
    const { error: legacyError } = await supabase.from('heroes').delete().eq('id', id)
    if (legacyError) {
      console.error('Error deleting hero via server action:', legacyError)
      return false
    }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  if (heroRow?.slug) revalidatePath(`/hero/${heroRow.slug}`)
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
    return { ok: false, error: 'Unauthorized' }
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
    console.error('testDatabaseConnectionAction failed:', err)
    return { ok: false, error: getSafeErrorMessage(err, 'Database connection failed') }
  }
}
