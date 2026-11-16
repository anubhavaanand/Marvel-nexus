/**
 * Per-action rate-limit budgets for authenticated admin server actions.
 *
 * Each budget is a fixed window (per client IP) that matches the existing
 * `isRateLimited` semantics in `./rate-limit`. Keys are namespaced by action
 * so that one action's traffic never eats another's allowance.
 *
 * Destructive / bulk actions get tighter budgets than single-row edits.
 */
export const ACTION_RATE_LIMITS = {
  UPDATE_HERO: { limit: 30, windowMs: 60_000 },
  CREATE_HERO: { limit: 30, windowMs: 60_000 },
  DELETE_HERO: { limit: 30, windowMs: 60_000 },
  TEST_DB_CONNECTION: { limit: 10, windowMs: 60_000 },
  SEED_DEMO_HEROES: { limit: 5, windowMs: 60_000 },
  SYNC_MOVIES: { limit: 5, windowMs: 60_000 },
  CREATE_CANON_EVENTS: { limit: 5, windowMs: 60_000 },
  GET_ADMIN_STATS: { limit: 30, windowMs: 60_000 },
} as const

export type ActionRateLimitKey = keyof typeof ACTION_RATE_LIMITS

export interface ActionRateLimitResult {
  ok: boolean
  error?: string
}

/**
 * Resolves the originating client IP from standard proxy headers.
 * Shared by all server actions so the login limiter and action limiters
 * key on the same value.
 */
export async function getClientIp(): Promise<string> {
  const { headers: getHeaders } = await import('next/headers')
  const { resolveClientIp } = await import('./rate-limit')
  const requestHeaders = await getHeaders()
  return resolveClientIp(requestHeaders.get('x-forwarded-for'), requestHeaders.get('x-real-ip'))
}

/**
 * Runs the shared limiter for an admin action and returns a friendly result
 * instead of throwing, so callers can surface a non-throwing failure.
 */
export async function checkActionRateLimit(
  action: ActionRateLimitKey,
): Promise<ActionRateLimitResult> {
  const { isRateLimited } = await import('./rate-limit')
  const { limit, windowMs } = ACTION_RATE_LIMITS[action]
  const clientIp = await getClientIp()
  if (isRateLimited(`admin-action:${action}:${clientIp}`, limit, windowMs)) {
    console.warn(`Action rate-limited: ${action} from ${clientIp}`)
    return {
      ok: false,
      error: 'Too many requests. Please try again later.',
    }
  }
  return { ok: true }
}
