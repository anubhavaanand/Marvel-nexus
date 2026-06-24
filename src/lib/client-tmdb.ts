// Client-side TMDB image helper — searches TMDB via our server API proxy
// so the API key stays server-side only.

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

const tmdbCache = new Map<string, string | null>()

// Concurrency Queue to avoid rate limiting / ECONNRESET from TMDB
interface QueueItem {
  fn: () => Promise<any>
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

const queue: QueueItem[] = []
let activeCount = 0
const MAX_CONCURRENT = 1 // Fully sequential processing

function processQueue() {
  if (activeCount >= MAX_CONCURRENT || queue.length === 0) return

  const item = queue.shift()
  if (!item) return

  activeCount++
  item.fn()
    .then(item.resolve)
    .catch(item.reject)
    .finally(() => {
      activeCount--
      // Gentle stagger delay of 150ms between requests
      setTimeout(processQueue, 150)
    })
}

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject })
    processQueue()
  })
}

export async function getTmdbImageUrl(name: string, alias: string): Promise<string | null> {
  const key = `${name}|${alias}`
  if (tmdbCache.has(key)) return tmdbCache.get(key) ?? null

  return enqueue(async () => {
    try {
      const search = name || alias
      const res = await fetch(
        `/api/tmdb/search?query=${encodeURIComponent(search)}`,
        { signal: AbortSignal.timeout(5000) }
      )
      if (!res.ok) return null
      const data = await res.json()
      const path = data.person?.profile_path
      if (!path) { tmdbCache.set(key, null); return null }

      const url = `${IMAGE_BASE}${path}`
      tmdbCache.set(key, url)
      return url
    } catch {
      tmdbCache.set(key, null)
      return null
    }
  })
}
