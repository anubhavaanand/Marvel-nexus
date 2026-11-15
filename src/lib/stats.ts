import type { Hero } from '@/lib/supabase'

export interface HeroBuckets {
  mcu: Hero[]
  xmen: Hero[]
  spider: Hero[]
  dc: Hero[]
  anime: Hero[]
  theBoys: Hero[]
  peacemaker: Hero[]
}

export const EMPTY_HERO_BUCKETS: HeroBuckets = {
  mcu: [],
  xmen: [],
  spider: [],
  dc: [],
  anime: [],
  theBoys: [],
  peacemaker: [],
}

const PEACEMAKER_ALIASES = ['Peacemaker', 'Vigilante', 'Judomaster', 'Eagly']

function isPeacemaker(hero: Hero): boolean {
  return PEACEMAKER_ALIASES.includes(hero.alias)
}

function isSpider(hero: Hero): boolean {
  return hero.franchise === 'Spider-Verse' || hero.alias === 'Spider-Man'
}

/**
 * Assign every hero to exactly one bucket so displayed counts never overlap.
 * Precedence: Peacemaker, then Spider-Verse/Spider-Man, then franchise.
 * Heroes from other franchises are not shown in a tab.
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
  }

  for (const hero of allHeroes) {
    if (isPeacemaker(hero)) buckets.peacemaker.push(hero)
    else if (isSpider(hero)) buckets.spider.push(hero)
    else if (hero.franchise === 'MCU') buckets.mcu.push(hero)
    else if (hero.franchise === 'X-Men') buckets.xmen.push(hero)
    else if (hero.franchise === 'DC') buckets.dc.push(hero)
    else if (hero.franchise === 'Anime') buckets.anime.push(hero)
    else if (hero.franchise === 'The Boys') buckets.theBoys.push(hero)
  }

  return buckets
}
