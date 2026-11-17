import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SEED_MOVIES } from '@/lib/seed-data'

// Narrow in-memory double for Supabase that records persisted state, so tests
// assert on outcomes (what got written) rather than mock call wiring.
const db = new Map<string, Record<string, unknown>>()

function makeClient() {
  return {
    from: () => ({
      upsert: async (rows: Array<Record<string, unknown>>) => {
        for (const r of rows) db.set(String(r.id), { ...db.get(String(r.id)), ...r })
        return { error: null }
      },
      update: (patch: Record<string, unknown>) => ({
        eq: async (col: string, val: unknown) => {
          for (const [k, v] of db) {
            if (v[col] === val) db.set(k, { ...v, ...patch })
          }
          return { error: null }
        },
      }),
      select: async () => ({ data: [...db.values()], error: null }),
    }),
  }
}

vi.mock('@/lib/service-supabase', () => ({
  getServiceSupabase: () => makeClient(),
}))

vi.mock('./admin', () => ({
  checkAdminAuthAction: vi.fn().mockResolvedValue(true),
}))

vi.mock('@/lib/action-rate-limit', () => ({
  checkActionRateLimit: vi.fn().mockResolvedValue({ ok: true }),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  db.clear()
  process.env.TMDB_API_KEY = 'test-key'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
  fetchMock = vi.fn(async () => new Response(JSON.stringify({ results: [] }), { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)
  for (const m of SEED_MOVIES)
    db.set(m.id, {
      id: m.id,
      title: m.title,
      release_date: m.release_date,
      phase: m.phase,
      poster_url: m.poster_url,
    })
})

afterEach(() => {
  delete process.env.TMDB_API_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  vi.unstubAllGlobals()
})

function tmdbTitleEchoResponse(
  releaseDate: string | null,
  id = 1,
  posterPath: string | null = null,
) {
  return async (url: string) => {
    const query = decodeURIComponent(new URL(url).searchParams.get('query') ?? 'Iron Man')
    return new Response(
      JSON.stringify({
        results: [
          {
            id,
            release_date: releaseDate,
            poster_path: posterPath,
            title: query,
            original_title: query,
          },
        ],
      }),
      { status: 200 },
    )
  }
}

describe('syncMoviesAction phase sync', () => {
  it('recomputes phase when TMDB changes release_date', async () => {
    fetchMock.mockImplementation(tmdbTitleEchoResponse('2014-08-01'))
    const { syncMoviesAction } = await import('./seed')
    const result = await syncMoviesAction()
    expect(result.ok).toBe(true)
    const ironMan = [...db.values()].find((r) => r.title === 'Iron Man')!
    expect(ironMan.phase).toBe('Phase 2')
    expect(ironMan.release_date).toBe('2014-08-01')
  })

  it('recomputes phase to Phase 5 when enriched release date lands in Phase 5 range', async () => {
    fetchMock.mockImplementation(tmdbTitleEchoResponse('2024-07-26'))
    const { syncMoviesAction } = await import('./seed')
    await syncMoviesAction()
    // at least one movie's phase became Phase 5
    expect([...db.values()].some((r) => r.phase === 'Phase 5')).toBe(true)
  })

  it('sets phase to null for seed movies that have no phase', async () => {
    fetchMock.mockImplementation(tmdbTitleEchoResponse('2008-05-02'))
    const { syncMoviesAction } = await import('./seed')
    await syncMoviesAction()
    const xmen = [...db.values()].find((r) => r.title === 'X-Men')!
    expect(xmen.phase).toBeNull()
  })

  it('keeps seed release_date and recomputes phase when TMDB returns no release_date', async () => {
    fetchMock.mockImplementation(tmdbTitleEchoResponse(null))
    const { syncMoviesAction } = await import('./seed')
    await syncMoviesAction()
    const ironMan = [...db.values()].find((r) => r.title === 'Iron Man')!
    expect(ironMan.release_date).toBe('2008-05-02')
    expect(ironMan.phase).toBe('Phase 1')
  })

  it('skips TMDB results whose title does not match the queried movie', async () => {
    fetchMock.mockImplementation(
      async () =>
        new Response(
          JSON.stringify({
            results: [
              {
                id: 99,
                release_date: '1999-01-01',
                title: 'A Completely Different Movie',
                original_title: 'A Completely Different Movie',
              },
            ],
          }),
          { status: 200 },
        ),
    )
    const { syncMoviesAction } = await import('./seed')
    const result = await syncMoviesAction()
    expect(result.ok).toBe(true)
    expect(result.enriched).toBe(0)
    // no movie gained a tmdb_id
    expect([...db.values()].every((r) => r.tmdb_id === undefined)).toBe(true)
  })
})
