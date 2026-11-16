import type { Hero } from '@/lib/supabase'
import { FRANCHISE_VALUES } from './hero-update'

export interface HeroBuckets {
  mcu: Hero[]
  xmen: Hero[]
  spider: Hero[]
  dc: Hero[]
  anime: Hero[]
  theBoys: Hero[]
  peacemaker: Hero[]
  defenders: Hero[]
  invincible: Hero[]
  gaming: Hero[]
  other: Hero[]
}

export const EMPTY_HERO_BUCKETS: HeroBuckets = {
  mcu: [],
  xmen: [],
  spider: [],
  dc: [],
  anime: [],
  theBoys: [],
  peacemaker: [],
  defenders: [],
  invincible: [],
  gaming: [],
  other: [],
}

// Every schema-allowed franchise value must have a home bucket. Failing fast
// here keeps the bucket list and FRANCHISE_VALUES in sync instead of relying on
// tests alone.
const FRANCHISE_BUCKET: Record<string, keyof HeroBuckets> = {
  MCU: 'mcu',
  'X-Men': 'xmen',
  'Spider-Verse': 'spider',
  DC: 'dc',
  Anime: 'anime',
  'The Boys': 'theBoys',
  Peacemaker: 'peacemaker',
  Defenders: 'defenders',
  Invincible: 'invincible',
  Gaming: 'gaming',
  Other: 'other',
}

for (const franchise of FRANCHISE_VALUES) {
  if (!(franchise in FRANCHISE_BUCKET)) {
    throw new Error(`No bucket defined for franchise value: ${franchise}`)
  }
}

const PEACEMAKER_ALIASES = ['Peacemaker', 'Vigilante', 'Judomaster', 'Eagly']

/**
 * Franchise-first check: a hero with franchise 'Peacemaker' always goes to
 * the Peacemaker bucket regardless of alias. Alias-based matching is only
 * a fallback for heroes whose franchise field differs (e.g., legacy DC entries).
 */
function isPeacemaker(hero: Hero): boolean {
  return hero.franchise === 'Peacemaker' || PEACEMAKER_ALIASES.includes(hero.alias)
}

function isSpider(hero: Hero): boolean {
  return hero.franchise === 'Spider-Verse' || hero.alias === 'Spider-Man'
}

/**
 * Assign every hero to exactly one bucket so displayed counts never overlap.
 * Precedence: Peacemaker, then Spider-Verse/Spider-Man, then franchise.
 * De-duplicates by hero ID to guarantee a hero lands in exactly one bucket.
 *
 * Every value allowed by the schema CHECK / FRANCHISE_VALUES maps to a bucket,
 * so no stored hero is dropped from the browse-by-universe UI.
 */
export function bucketHeroes(allHeroes: Hero[]): HeroBuckets {
  const buckets: HeroBuckets = {
    mcu: [],
    xmen: [],
    spider: [],
    dc: [],
    anime: [],
    theBoys: [],
    peacemaker: [],
    defenders: [],
    invincible: [],
    gaming: [],
    other: [],
  }

  const seenIds = new Set<string>()

  for (const hero of allHeroes) {
    if (seenIds.has(hero.id)) continue
    seenIds.add(hero.id)

    if (isPeacemaker(hero)) buckets.peacemaker.push(hero)
    else if (isSpider(hero)) buckets.spider.push(hero)
    else if (hero.franchise === 'MCU') buckets.mcu.push(hero)
    else if (hero.franchise === 'X-Men') buckets.xmen.push(hero)
    else if (hero.franchise === 'DC') buckets.dc.push(hero)
    else if (hero.franchise === 'Anime') buckets.anime.push(hero)
    else if (hero.franchise === 'The Boys') buckets.theBoys.push(hero)
    else if (hero.franchise === 'Defenders') buckets.defenders.push(hero)
    else if (hero.franchise === 'Invincible') buckets.invincible.push(hero)
    else if (hero.franchise === 'Gaming') buckets.gaming.push(hero)
    else if (hero.franchise === 'Other') buckets.other.push(hero)
  }

  return buckets
}

/**
 * Derives the total hero count from bucket sums, ensuring it matches the
 * de-duplicated unique hero count used for display.
 */
export function totalHeroes(buckets: HeroBuckets): number {
  return Object.values(buckets).reduce((sum, bucket) => sum + bucket.length, 0)
}
