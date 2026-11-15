import { describe, expect, it } from 'vitest'
import type { Hero } from '@/lib/supabase'
import { bucketHeroes } from './stats'

function makeHero(id: string, overrides: Partial<Hero> = {}): Hero {
  return {
    id,
    name: id,
    alias: id,
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: [],
    weaknesses: [],
    image_url: '',
    is_locked_content: false,
    ...overrides,
  }
}

function allBucketedIds(buckets: ReturnType<typeof bucketHeroes>): string[] {
  return [
    ...buckets.mcu,
    ...buckets.xmen,
    ...buckets.spider,
    ...buckets.dc,
    ...buckets.anime,
    ...buckets.theBoys,
    ...buckets.peacemaker,
  ].map((hero) => hero.id)
}

describe('bucketHeroes', () => {
  it('does not double-count the MCU Spider-Man', () => {
    const buckets = bucketHeroes([
      makeHero('spidey', { alias: 'Spider-Man', franchise: 'MCU' }),
      makeHero('miles', { alias: 'Miles Morales', franchise: 'Spider-Verse' }),
    ])

    expect(buckets.spider.map((h) => h.id)).toEqual(['spidey', 'miles'])
    expect(buckets.mcu).toHaveLength(0)
  })

  it('assigns each hero to at most one bucket', () => {
    const buckets = bucketHeroes([
      makeHero('spidey', { alias: 'Spider-Man', franchise: 'MCU' }),
      makeHero('peacemaker', { alias: 'Peacemaker', franchise: 'DC' }),
      makeHero('batman', { alias: 'Batman', franchise: 'DC' }),
      makeHero('goku', { alias: 'Goku', franchise: 'Anime' }),
      makeHero('homelander', { alias: 'Homelander', franchise: 'The Boys' }),
      makeHero('other', { alias: 'Other Hero', franchise: 'Invincible' }),
    ])

    const ids = allBucketedIds(buckets)
    expect(new Set(ids).size).toBe(ids.length)
    // Invincible has no tab, so only five heroes are bucketed.
    expect(ids).toHaveLength(5)
  })

  it('keeps Peacemaker out of the DC bucket', () => {
    const buckets = bucketHeroes([
      makeHero('peacemaker', { alias: 'Peacemaker', franchise: 'DC' }),
      makeHero('vigilante', { alias: 'Vigilante', franchise: 'DC' }),
      makeHero('batman', { alias: 'Batman', franchise: 'DC' }),
    ])

    expect(buckets.peacemaker.map((h) => h.id)).toEqual(['peacemaker', 'vigilante'])
    expect(buckets.dc.map((h) => h.id)).toEqual(['batman'])
  })
})
