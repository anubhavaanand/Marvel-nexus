import { describe, expect, it } from 'vitest'
import { getAllHeroes, getHeroBySlug, searchHeroes } from './supabase'

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
})
