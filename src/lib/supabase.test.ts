import { describe, expect, it, vi } from 'vitest'
import type { Hero } from './supabase'
import {
  getAllHeroes,
  getHeroBySlug,
  getHeroVisibility,
  isSupabaseConfigured,
  needsImageEnrichment,
} from './supabase'

describe('mock data fallback', () => {
  it('returns every mock hero when Supabase is not configured', async () => {
    const heroes = await getAllHeroes()
    expect(heroes.length).toBeGreaterThan(0)
    expect(heroes.every((hero) => hero.alias.length > 0)).toBe(true)
  })

  it('resolves a simple slug to its mock hero', async () => {
    const hero = await getHeroBySlug('iron-man')
    expect(hero?.alias).toBe('Iron Man')
  })

  it.each([
    ['spider-man', 'Spider-Man'],
    ['spider-gwen', 'Spider-Gwen'],
  ])('resolves hyphenated slug %s to %s', async (slug, alias) => {
    const hero = await getHeroBySlug(slug)
    expect(hero?.alias).toBe(alias)
  })
})

describe('needsImageEnrichment', () => {
  const withImage = (image_url: string) => ({ image_url }) as unknown as Hero

  it('flags missing or blank images', () => {
    expect(needsImageEnrichment(withImage(''))).toBe(true)
    expect(needsImageEnrichment(withImage('   '))).toBe(true)
  })

  it('accepts an existing image URL', () => {
    expect(needsImageEnrichment(withImage('https://image.tmdb.org/t/p/w500/example.jpg'))).toBe(
      false,
    )
  })
})

describe('isSupabaseConfigured', () => {
  it('is false when Supabase credentials are absent', () => {
    expect(isSupabaseConfigured).toBe(false)
  })
})

// Three mock heroes share the alias "Spider-Man" (Peter Parker MCU, Miles
// Morales, Peter B. Parker), so the slug "spider-man" is ambiguous in demo
// mode. Resolution must be deterministic and documented, not an arbitrary
// first-match. Tie-break rule: first hero in mock array order wins.
describe('duplicate-alias slug resolution', () => {
  it('always resolves the same hero for a duplicated slug', async () => {
    const first = await getHeroBySlug('spider-man')
    expect(first).not.toBeNull()
    for (let i = 0; i < 5; i++) {
      const again = await getHeroBySlug('spider-man')
      expect(again?.id).toBe(first?.id)
    }
  })

  it('resolves the duplicated slug to the first hero in mock array order', async () => {
    // Peter Parker (id '7', MCU) is the first "Spider-Man" in mockHeroes.
    const hero = await getHeroBySlug('spider-man')
    expect(hero?.id).toBe('7')
    expect(hero?.name).toBe('Peter Parker')
    expect(hero?.franchise).toBe('MCU')
  })

  it('warns when a slug matches more than one mock hero', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await getHeroBySlug('spider-man')
    expect(warnSpy).toHaveBeenCalled()
    expect(warnSpy.mock.calls[0]?.[0]).toMatch(/matched \d+ mock heroes/)
    warnSpy.mockRestore()
  })

  it('does not warn when a slug matches exactly one hero', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await getHeroBySlug('iron-man')
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('returns null for an unknown slug without warning', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const hero = await getHeroBySlug('nobody-herald')
    expect(hero).toBeNull()
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('uses the same tie-break rule for visibility lookups', async () => {
    const visibility = await getHeroVisibility('spider-man')
    expect(visibility).not.toBeNull()
    expect(visibility?.alias).toBe('Spider-Man')
  })
})
