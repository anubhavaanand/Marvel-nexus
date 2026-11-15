import { describe, expect, it } from 'vitest'
import type { Hero } from './supabase'
import {
  escapeLikePattern,
  getAllHeroes,
  getHeroBySlug,
  needsImageEnrichment,
  searchHeroes,
} from './supabase'

describe('mock data fallback', () => {
  it('returns every mock hero when Supabase is not configured', async () => {
    const heroes = await getAllHeroes()
    expect(heroes.length).toBeGreaterThan(0)
    expect(heroes.every((hero) => hero.alias.length > 0)).toBe(true)
  })

  it('filters mock heroes by alias', async () => {
    const results = await searchHeroes('Hulk')
    expect(results.some((hero) => hero.alias === 'Hulk')).toBe(true)
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

describe('escapeLikePattern', () => {
  it('escapes LIKE metacharacters so they are matched literally', () => {
    expect(escapeLikePattern('100%')).toBe('100\\%')
    expect(escapeLikePattern('a_b')).toBe('a\\_b')
    expect(escapeLikePattern('a\\b')).toBe('a\\\\b')
  })

  it('leaves ordinary text unchanged', () => {
    expect(escapeLikePattern('Hulk')).toBe('Hulk')
  })
})
