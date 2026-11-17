'use client'

// #479: this is the deliberately curated viewing order (it carries runtime,
// per-franchise grouping and story ordering), not the canonical movie catalog —
// that lives in src/lib/seed-data.ts and is what /timeline and getAllMovies use.
// Keep titles aligned when adding films to both.

// Client-safe watch-order metadata: types and colour maps only.
// The curated dataset lives in ./data and is rendered on the server (#822).

export interface WatchItem {
  id: number
  title: string
  franchise: 'MCU' | 'DC'
  type: 'movie' | 'series'
  year: string
  release_date: string | null
  phase: string
  chronologicalOrder: number
  releaseOrder: number
  runtime?: string
  rating?: number
  platform: 'Disney+' | 'Netflix' | 'Theater' | 'HBO Max'
  description: string
  /** Poster already known for this title; avoids a TMDB lookup (#419). */
  poster_url?: string
}

export const phaseColors: Record<string, { primary: string; bg: string; text: string }> = {
  'Phase 1': {
    primary: 'var(--franchise-mcu)',
    bg: 'bg-[var(--franchise-mcu)]/10',
    text: 'text-[var(--franchise-mcu)]',
  },
  'Phase 2': { primary: '#a855f7', bg: 'bg-purple-500/10', text: 'text-purple-500' },
  'Phase 3': {
    primary: 'var(--franchise-spider)',
    bg: 'bg-[var(--franchise-spider)]/10',
    text: 'text-[var(--franchise-spider)]',
  },
  'Phase 4': {
    primary: 'var(--success)',
    bg: 'bg-[var(--success)]/10',
    text: 'text-[var(--success)]',
  },
  'Phase 5': {
    primary: 'var(--franchise-anime)',
    bg: 'bg-[var(--franchise-anime)]/10',
    text: 'text-[var(--franchise-anime)]',
  },
  'Phase 6': {
    primary: 'var(--accent)',
    bg: 'bg-[var(--accent)]/10',
    text: 'text-[var(--accent)]',
  },
  DCEU: {
    primary: 'var(--franchise-dc)',
    bg: 'bg-[var(--franchise-dc)]/10',
    text: 'text-[var(--franchise-dc)]',
  },
  Elseworlds: { primary: 'var(--meta)', bg: 'bg-[var(--surface)]', text: 'text-[var(--muted)]' },
}
