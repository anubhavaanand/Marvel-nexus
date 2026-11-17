import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const mockUpsert = vi.fn().mockResolvedValue({ error: null })
const mockEq = vi.fn().mockResolvedValue({ error: null })
const mockUpdate = vi.fn().mockReturnValue({ eq: mockEq })
const mockFrom = vi.fn().mockReturnValue({
  upsert: mockUpsert,
  update: mockUpdate,
})

vi.mock('@/lib/service-supabase', () => ({
  getServiceSupabase: () => ({
    from: mockFrom,
  }),
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
  mockUpsert.mockClear()
  mockUpdate.mockClear()
  mockEq.mockClear()
  mockFrom.mockClear()
  process.env.TMDB_API_KEY = 'test-key'
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key'
  fetchMock = vi.fn(async () => new Response(JSON.stringify({ results: [] }), { status: 200 }))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  delete process.env.TMDB_API_KEY
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  vi.unstubAllGlobals()
})

/**
 * Realistic TMDB double for #418: the upstream result carries a title matching
 * the queried movie (otherwise the new title-match logic legitimately skips it).
 */
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
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        phase: 'Phase 2',
        release_date: '2014-08-01',
      }),
    )
  })

  it('recomputes phase to Phase 5 when enriched release date lands in Phase 5 range', async () => {
    fetchMock.mockImplementation(tmdbTitleEchoResponse('2024-07-26'))
    const { syncMoviesAction } = await import('./seed')
    await syncMoviesAction()
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        phase: 'Phase 5',
        release_date: '2024-07-26',
      }),
    )
  })

  it('sets phase to null for seed movies that have no phase', async () => {
    fetchMock.mockImplementation(tmdbTitleEchoResponse('2008-05-02'))
    const { syncMoviesAction } = await import('./seed')
    await syncMoviesAction()
    const nullPhaseCalls = mockUpdate.mock.calls.some((call) => call[0]?.phase === null)
    expect(nullPhaseCalls).toBe(true)
  })

  it('keeps seed release_date and recomputes phase when TMDB returns no release_date', async () => {
    fetchMock.mockImplementation(tmdbTitleEchoResponse(null))
    const { syncMoviesAction } = await import('./seed')
    await syncMoviesAction()
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        release_date: '2008-05-02',
        phase: 'Phase 1',
      }),
    )
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
    expect(mockUpdate).not.toHaveBeenCalled()
  })
})
