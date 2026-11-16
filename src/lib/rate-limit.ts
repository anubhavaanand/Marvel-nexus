const MAX_KEYS = 100_000
const PRUNE_INTERVAL_MS = 60_000

interface Bucket {
  timestamps: number[]
  /** When the entry stops being useful; used to prune without knowing the window. */
  expiresAt: number
}

const buckets = new Map<string, Bucket>()
let lastPrune = Date.now()

let trustProxyWarned = false

function prune(now: number): void {
  // Drop entries whose window has fully elapsed so stale keys never linger.
  for (const [key, bucket] of buckets) {
    if (bucket.timestamps.length === 0 || now >= bucket.expiresAt) {
      buckets.delete(key)
    }
  }
  // Cap the map size: evict the oldest inserted keys when over budget so a
  // hostile flood of distinct keys cannot grow the process unboundedly.
  if (buckets.size > MAX_KEYS) {
    const excess = buckets.size - MAX_KEYS
    const keys = Array.from(buckets.keys())
    for (let i = 0; i < excess; i++) {
      buckets.delete(keys[i])
    }
  }
  lastPrune = now
}

/**
 * Fixed-window in-memory rate limiter.
 *
 * Suitable for a single server instance (local dev or a single-node deploy).
 * For multi-instance deployments use a shared store (Redis/Upstash).
 *
 * Memory is bounded: expired entries are pruned periodically and the map is
 * capped at MAX_KEYS.
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  if (now - lastPrune > PRUNE_INTERVAL_MS) {
    prune(now)
  }
  const entry = buckets.get(key)
  const timestamps = (entry?.timestamps ?? []).filter((t) => now - t < windowMs)
  const record = () => {
    buckets.set(key, { timestamps, expiresAt: now + windowMs })
    // Enforce the cap immediately after insertion too, otherwise a burst of
    // new keys can sit above the budget until the next call.
    if (buckets.size > MAX_KEYS) {
      prune(now)
    }
  }
  if (timestamps.length >= limit) {
    record()
    return true
  }
  timestamps.push(now)
  record()
  return false
}

/** Test helper: clear all windows. */
export function resetRateLimiter(): void {
  buckets.clear()
  lastPrune = Date.now()
}

/** Return the number of tracked keys. Useful for tests asserting the cap. */
export function getRateLimiterSize(): number {
  return buckets.size
}

/** Pure parser: first hop of an X-Forwarded-For list. Does not apply trust policy. */
export function parseClientIp(headerValue: string | null): string {
  return headerValue?.split(',')[0]?.trim() || 'unknown'
}

/**
 * Resolves the client IP behind the proxy-trust policy.
 *
 * Proxy headers (X-Forwarded-For / X-Real-IP) are only honored when
 * TRUST_PROXY=true, i.e. when the app actually sits behind a trusted reverse
 * proxy that sets them. Otherwise clients could spoof their source address and
 * bypass per-IP limits entirely, so we fall back to a single shared bucket
 * ('unknown') rather than trusting unverified input. Set TRUST_PROXY=true when
 * deploying behind such a proxy.
 */
export function resolveClientIp(forwardedFor: string | null, realIp: string | null): string {
  if (process.env.TRUST_PROXY === 'true') {
    const fromForwarded = parseClientIp(forwardedFor)
    if (fromForwarded !== 'unknown') return fromForwarded
    return parseClientIp(realIp)
  }
  // Fail closed: without a trusted proxy we cannot verify any client-supplied
  // address, so we must NOT trust X-Forwarded-For / X-Real-IP (spoofable).
  // Returning a single shared bucket keeps the limiter conservative and
  // prevents header spoofing from bypassing per-IP limits. Deployments that
  // sit behind a reverse proxy MUST set TRUST_PROXY=true (see DEPLOYMENT.md);
  // otherwise all clients share this bucket and login limiting is effectively
  // global. We deliberately do not derive a "fingerprint" from spoofable
  // headers (User-Agent etc.) because that would create a false sense of
  // isolation while remaining trivially bypassable.
  if (!trustProxyWarned && (forwardedFor || realIp)) {
    trustProxyWarned = true
    console.warn(
      '[rate-limit] TRUST_PROXY is not enabled; ignoring X-Forwarded-For/X-Real-IP ' +
        'and using a single shared client bucket. Set TRUST_PROXY=true when running ' +
        'behind a trusted reverse proxy, otherwise all clients share one rate-limit budget.',
    )
  }
  return 'unknown'
}
