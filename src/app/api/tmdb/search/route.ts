import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited } from '@/lib/rate-limit'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const RATE_LIMIT_PER_MINUTE = 20
const MAX_QUERY_LENGTH = 100

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')
  if (!query || !query.trim()) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 })
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  if (isRateLimited(`tmdb-search:${ip}`, RATE_LIMIT_PER_MINUTE, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
      { next: { revalidate: 3600 }, signal: AbortSignal.timeout(5000) },
    )

    if (!res.ok) {
      // Do not expose upstream provider details to clients.
      console.error('TMDB upstream error:', res.status)
      return NextResponse.json({ error: 'Failed to search TMDB' }, { status: 502 })
    }

    const data = await res.json()
    const person = data.results?.[0] || null

    return NextResponse.json(
      { person },
      { headers: { 'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400' } },
    )
  } catch (error) {
    console.error('TMDB search error:', error)
    return NextResponse.json({ error: 'Failed to search TMDB' }, { status: 500 })
  }
}
