import { describe, expect, it } from 'vitest'
import type { Hero } from '@/lib/supabase'
import { FRANCHISE_VALUES } from './hero-update'
import { EMPTY_HERO_BUCKETS, bucketHeroes, totalHeroes, type HeroBuckets } from './stats'

function makeHero(id: string, overrides: Partial<Hero> = {}): Hero {
  return {
    id,
    name: id,
    alias: id,
    slug: id,
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: [],
    weaknesses: [],
    image_url: '',
    is_locked_content: false,
    ...overrides,
  }
}

function allBucketedIds(buckets: HeroBuckets): string[] {
  return Object.values(buckets)
    .flat()
    .map((hero) => hero.id)
}

// Every schema-allowed franchise value must have exactly one home bucket,
// listed in the same order as FRANCHISE_VALUES so the two stay in sync.
const FRANCHISE_BUCKET: Record<string, keyof HeroBuckets> = {
  MCU: 'mcu',
  'X-Men': 'xmen',
  'Spider-Verse': 'spider',
  Defenders: 'defenders',
  DC: 'dc',
  Anime: 'anime',
  'The Boys': 'theBoys',
  Invincible: 'invincible',
  Peacemaker: 'peacemaker',
  Gaming: 'gaming',
  Other: 'other',
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
      makeHero('invincible', { alias: 'Invincible', franchise: 'Invincible' }),
    ])

    const ids = allBucketedIds(buckets)
    expect(new Set(ids).size).toBe(ids.length)
    // Every schema-allowed franchise has a tab, so all six are bucketed.
    expect(ids).toHaveLength(6)
    expect(buckets.invincible.map((h) => h.id)).toEqual(['invincible'])
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

  it('buckets Peacemaker-franchise heroes by franchise value too', () => {
    const buckets = bucketHeroes([
      makeHero('christopher', { alias: 'Christopher Smith', franchise: 'Peacemaker' }),
    ])

    expect(buckets.peacemaker.map((h) => h.id)).toEqual(['christopher'])
    expect(buckets.dc).toHaveLength(0)
  })

  it('franchise Peacemaker beats non-peacemaker alias (franchise-first)', () => {
    const buckets = bucketHeroes([
      makeHero('christopher', { alias: 'Christopher Smith', franchise: 'Peacemaker' }),
      makeHero('random-alias', { alias: 'Random Hero', franchise: 'Peacemaker' }),
    ])

    expect(buckets.peacemaker.map((h) => h.id)).toEqual(['christopher', 'random-alias'])
    expect(buckets.dc).toHaveLength(0)
  })
})

describe('bucketHeroes franchise coverage', () => {
  it('maps every schema-allowed franchise value to a real bucket', () => {
    const bucketKeys = new Set<string>(Object.keys(EMPTY_HERO_BUCKETS))

    expect(Object.keys(FRANCHISE_BUCKET)).toEqual([...FRANCHISE_VALUES])

    for (const franchise of FRANCHISE_VALUES) {
      const bucketKey = FRANCHISE_BUCKET[franchise]
      expect(bucketKey).toBeTruthy()
      expect(bucketKeys.has(bucketKey)).toBe(true)
    }
  })

  it('places every franchise value in its own bucket with no leftovers', () => {
    const heroes = FRANCHISE_VALUES.map((franchise, index) => makeHero(`h-${index}`, { franchise }))

    const buckets = bucketHeroes(heroes)
    const ids = allBucketedIds(buckets)

    expect(ids).toHaveLength(FRANCHISE_VALUES.length)
    expect(new Set(ids).size).toBe(FRANCHISE_VALUES.length)

    for (const franchise of FRANCHISE_VALUES) {
      expect(buckets[FRANCHISE_BUCKET[franchise]]).toHaveLength(1)
    }
  })

describe('no overlap between buckets', () => {
  it('has no overlap between franchise buckets and special buckets', () => {
    const buckets = bucketHeroes([
      makeHero('spidey', { alias: 'Spider-Man', franchise: 'MCU' }),
      makeHero('miles', { alias: 'Miles Morales', franchise: 'Spider-Verse' }),
      makeHero('peacemaker', { alias: 'Peacemaker', franchise: 'DC' }),
      makeHero('batman', { alias: 'Batman', franchise: 'DC' }),
    ])
    const special = new Set([...buckets.spider, ...buckets.peacemaker].map((h) => h.id))
    const franchise = new Set(
      [...buckets.mcu, ...buckets.xmen, ...buckets.dc, ...buckets.anime, ...buckets.theBoys, ...buckets.defenders, ...buckets.invincible, ...buckets.gaming, ...buckets.other].map((h) => h.id),
    )
    for (const id of special) expect(franchise.has(id)).toBe(false)
    expect(totalHeroes(buckets)).toBe(4)
  })
})

})