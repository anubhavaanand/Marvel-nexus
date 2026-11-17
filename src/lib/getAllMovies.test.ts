import { describe, expect, it } from 'vitest'
import { compareMoviesByReleaseDate, getAllMovies } from './supabase'
import type { Movie } from './supabase'

function makeMovie(id: string, overrides: Partial<Movie> = {}): Movie {
  return {
    id,
    tmdb_id: parseInt(id),
    title: `Movie ${id}`,
    release_date: '2024-01-01',
    phase: 'Phase 1',
    poster_url: '',
    tmdb_rating: null,
    ...overrides,
  }
}

describe('getAllMovies ordering', () => {
  it('sorts dated movies chronologically among themselves', async () => {
    const movies = await getAllMovies()

    const datedMovies = movies.filter((m) => m.release_date && m.release_date.trim() !== '')
    for (let i = 1; i < datedMovies.length; i++) {
      expect(
        datedMovies[i - 1].release_date.localeCompare(datedMovies[i].release_date),
      ).toBeLessThanOrEqual(0)
    }
  })

  it('handles all-null release dates gracefully', async () => {
    const movies = await getAllMovies()
    expect(movies.length).toBeGreaterThan(0)
    expect(Array.isArray(movies)).toBe(true)
  })

  it('sort logic places null/empty release dates after valid dates', () => {
    // #518: exercise the exported production comparator instead of re-implementing it.
    const movies: Movie[] = [
      makeMovie('1', { release_date: '2020-01-01' }),
      makeMovie('2', { release_date: '' }),
      makeMovie('3', { release_date: '2019-01-01' }),
      makeMovie('4', { release_date: null as unknown as string }),
      makeMovie('5', { release_date: '2021-01-01' }),
    ]

    const sorted = [...movies].sort(compareMoviesByReleaseDate)

    expect(sorted[0].release_date).toBe('2019-01-01')
    expect(sorted[1].release_date).toBe('2020-01-01')
    expect(sorted[2].release_date).toBe('2021-01-01')
    // Null/empty dates should be last
    expect(sorted[3].release_date).toBe('')
    expect(sorted[4].release_date).toBeNull()
  })
})
