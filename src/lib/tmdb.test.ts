import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMCUPhase } from './tmdb'

describe('getMCUPhase', () => {
  it.each([
    ['2008-05-02', 'Phase 1'],
    ['2012-05-04', 'Phase 1'],
    ['2015-05-01', 'Phase 2'],
    ['2019-04-26', 'Phase 3'],
    ['2022-11-11', 'Phase 4'],
    ['2024-07-26', 'Phase 5'],
    ['2025-02-14', 'Phase 6'],
  ])('maps %s to %s', (releaseDate, expected) => {
    expect(getMCUPhase(releaseDate)).toBe(expected)
  })

  // #461: invalid/empty dates must not silently become Phase 6.
  it.each([[''], ['not-a-date'], ['2025-99-99']] as const)(
    'returns null for invalid date %p',
    (releaseDate: string) => {
      expect(getMCUPhase(releaseDate)).toBeNull()
    },
  )
})

describe('searchPerson (#455)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('prefers an Acting result over a higher-ranked non-acting one', async () => {
    process.env.TMDB_API_KEY = 'test-key'
    vi.resetModules()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              results: [
                { id: 1, name: 'Stunt Double', known_for_department: 'Crew' },
                { id: 2, name: 'Actual Actor', known_for_department: 'Acting' },
              ],
            }),
            { status: 200 },
          ),
      ),
    )
    const { searchPerson } = await import('./tmdb')
    const person = await searchPerson('Some Hero')
    expect(person?.id).toBe(2)
  })

  it('falls back to the first result when TMDB omits known_for_department', async () => {
    process.env.TMDB_API_KEY = 'test-key'
    vi.resetModules()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(JSON.stringify({ results: [{ id: 7, name: 'Legacy Entry' }] }), {
            status: 200,
          }),
      ),
    )
    const { searchPerson } = await import('./tmdb')
    const person = await searchPerson('Some Hero')
    expect(person?.id).toBe(7)
  })
})
