// Client-side TMDB image helper — searches TMDB via our server API proxy
// so the API key stays server-side only.

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

const TMDB_CACHE_TTL_MS = 3600_000
const TMDB_CACHE_MAX_ENTRIES = 200

interface TmdbCacheEntry {
  value: string | null
  expiresAt: number
}

const tmdbCache = new Map<string, TmdbCacheEntry>()

function getCached(key: string): string | null | undefined {
  const entry = tmdbCache.get(key)
  if (!entry) return undefined
  if (Date.now() >= entry.expiresAt) {
    tmdbCache.delete(key)
    return undefined
  }
  // LRU: move to end
  tmdbCache.delete(key)
  tmdbCache.set(key, entry)
  return entry.value
}

function setCached(key: string, value: string | null): void {
  const now = Date.now()
  // prune expired on insert
  for (const [k, v] of tmdbCache) {
    if (now >= v.expiresAt) tmdbCache.delete(k)
  }
  if (tmdbCache.size >= TMDB_CACHE_MAX_ENTRIES) {
    const first = tmdbCache.keys().next().value
    if (first !== undefined) tmdbCache.delete(first)
  }
  tmdbCache.set(key, { value, expiresAt: now + TMDB_CACHE_TTL_MS })
}

export function resetTmdbImageCache(): void {
  tmdbCache.clear()
}

// In-flight dedupe: concurrent lookups for the same term share one promise.
const inFlight = new Map<string, Promise<string | null>>()

// Concurrency queue to avoid rate limiting / ECONNRESET from TMDB.
interface QueueItem<T> {
  fn: () => Promise<T>
  resolve: (value: T) => void
  reject: (reason?: unknown) => void
}

const queue: QueueItem<unknown>[] = []
let activeCount = 0
const MAX_CONCURRENT = 4 // Bounded concurrency (was 1, fully sequential)

// How long to pause after a 429 before retrying once.
const RATE_LIMIT_COOLDOWN_MS = 2000

function processQueue() {
  if (activeCount >= MAX_CONCURRENT || queue.length === 0) return

  const item = queue.shift()
  if (!item) return

  activeCount++
  item
    .fn()
    .then(item.resolve)
    .catch(item.reject)
    .finally(() => {
      activeCount--
      setTimeout(processQueue, 0)
    })
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    queue.push({ fn, resolve, reject } as QueueItem<unknown>)
    processQueue()
  })
}

async function fetchWithRateLimitHandling(query: string): Promise<Response> {
  const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`, {
    signal: AbortSignal.timeout(5000),
  })
  if (res.status === 429) {
    // Back off briefly, then retry once. Never hammer the proxy.
    await new Promise((r) => setTimeout(r, RATE_LIMIT_COOLDOWN_MS))
    return fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(5000),
    })
  }
  return res
}

export async function getTmdbImageUrl(name: string, alias: string): Promise<string | null> {
  const key = `${name}|${alias}`
  const cached = getCached(key)
  if (cached !== undefined) return cached

  const flying = inFlight.get(key)
  if (flying) return flying

  let resolve!: (value: string | null) => void
  const promise = new Promise<string | null>((res) => {
    resolve = res
  })

  inFlight.set(key, promise)

  const run = async () => {
    let value: string | null = null
    try {
      const search = name || alias
      const res = await fetchWithRateLimitHandling(search)
      if (res.ok) {
        const data = await res.json()
        const path = data.person?.profile_path
        value = path ? `${IMAGE_BASE}${path}` : null
      }
    } catch {
      // keep value null; caller falls back to existing source
    }
    setCached(key, value)
    inFlight.delete(key)
    resolve(value)
  }

  enqueue(run)
  return promise
}
