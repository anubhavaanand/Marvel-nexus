// Client-side TMDB image helper — used as fallback when server-side enrichment
// can't reach the API (e.g. static build). Searches TMDB for character images
// by name and caches results in sessionStorage.

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

const tmdbCache = new Map<string, string | null>()

export async function getTmdbImageUrl(name: string, alias: string): Promise<string | null> {
  const key = `${name}|${alias}`
  if (tmdbCache.has(key)) return tmdbCache.get(key) ?? null

  if (!TMDB_API_KEY) return null

  try {
    const search = name || alias
    const res = await fetch(
      `${BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(search)}`,
      { signal: AbortSignal.timeout(3000) }
    )
    if (!res.ok) return null
    const data = await res.json()
    const path = data.results?.[0]?.profile_path
    if (!path) { tmdbCache.set(key, null); return null }

    const url = `${IMAGE_BASE}${path}`
    tmdbCache.set(key, url)
    return url
  } catch {
    tmdbCache.set(key, null)
    return null
  }
}
