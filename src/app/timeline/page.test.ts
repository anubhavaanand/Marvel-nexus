import { describe, expect, it } from 'vitest'
import type { Movie } from '@/lib/supabase'

// #529: exercise the production helper instead of re-implementing bucketing.
import { bucketMoviesByPhase } from '@/lib/movie-phases'

const getPhases = bucketMoviesByPhase

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

describe('timeline phase bucketing', () => {
  it('places movies with null phase in Unphased bucket', () => {
    const movies = [
      makeMovie('1', { phase: 'Phase 1' }),
      makeMovie('2', { phase: null }),
      makeMovie('3', { phase: 'Phase 2' }),
      makeMovie('4', { phase: undefined }),
    ]

    const phases = getPhases(movies)

    expect(phases['Phase 1']).toHaveLength(1)
    expect(phases['Phase 2']).toHaveLength(1)
    expect(phases.Unphased).toHaveLength(2)
    expect(phases.Unphased.map((m) => m.id)).toEqual(['2', '4'])
  })

  it('has Unphased as a distinct bucket key (not "Unphased / Other")', () => {
    const movies = [makeMovie('1', { phase: null })]
    const phases = getPhases(movies)

    expect(phases).toHaveProperty('Unphased')
    expect(phases).not.toHaveProperty('Unphased / Other')
  })

  it('includes Phase 6 bucket', () => {
    const movies = [makeMovie('1', { phase: 'Phase 6' })]
    const phases = getPhases(movies)

    expect(phases['Phase 6']).toHaveLength(1)
    expect(phases.Unphased).toHaveLength(0)
  })

  it('filters out empty buckets when passed to TimelineSagaTabs', () => {
    const movies = [makeMovie('1', { phase: 'Phase 1' })]
    const phases = getPhases(movies)

    const INFINITY = ['Phase 1', 'Phase 2', 'Phase 3']
    const MULTIVERSE = ['Phase 4', 'Phase 5', 'Phase 6']

    const entries = Object.entries(phases).filter(([phase, movies]) => {
      if (movies.length === 0) return false
      // infinity saga
      if (INFINITY.includes(phase)) return true
      // multiverse saga
      if (MULTIVERSE.includes(phase)) return true
      // unphased (shown in 'all' only)
      return phase === 'Unphased'
    })

    expect(entries.map(([p]) => p)).toEqual(['Phase 1'])
  })

  it('includes Unphased in "all" saga but not in infinity/multiverse', () => {
    const movies = [makeMovie('1', { phase: 'Phase 1' }), makeMovie('2', { phase: null })]
    const phases = getPhases(movies)

    const INFINITY = ['Phase 1', 'Phase 2', 'Phase 3']
    const MULTIVERSE = ['Phase 4', 'Phase 5', 'Phase 6']

    // All saga
    const allEntries = Object.entries(phases).filter(([, movies]) => {
      if (movies.length === 0) return false
      return true
    })
    expect(allEntries.map(([p]) => p).sort()).toEqual(['Phase 1', 'Unphased'])

    // Infinity saga
    const infinityEntries = Object.entries(phases).filter(([p, movies]) => {
      if (movies.length === 0) return false
      return INFINITY.includes(p)
    })
    expect(infinityEntries.map(([p]) => p)).toEqual(['Phase 1'])

    // Multiverse saga
    const multiverseEntries = Object.entries(phases).filter(([p, movies]) => {
      if (movies.length === 0) return false
      return MULTIVERSE.includes(p)
    })
    expect(multiverseEntries.map(([p]) => p)).toEqual([])
  })
})
