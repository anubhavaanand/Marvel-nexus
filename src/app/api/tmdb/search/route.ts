import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, resolveClientIp } from '@/lib/rate-limit'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const RATE_LIMIT_PER_MINUTE = 10
const MAX_QUERY_LENGTH = 100
const CACHE_TTL_MS = 3600_000
const CACHE_MAX_ENTRIES = 200

interface CacheEntry {
  person: unknown
  expiresAt: number
}

const cache = new Map<string, CacheEntry>()

function getCached(query: string): unknown | undefined {
  const entry = cache.get(query)
  if (!entry) return undefined
  if (Date.now() >= entry.expiresAt) {
    cache.delete(query)
    return undefined
  }
  // LRU: move to end
  cache.delete(query)
  cache.set(query, entry)
  return entry.person
}

function setCached(query: string, person: unknown): void {
  // prune expired on insert
  const now = Date.now()
  for (const [k, v] of cache) {
    if (now >= v.expiresAt) cache.delete(k)
  }
  if (cache.size >= CACHE_MAX_ENTRIES) {
    const first = cache.keys().next().value
    if (first !== undefined) cache.delete(first)
  }
  cache.set(query, { person, expiresAt: now + CACHE_TTL_MS })
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

  const cached = getCached(trimmed)
  if (cached !== undefined) {
    return NextResponse.json(
      { person: cached },
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
    const res = await fetch(`${BASE_URL}/search/person?query=${encodeURIComponent(trimmed)}`, {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      console.error('TMDB upstream error:', res.status)
      return NextResponse.json({ error: 'Failed to search TMDB' }, { status: 502 })
    }

    const data = await res.json()
    const person = data.results?.[0] || null

    setCached(trimmed, person)

    return NextResponse.json(
      { person },
      { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } },
    )
  } catch (error) {
    console.error('TMDB search error:', error)
    return NextResponse.json({ error: 'Failed to search TMDB' }, { status: 500 })
  }
}

export function resetTmdbSearchCache(): void {
  cache.clear()
}
