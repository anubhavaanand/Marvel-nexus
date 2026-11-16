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

function evictExpired(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.expiresAt) {
      buckets.delete(key)
    }
  }
}

function enforceCap(now: number): void {
  // Evict expired entries first so legitimate recent users survive a flood.
  evictExpired(now)
  // Then evict least-recently-used (front of Map = oldest access).
  if (buckets.size > MAX_KEYS) {
    const excess = buckets.size - MAX_KEYS
    const keys = Array.from(buckets.keys())
    for (let i = 0; i < excess; i++) {
      buckets.delete(keys[i])
    }
  }
}

function prune(now: number): void {
  evictExpired(now)
  enforceCap(now)
  lastPrune = now
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  if (now - lastPrune > PRUNE_INTERVAL_MS) {
    prune(now)
  }
  const existing = buckets.get(key)
  // Per-key expiry: drop stale entry on access.
  if (existing && now >= existing.expiresAt) {
    buckets.delete(key)
  }
  const entry = buckets.get(key)
  const timestamps = (entry?.timestamps ?? []).filter((t) => now - t < windowMs)
  // Evict before inserting a brand-new key when at capacity.
  if (!entry && buckets.size >= MAX_KEYS) {
    enforceCap(now)
  }
  const record = () => {
    const bucket: Bucket = { timestamps, expiresAt: now + windowMs }
    // Move to end (most-recently-used) by delete+set.
    buckets.delete(key)
    buckets.set(key, bucket)
    if (buckets.size > MAX_KEYS) {
      enforceCap(now)
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

export function resetRateLimiter(): void {
  buckets.clear()
  lastPrune = Date.now()
}

export function getRateLimiterSize(): number {
  return buckets.size
}

function trustedProxyDepth(): number {
  const raw = process.env.TRUST_PROXY_DEPTH
  const n = raw ? Number.parseInt(raw, 10) : NaN
  return Number.isFinite(n) && n >= 0 ? n : 1
}

export function parseClientIp(headerValue: string | null, trustedProxyCount: number = 1): string {
  if (!headerValue) return 'unknown'
  const entries = headerValue
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
  if (entries.length === 0) return 'unknown'
  const depth = Math.max(0, Math.min(trustedProxyCount, entries.length - 1))
  const index = entries.length - depth - 1
  return entries[index] || 'unknown'
}

export function resolveClientIp(forwardedFor: string | null, realIp: string | null): string {
  if (process.env.TRUST_PROXY === 'true') {
    const depth = trustedProxyDepth()
    const fromForwarded = parseClientIp(forwardedFor, depth)
    if (fromForwarded !== 'unknown') return fromForwarded
    return parseClientIp(realIp, depth)
  }
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
