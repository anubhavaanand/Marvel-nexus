import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, resolveClientIp } from '@/lib/rate-limit'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const RATE_LIMIT_PER_MINUTE = 10
const MAX_QUERY_LENGTH = 100
const CACHE_TTL_MS = 3600_000
const CACHE_MAX_ENTRIES = 200

interface CacheEntry {
  // #419: the proxy serves both TMDB search kinds; each response carries the
  // matched shape so clients can read either field.
  person: unknown
  movie: unknown
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

const inflight = new Map<string, Promise<unknown>>()

function cacheKey(type: 'person' | 'movie', query: string): string {
  return `${type}:${query}`
}

function getCached(type: 'person' | 'movie', query: string): unknown | undefined {
  const entry = cache.get(cacheKey(type, query))
  if (!entry) return undefined
  if (Date.now() >= entry.expiresAt) {
    cache.delete(cacheKey(type, query))
    return undefined
  }
  cache.delete(cacheKey(type, query))
  cache.set(cacheKey(type, query), entry)
  return entry[type]
}

function setCached(type: 'person' | 'movie', query: string, value: unknown): void {
  const now = Date.now()
  for (const [k, v] of cache) {
    if (now >= v.expiresAt) cache.delete(k)
  }
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const first = cache.keys().next().value
    if (first !== undefined) cache.delete(first)
  }
  cache.set(cacheKey(type, query), {
    person: type === 'person' ? value : null,
    movie: type === 'movie' ? value : null,
    expiresAt: now + CACHE_TTL_MS,
  })
}

async function fetchFromTmdb(type: 'person' | 'movie', trimmed: string): Promise<unknown> {
  const cached = getCached(type, trimmed)
  if (cached !== undefined) return cached

  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not configured')
  }

  const path = type === 'person' ? '/search/person' : '/search/movie'
  const res = await fetch(`${BASE_URL}${path}?query=${encodeURIComponent(trimmed)}`, {
    headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(5000),
  })

  if (!res.ok) {
    console.error('TMDB upstream error:', res.status)
    throw new Error('Failed to search TMDB')
  }

  const data = await res.json()
  const match = data.results?.[0] || null
  setCached(type, trimmed, match)
  return match
}

function coalescedFetch(type: 'person' | 'movie', trimmed: string): Promise<unknown> {
  const key = cacheKey(type, trimmed)
  const existing = inflight.get(key)
  if (existing) return existing
  const promise = fetchFromTmdb(type, trimmed).finally(() => {
    inflight.delete(key)
  })
  inflight.set(key, promise)
  return promise
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')
  if (!query || !query.trim()) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 })
  }

  const trimmed = query.trim()
  // #419: film titles must hit the movie endpoint, not the person endpoint.
  const rawType = request.nextUrl.searchParams.get('type')
  const type: 'person' | 'movie' = rawType === 'movie' ? 'movie' : 'person'

  const cached = getCached(type, trimmed)
  if (cached !== undefined) {
    return NextResponse.json(
      { person: type === 'person' ? cached : null, movie: type === 'movie' ? cached : null },
      {
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          'X-Cache': 'HIT',
        },
      },
    )
  }

  const ip = resolveClientIp(
    request.headers.get('x-forwarded-for'),
    request.headers.get('x-real-ip'),
  )
  if (isRateLimited(`tmdb-search:${ip}`, RATE_LIMIT_PER_MINUTE, 60_000)) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: 60 },
      { status: 429, headers: { 'Retry-After': '60' } },
    )
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  try {
    const match = await coalescedFetch(type, trimmed)
    return NextResponse.json(
      { person: type === 'person' ? match : null, movie: type === 'movie' ? match : null },
      { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } },
    )
  } catch (error) {
    console.error('TMDB search error:', error)
    const message = error instanceof Error ? error.message : ''
    if (message === 'TMDB API key not configured') {
      return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
    }
    return NextResponse.json({ error: 'Failed to search TMDB' }, { status: 502 })
  }
}
