import type { Movie } from '@/lib/supabase'

export const TIMELINE_PHASES = [
  'Phase 1',
  'Phase 2',
  'Phase 3',
  'Phase 4',
  'Phase 5',
  'Phase 6',
] as const

/**
 * Bucket movies into saga phases (#529). Extracted from the timeline page so
 * tests exercise the production helper instead of a copy of the logic.
 */
export function bucketMoviesByPhase(movies: Movie[]): Record<string, Movie[]> {
  const phases: Record<string, Movie[]> = {}
  for (const phase of TIMELINE_PHASES) {
    phases[phase] = movies.filter((m) => m.phase === phase)
  }
  phases.Unphased = movies.filter((m) => m.phase == null)
  return phases
}
