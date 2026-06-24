// Client-side TMDB image helper — searches TMDB via our server API proxy
// so the API key stays server-side only.

const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

const tmdbCache = new Map<string, string | null>()

export async function getTmdbImageUrl(name: string, alias: string): Promise<string | null> {
  const key = `${name}|${alias}`
  if (tmdbCache.has(key)) return tmdbCache.get(key) ?? null

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
}
