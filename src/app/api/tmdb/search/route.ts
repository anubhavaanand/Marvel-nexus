import { NextRequest, NextResponse } from 'next/server'

const TMDB_API_KEY = process.env.TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query')
  if (!query) {
    return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  }

  if (!TMDB_API_KEY) {
    return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 })
  }

  try {
    const res = await fetch(
      `${BASE_URL}/search/person?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`,
      { signal: AbortSignal.timeout(5000) }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `TMDB API error: ${res.status}` },
        { status: res.status }
      )
    }

    const data = await res.json()
    const person = data.results?.[0] || null

    return NextResponse.json({ person })
  } catch (error) {
    console.error('TMDB search error:', error)
    return NextResponse.json({ error: 'Failed to search TMDB' }, { status: 500 })
  }
}
