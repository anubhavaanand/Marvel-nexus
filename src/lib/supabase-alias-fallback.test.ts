import { describe, it, expect, beforeEach, vi } from 'vitest'

/**
 * Issue #343: when the DB slug trigger is missing (fresh restore), the indexed
 * slug lookup can miss even though the alias matches. getHeroBySlug must fall
 * back to comparing normalized aliases instead of returning null.
 */

const HERO_ROW = {
  id: 1,
  slug: null, // trigger missing -> column not populated
  alias: 'Anthony Stark',
  name: 'Iron Man',
  canon_events: [],
  hero_movies: [],
}

type Mode =
  | { kind: 'slug-miss' }
  | { kind: 'alias-list'; rows: unknown[] }
  | { kind: 'miss-then-alias-list'; rows: unknown[] }

function makeClient(mode: Mode) {
  const from = () => {
    const builder: Record<string, unknown> = {}
    let appliedEq: { col: string; val: string } | null = null

    builder.select = () => builder
    builder.limit = () => builder
    builder.eq = (col: string, val: string) => {
      appliedEq = { col, val }
      return builder
    }
    builder.maybeSingle = () =>
      Promise.resolve({
        // #503: after the alias list picks an id we re-fetch that row by id.
        data:
          mode.kind === 'miss-then-alias-list'
            ? appliedEq?.col === 'slug'
              ? null
              : HERO_ROW
            : mode.kind === 'slug-miss' && appliedEq?.col === 'slug'
              ? null
              : HERO_ROW,
        error: null,
      })
    // Plain select (fallback path): resolves like an awaited Postgrest builder.
    builder.then = (resolve: (v: unknown) => void) => {
      if (mode.kind === 'alias-list') {
        resolve({ data: mode.rows, error: null })
      } else if (mode.kind === 'miss-then-alias-list') {
        resolve({ data: mode.rows, error: null })
      } else {
        resolve({ data: null, error: null })
      }
    }
    return builder
  }
  return { from }
}

describe('getHeroBySlug alias fallback (#343)', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
    vi.resetModules()
  })

  it('falls back to alias comparison when the slug lookup misses', async () => {
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: () => makeClient({ kind: 'miss-then-alias-list', rows: [HERO_ROW] }) as never,
    }))
    vi.doMock('./service-supabase', () => ({
      getServiceSupabase: () =>
        makeClient({ kind: 'miss-then-alias-list', rows: [HERO_ROW] }) as never,
    }))
    vi.doMock('./tmdb', () => ({ searchPerson: () => null }))

    const mod = await import('./supabase')
    // Slug column miss, then alias list resolves the hero via normalized alias.
    const hero = await mod.getHeroBySlug('anthony-stark')
    expect(hero).not.toBeNull()
    expect(hero?.name).toBe('Iron Man')
  })

  it('admin lookup falls back too (#509)', async () => {
    vi.doMock('@supabase/supabase-js', () => ({
      createClient: () => makeClient({ kind: 'slug-miss' }) as never,
    }))
    vi.doMock('./service-supabase', () => ({
      getServiceSupabase: () =>
        makeClient({ kind: 'miss-then-alias-list', rows: [HERO_ROW] }) as never,
    }))
    vi.doMock('./tmdb', () => ({ searchPerson: () => null }))

    const mod = await import('./supabase')
    const hero = await mod.getHeroBySlugForAdmin('anthony-stark')
    expect(hero).not.toBeNull()
    expect(hero?.name).toBe('Iron Man')
  })
})
