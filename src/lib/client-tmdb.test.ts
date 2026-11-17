import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const MOCK_FETCH_RESPONSES = new Map<string, { status: number; body: unknown }>()

// #465: the cache is time-based; pin the clock so the assertions describe state
// transitions instead of elapsed wall time (the flaky failure mode).
beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

function setupFetchMock() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input)
      const entry = MOCK_FETCH_RESPONSES.get(url)
      if (!entry) {
        return new Response(JSON.stringify({ error: 'not mocked' }), { status: 404 })
      }
      return new Response(JSON.stringify(entry.body), { status: entry.status })
    }),
  )
}

beforeEach(() => {
  MOCK_FETCH_RESPONSES.clear()
  vi.resetModules()
  setupFetchMock()
})

describe('client-tmdb', () => {
  it('caches results per key', async () => {
    const { getTmdbImageUrl } = await import('./client-tmdb')
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?type=person&query=Tony%20Stark', {
      status: 200,
      body: { person: { profile_path: '/abc.jpg' } },
    })
    const first = await getTmdbImageUrl('Tony Stark', 'Iron Man')
    const second = await getTmdbImageUrl('Tony Stark', 'Iron Man')
    expect(first).toBe('https://image.tmdb.org/t/p/w500/abc.jpg')
    expect(second).toBe(first)
  })

  it('dedupes concurrent identical lookups', async () => {
    const { getTmdbImageUrl } = await import('./client-tmdb')
    let calls = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        calls++
        const url = String(input)
        const entry = MOCK_FETCH_RESPONSES.get(url)
        return new Response(JSON.stringify(entry?.body ?? {}), { status: entry?.status ?? 404 })
      }),
    )
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?type=person&query=Tony%20Stark', {
      status: 200,
      body: { person: { profile_path: '/abc.jpg' } },
    })
    await Promise.all([
      getTmdbImageUrl('Tony Stark', 'Iron Man'),
      getTmdbImageUrl('Tony Stark', 'Iron Man'),
      getTmdbImageUrl('Tony Stark', 'Iron Man'),
    ])
    expect(calls).toBe(1)
  })

  it('returns null for missing profile path', async () => {
    const { getTmdbImageUrl } = await import('./client-tmdb')
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?type=person&query=Nobody', {
      status: 200,
      body: { person: null },
    })
    expect(await getTmdbImageUrl('Nobody X', 'Nobody')).toBeNull()
  })

  it('handles 429 with one retry then recovers', async () => {
    // Real timers here: the backoff is a genuine setTimeout we let elapse.
    vi.useRealTimers()
    const { getTmdbImageUrl } = await import('./client-tmdb')
    let attempts = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        attempts++
        if (attempts === 1) {
          return new Response(JSON.stringify({ error: 'rate limited' }), { status: 429 })
        }
        return new Response(JSON.stringify({ person: { profile_path: '/x.jpg' } }), { status: 200 })
      }),
    )
    const result = await getTmdbImageUrl('Retry Man', 'Retry Man')
    expect(result).toBe('https://image.tmdb.org/t/p/w500/x.jpg')
    expect(attempts).toBe(2)
  })

  it('keeps null when TMDB is unconfigured (server returns 500)', async () => {
    const { getTmdbImageUrl } = await import('./client-tmdb')
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?type=person&query=Unconfigured', {
      status: 500,
      body: { error: 'TMDB API key not configured' },
    })
    expect(await getTmdbImageUrl('Anyone', 'Unconfigured')).toBeNull()
  })

  it('expires cached entries after the TTL using pinned time (#465)', async () => {
    const { getTmdbImageUrl } = await import('./client-tmdb')
    let calls = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        calls += 1
        return new Response(JSON.stringify({ person: { profile_path: '/ttl.jpg' } }), {
          status: 200,
        })
      }),
    )
    expect(await getTmdbImageUrl('TTL Man', 'TTL')).toBe('https://image.tmdb.org/t/p/w500/ttl.jpg')
    vi.advanceTimersByTime(3_600_001)
    expect(await getTmdbImageUrl('TTL Man', 'TTL')).toBe('https://image.tmdb.org/t/p/w500/ttl.jpg')
    expect(calls).toBe(2)
  })

  it('uses the movie endpoint and poster_path for film lookups (#419)', async () => {
    const { getTmdbImageUrl } = await import('./client-tmdb')
    let requestedUrl = ''
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        requestedUrl = String(input)
        return new Response(JSON.stringify({ movie: { poster_path: '/poster.jpg' } }), {
          status: 200,
        })
      }),
    )
    const url = await getTmdbImageUrl('The Avengers', 'The Avengers', 'movie')
    expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg')
    expect(requestedUrl).toContain('/api/tmdb/search?type=movie')
  })
})
