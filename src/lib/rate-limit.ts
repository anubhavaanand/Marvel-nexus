const buckets = new Map<string, number[]>()

/**
 * Fixed-window in-memory rate limiter.
 *
 * Suitable for a single server instance (local dev or a single-node deploy).
 * For multi-instance deployments use a shared store (Redis/Upstash).
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const timestamps = (buckets.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs)

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps)
    return true
  }

  timestamps.push(now)
  buckets.set(key, timestamps)
  return false
}

/** Test helper: clear all windows. */
export function resetRateLimiter(): void {
  buckets.clear()
}

/** Extract the originating client IP from an X-Forwarded-For style value. */
export function parseClientIp(headerValue: string | null): string {
  return headerValue?.split(',')[0]?.trim() || 'unknown'
}
