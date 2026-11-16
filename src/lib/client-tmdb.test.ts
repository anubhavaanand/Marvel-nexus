import { describe, expect, it, vi, beforeEach } from 'vitest'

const MOCK_FETCH_RESPONSES = new Map<string, { status: number; body: unknown }>()

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
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?query=Tony%20Stark', {
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
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?query=Tony%20Stark', {
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
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?query=Nobody', {
      status: 200,
      body: { person: null },
    })
    expect(await getTmdbImageUrl('Nobody X', 'Nobody')).toBeNull()
  })

  it('handles 429 with one retry then recovers', async () => {
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
    MOCK_FETCH_RESPONSES.set('/api/tmdb/search?query=Unconfigured', {
      status: 500,
      body: { error: 'TMDB API key not configured' },
    })
    expect(await getTmdbImageUrl('Anyone', 'Unconfigured')).toBeNull()
  })
})
