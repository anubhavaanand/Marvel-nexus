import { describe, expect, it } from 'vitest'
import { SEED_EVENTS, SEED_HEROES, SEED_MOVIES, heroId } from './seed-data'

describe('seed data', () => {
  it('assigns unique ids to every hero', () => {
    const ids = SEED_HEROES.map((hero) => hero.id)
    expect(new Set(ids).size).toBe(SEED_HEROES.length)
  })

  it('derives deterministic ids from name and alias', () => {
    expect(heroId('Tony Stark', 'Iron Man')).toBe(heroId('Tony Stark', 'Iron Man'))
    expect(heroId('Tony Stark', 'Iron Man')).not.toBe(heroId('Steve Rogers', 'Captain America'))
  })

  it('gives every hero a name, alias and non-empty powers', () => {
    for (const hero of SEED_HEROES) {
      expect(hero.name.trim().length).toBeGreaterThan(0)
      expect(hero.alias.trim().length).toBeGreaterThan(0)
      expect(hero.powers.length).toBeGreaterThan(0)
      expect(Array.isArray(hero.weaknesses)).toBe(true)
    }
  })

  it('only uses w500-sized TMDB images', () => {
    for (const hero of SEED_HEROES) {
      if (hero.image_url) expect(hero.image_url).toContain('/t/p/w500/')
    }
  })

  it('references existing heroes and movies in canon events', () => {
    const heroKeys = new Set(SEED_HEROES.map((hero) => `${hero.name}|${hero.alias}`))
    const movieTitles = new Set(SEED_MOVIES.map((movie) => movie.title))
    for (const event of SEED_EVENTS) {
      expect(heroKeys.has(`${event.heroName}|${event.heroAlias}`)).toBe(true)
      expect(movieTitles.has(event.movieTitle)).toBe(true)
    }
  })
})
