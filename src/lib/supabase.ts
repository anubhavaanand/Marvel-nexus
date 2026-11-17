import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { searchPerson } from './tmdb'
import { compareSlug, slugifyAlias } from './slugs'
import { SEED_MOVIES } from './seed-data'
import { mapWithConcurrency } from './concurrency'
import { getServiceSupabase } from './service-supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// TMDB image cache to avoid repeated lookups
const TMDB_IMAGE_CACHE_TTL_MS = 24 * 60 * 60 * 1000
const TMDB_IMAGE_CACHE_MAX_ENTRIES = 500
interface TmdbImageCacheEntry {
  value: string | null
  expiresAt: number
}
const tmdbImageCache = new Map<string, TmdbImageCacheEntry>()

function getTmdbImageCache(key: string): string | null | undefined {
  const entry = tmdbImageCache.get(key)
  if (!entry) return undefined
  if (Date.now() >= entry.expiresAt) {
    tmdbImageCache.delete(key)
    return undefined
  }
  // LRU: move to end
  tmdbImageCache.delete(key)
  tmdbImageCache.set(key, entry)
  return entry.value
}

function setTmdbImageCache(key: string, value: string | null): void {
  if (tmdbImageCache.size >= TMDB_IMAGE_CACHE_MAX_ENTRIES) {
    const first = tmdbImageCache.keys().next().value
    if (first !== undefined) tmdbImageCache.delete(first)
  }
  tmdbImageCache.set(key, { value, expiresAt: Date.now() + TMDB_IMAGE_CACHE_TTL_MS })
}

export function needsImageEnrichment(hero: { image_url?: string | null }): boolean {
  return !hero.image_url || hero.image_url.trim() === ''
}

interface EnrichableHero {
  id: string
  image_url: string | null
  actor_name?: string
  alias?: string
  name?: string
}

async function enrichHeroesWithTmdb<T extends EnrichableHero>(heroes: T[]): Promise<T[]> {
  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) return heroes

  // Only look up heroes that are actually missing an image.
  const needsEnrichment = heroes.filter((h) => needsImageEnrichment(h))
  if (needsEnrichment.length === 0) return heroes

  // Dedupe in-flight lookups within a single request so heroes sharing an
  // actor name (or fallback search term) trigger only one TMDB call. The
  // bounded LRU/TTL cache above (from #230) is reused for cross-request
  // caching; no second unbounded cache is introduced.
  const inflight = new Map<string, Promise<string | null>>()

  const lookup = (cacheKey: string, hero: EnrichableHero): Promise<string | null> => {
    const cached = getTmdbImageCache(cacheKey)
    if (cached !== undefined) {
      return Promise.resolve(cached)
    }
    const existing = inflight.get(cacheKey)
    if (existing) return existing

    const promise = (async () => {
      // Try actor name first (skip empty), then alias, then character name.
      const actorName = hero.actor_name?.trim()
      const alias = hero.alias?.trim()
      const name = hero.name?.trim()
      const person =
        (actorName ? await searchPerson(actorName) : null) ||
        (alias ? await searchPerson(alias) : null) ||
        (name ? await searchPerson(name) : null)
      const url = person?.profile_path
        ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
        : null
      setTmdbImageCache(cacheKey, url)
      return url
    })()
    inflight.set(cacheKey, promise)
    return promise
  }

  // Limit concurrent TMDB requests to avoid rate limiting and socket exhaustion.
  const results = await mapWithConcurrency(needsEnrichment, 5, async (hero) => {
    // Skip empty actor/search names; key the cache by the actor name (falling
    // back to alias then name) so repeated lookups reuse the cached result.
    const cacheKey = hero.actor_name?.trim() || hero.alias?.trim() || hero.name?.trim()
    if (!cacheKey) return null

    const url = await lookup(cacheKey, hero)
    return url ? { id: hero.id, url } : null
  })

  const imageMap = new Map<string, string>()
  for (const result of results) {
    if (result) imageMap.set(result.id, result.url)
  }

  if (imageMap.size === 0) return heroes
  return heroes.map((h) => ({
    ...h,
    image_url: imageMap.get(h.id) || h.image_url,
  }))
}

// Only create client if credentials are available
let supabase: SupabaseClient | null = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Check if Supabase is configured
export const isSupabaseConfigured = !!supabase

// Types
export interface Movie {
  id: string
  tmdb_id: number
  title: string
  release_date: string
  phase: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4' | 'Phase 5' | 'Phase 6' | null
  poster_url: string
  tmdb_rating: number | null
}

export interface Hero {
  id: string
  name: string
  alias: string
  slug: string
  actor_name?: string
  franchise: 'MCU' | 'X-Men' | 'Spider-Verse' | 'Defenders' | 'DC' | 'Anime' | string
  origin_world: string | null
  powers: string[] | null
  weaknesses: string[] | null
  image_url: string | null
  is_locked_content: boolean | null
  first_appearance_movie_id?: string
}

export interface CanonEvent {
  id: string
  hero_id: string
  movie_id?: string
  description: string
  is_fixed_point: boolean
  glitch_level: number
  movies?: Movie
}

export interface HeroWithRelations extends Hero {
  canon_events?: CanonEvent[]
  hero_movies?: { movies: Movie }[]
}

// Mock data fallback when Supabase is not configured
// image_url is intentionally empty — HeroImage proactively looks up TMDB on the client
const mockHeroes: Hero[] = [
  // MCU Heroes
  {
    id: '1',
    name: 'Tony Stark',
    actor_name: 'Robert Downey Jr.',
    alias: 'Iron Man',
    slug: slugifyAlias('Iron Man'),
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: ['Genius-level intellect', 'Powered armor suit', 'Flight', 'Energy repulsors'],
    weaknesses: ['Arc reactor dependency', 'Alcoholism'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '2',
    name: 'Steve Rogers',
    actor_name: 'Chris Evans',
    alias: 'Captain America',
    slug: slugifyAlias('Captain America'),
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: ['Super soldier serum', 'Vibranium shield', 'Enhanced strength', 'Enhanced agility'],
    weaknesses: ['Man out of time', 'Honor bound'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '3',
    name: 'Thor Odinson',
    actor_name: 'Chris Hemsworth',
    alias: 'Thor',
    slug: slugifyAlias('Thor'),
    franchise: 'MCU',
    origin_world: 'Asgard',
    powers: ['God of Thunder', 'Mjolnir/Stormbreaker', 'Super strength', 'Flight'],
    weaknesses: ['Arrogance', 'Love for Jane Foster'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '4',
    name: 'Bruce Banner',
    actor_name: 'Mark Ruffalo',
    alias: 'Hulk',
    slug: slugifyAlias('Hulk'),
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: ['Super strength', 'Regeneration', 'Gamma radiation', 'Near-invulnerability'],
    weaknesses: ['Anger management', 'Transforms under stress'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '5',
    name: 'Natasha Romanoff',
    actor_name: 'Scarlett Johansson',
    alias: 'Black Widow',
    slug: slugifyAlias('Black Widow'),
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: ['Expert martial artist', 'Spy tactics', 'Widow bites', 'Enhanced reflexes'],
    weaknesses: ['No superpowers', 'Red ledger'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '6',
    name: 'Clint Barton',
    actor_name: 'Jeremy Renner',
    alias: 'Hawkeye',
    slug: slugifyAlias('Hawkeye'),
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: ['Master archer', 'Expert marksman', 'Tactical genius', 'Enhanced aim'],
    weaknesses: ['Family vulnerable', 'No superpowers'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '7',
    name: 'Peter Parker',
    actor_name: 'Tom Holland',
    alias: 'Spider-Man',
    slug: slugifyAlias('Spider-Man'),
    franchise: 'MCU',
    origin_world: 'Earth-199999',
    powers: ['Spider-sense', 'Wall-crawling', 'Super strength', 'Web shooters'],
    weaknesses: ['Guilt over Uncle Ben', 'Identity protection'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '8',
    name: "T'Challa",
    actor_name: 'Chadwick Boseman',
    alias: 'Black Panther',
    slug: slugifyAlias('Black Panther'),
    franchise: 'MCU',
    origin_world: 'Wakanda',
    powers: ['Heart-shaped herb', 'Vibranium suit', 'Enhanced strength', 'Enhanced agility'],
    weaknesses: ["King's responsibility", 'Killmonger challenge'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '9',
    name: 'Stephen Strange',
    actor_name: 'Benedict Cumberbatch',
    alias: 'Doctor Strange',
    slug: slugifyAlias('Doctor Strange'),
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: ['Sorcery', 'Time Stone', 'Astral projection', 'Dimensional travel'],
    weaknesses: ['Arrogance', 'Ego'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '10',
    name: 'Carol Danvers',
    actor_name: 'Brie Larson',
    alias: 'Captain Marvel',
    slug: slugifyAlias('Captain Marvel'),
    franchise: 'MCU',
    origin_world: 'Earth-616',
    powers: ['Photon blasts', 'Flight', 'Super strength', 'Energy absorption'],
    weaknesses: ['Memory loss', 'Kree heritage'],
    image_url: '',
    is_locked_content: false,
  },

  // X-Men Heroes
  {
    id: '11',
    name: 'Logan',
    actor_name: 'Hugh Jackman',
    alias: 'Wolverine',
    slug: slugifyAlias('Wolverine'),
    franchise: 'X-Men',
    origin_world: 'Earth-616',
    powers: ['Adamantium skeleton', 'Healing factor', 'Enhanced senses', 'Retractable claws'],
    weaknesses: ['Adamantium poisoning', 'Memory loss'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '12',
    name: 'Charles Xavier',
    actor_name: 'Patrick Stewart',
    alias: 'Professor X',
    slug: slugifyAlias('Professor X'),
    franchise: 'X-Men',
    origin_world: 'Earth-616',
    powers: ['Telepathy', 'Mind control', 'Psionic shields', 'Genius intellect'],
    weaknesses: ['Paraplegic', 'Magneto rivalry'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '13',
    name: 'Erik Lehnsherr',
    actor_name: 'Michael Fassbender',
    alias: 'Magneto',
    slug: slugifyAlias('Magneto'),
    franchise: 'X-Men',
    origin_world: 'Earth-616',
    powers: ['Magnetism manipulation', 'Metal control', 'Flight', 'Force fields'],
    weaknesses: ['Holocaust trauma', 'Xavier friendship'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '14',
    name: 'Jean Grey',
    actor_name: 'Famke Janssen',
    alias: 'Phoenix',
    slug: slugifyAlias('Phoenix'),
    franchise: 'X-Men',
    origin_world: 'Earth-616',
    powers: ['Telepathy', 'Telekinesis', 'Phoenix Force', 'Cosmic power'],
    weaknesses: ['Phoenix corruption', 'Emotional instability'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '15',
    name: 'Scott Summers',
    actor_name: 'James Marsden',
    alias: 'Cyclops',
    slug: slugifyAlias('Cyclops'),
    franchise: 'X-Men',
    origin_world: 'Earth-616',
    powers: ['Optic blasts', 'Tactical genius', 'Leadership', 'Visor control'],
    weaknesses: ['No eye control', 'Jean Grey relationship'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '16',
    name: 'Ororo Munroe',
    actor_name: 'Halle Berry',
    alias: 'Storm',
    slug: slugifyAlias('Storm'),
    franchise: 'X-Men',
    origin_world: 'Earth-616',
    powers: ['Weather manipulation', 'Flight', 'Elemental control', 'Goddess worship'],
    weaknesses: ['Claustrophobia', 'African heritage'],
    image_url: '',
    is_locked_content: false,
  },

  // Spider-Verse Heroes
  {
    id: '17',
    name: 'Miles Morales',
    actor_name: 'Shameik Moore',
    alias: 'Spider-Man',
    slug: slugifyAlias('Spider-Man'),
    franchise: 'Spider-Verse',
    origin_world: 'Earth-1610',
    powers: ['Venom strike', 'Camouflage', 'Spider-sense', 'Web wings'],
    weaknesses: ['Guilt over Uncle Aaron', 'Multiverse responsibility'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '18',
    name: 'Gwen Stacy',
    actor_name: 'Hailee Steinfeld',
    alias: 'Spider-Gwen',
    slug: slugifyAlias('Spider-Gwen'),
    franchise: 'Spider-Verse',
    origin_world: 'Earth-65',
    powers: ['Spider-sense', 'Wall-crawling', 'Acrobatics', 'Web shooters'],
    weaknesses: ['Peter Parker death guilt', 'Multiverse travel'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '19',
    name: 'Peter B. Parker',
    actor_name: 'Jake Johnson',
    alias: 'Spider-Man',
    slug: slugifyAlias('Spider-Man'),
    franchise: 'Spider-Verse',
    origin_world: 'Earth-616B',
    powers: ['Spider-sense', 'Wall-crawling', 'Experience', 'Wisdom'],
    weaknesses: ['Midlife crisis', 'Divorce'],
    image_url: '',
    is_locked_content: false,
  },

  // DC Heroes
  {
    id: '20',
    name: 'Clark Kent',
    actor_name: 'Henry Cavill',
    alias: 'Superman',
    slug: slugifyAlias('Superman'),
    franchise: 'DC',
    origin_world: 'Krypton',
    powers: ['Super strength', 'Flight', 'Heat vision', 'Invulnerability'],
    weaknesses: ['Kryptonite', 'Magic', 'Lois Lane'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '21',
    name: 'Bruce Wayne',
    actor_name: 'Ben Affleck',
    alias: 'Batman',
    slug: slugifyAlias('Batman'),
    franchise: 'DC',
    origin_world: 'Earth-0',
    powers: ['Genius intellect', 'Martial arts', 'Bat-suit', 'Batmobile'],
    weaknesses: ['No superpowers', 'Parents death', 'Joker obsession'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '22',
    name: 'Diana Prince',
    actor_name: 'Gal Gadot',
    alias: 'Wonder Woman',
    slug: slugifyAlias('Wonder Woman'),
    franchise: 'DC',
    origin_world: 'Themyscira',
    powers: ['Super strength', 'Lasso of Truth', 'Bracelets of Victory', 'Flight'],
    weaknesses: ['Honesty bound', 'Ares connection'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '23',
    name: 'Barry Allen',
    actor_name: 'Ezra Miller',
    alias: 'The Flash',
    slug: slugifyAlias('The Flash'),
    franchise: 'DC',
    origin_world: 'Earth-0',
    powers: ['Super speed', 'Speed Force', 'Time travel', 'Phasing'],
    weaknesses: ['Mother murder', 'Speed Force dependency'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '24',
    name: 'Arthur Curry',
    actor_name: 'Jason Momoa',
    alias: 'Aquaman',
    slug: slugifyAlias('Aquaman'),
    franchise: 'DC',
    origin_world: 'Atlantis',
    powers: ['Super strength', 'Telepathy', 'Underwater breathing', 'Trident'],
    weaknesses: ['Surface world rejection', 'Atlantis politics'],
    image_url: '',
    is_locked_content: false,
  },

  // The Boys Heroes
  {
    id: '25',
    name: 'Billy Butcher',
    actor_name: 'Karl Urban',
    alias: 'Butcher',
    slug: slugifyAlias('Butcher'),
    franchise: 'The Boys',
    origin_world: 'Earth',
    powers: ['Tactical genius', 'V-24 powers', 'Super strength', 'Heat vision'],
    weaknesses: ['V-24 addiction', 'Revenge obsession'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '26',
    name: 'Homelander',
    actor_name: 'Antony Starr',
    alias: 'Homelander',
    slug: slugifyAlias('Homelander'),
    franchise: 'The Boys',
    origin_world: 'Earth',
    powers: ['Super strength', 'Flight', 'Heat vision', 'Invulnerability'],
    weaknesses: ['Narcissism', 'Mother issues', 'Compound V'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '27',
    name: 'Starlight',
    actor_name: 'Erin Moriarty',
    alias: 'Starlight',
    slug: slugifyAlias('Starlight'),
    franchise: 'The Boys',
    origin_world: 'Earth',
    powers: ['Light manipulation', 'Energy blasts', 'Flight', 'Super strength'],
    weaknesses: ['Homelander manipulation', 'Public image'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '28',
    name: 'Queen Maeve',
    actor_name: 'Dominique McElligott',
    alias: 'Queen Maeve',
    slug: slugifyAlias('Queen Maeve'),
    franchise: 'The Boys',
    origin_world: 'Earth',
    powers: ['Super strength', 'Flight', 'Invulnerability', 'Combat skills'],
    weaknesses: ['Alcoholism', 'Homelander fear'],
    image_url: '',
    is_locked_content: false,
  },

  // Anime Heroes
  {
    id: '29',
    name: 'Goku',
    actor_name: 'Masako Nozawa',
    alias: 'Goku',
    slug: slugifyAlias('Goku'),
    franchise: 'Anime',
    origin_world: 'Universe 7',
    powers: ['Super Saiyan', 'Kamehameha', 'Instant transmission', 'Ultra Instinct'],
    weaknesses: ['Naive', 'Food obsession', 'Saiyan pride'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '30',
    name: 'Naruto Uzumaki',
    actor_name: 'Junko Takeuchi',
    alias: 'Naruto',
    slug: slugifyAlias('Naruto'),
    franchise: 'Anime',
    origin_world: 'Shinobi World',
    powers: ['Rasengan', 'Shadow clones', 'Nine-tails chakra', 'Sage mode'],
    weaknesses: ['Childhood trauma', 'Village rejection'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '31',
    name: 'Monkey D. Luffy',
    actor_name: 'Mayumi Tanaka',
    alias: 'Luffy',
    slug: slugifyAlias('Luffy'),
    franchise: 'Anime',
    origin_world: 'Grand Line',
    powers: ['Rubber body', 'Gum-Gum attacks', 'Haki', 'Gear transformations'],
    weaknesses: ['Water weakness', 'Naive nature'],
    image_url: '',
    is_locked_content: false,
  },
  {
    id: '32',
    name: 'Saitama',
    actor_name: 'Makoto Furukawa',
    alias: 'One Punch Man',
    slug: slugifyAlias('One Punch Man'),
    franchise: 'Anime',
    origin_world: 'Earth',
    powers: ['Limitless strength', 'Speed', 'Invulnerability', 'Serious punch'],
    weaknesses: ['Boredom', 'No real challenge'],
    image_url: '',
    is_locked_content: false,
  },
]

// Helper Functions
/**
 * Resolves a slug against the mock hero list used when Supabase is unconfigured.
 *
 * Duplicate aliases are legal in the mock data: three distinct Spider-Men share
 * the alias "Spider-Man", so they all slugify to "spider-man". A plain
 * `Array.find` would silently return whichever hero happens to come first, so
 * this helper makes the choice explicit and stable:
 *
 *   1. No match -> null (the page 404s).
 *   2. One match -> that hero.
 *   3. Several   -> the first in mock array order, with a warning so the
 *                  ambiguity is visible in dev instead of being silently
 *                  resolved to an arbitrary pick.
 *
 * Mock array order is the definition of record here; it is fixed in source and
 * must not be reordered without updating this rule. The production path
 * (issue #144) resolves duplicates differently and is unaffected by this.
 */
function resolveMockHeroBySlug(slug: string): Hero | null {
  const matches = mockHeroes.filter((h) => compareSlug(h.alias, slug))
  if (matches.length === 0) return null
  if (matches.length === 1) return matches[0]
  console.warn(
    `getHeroBySlug: slug "${slug}" matched ${matches.length} mock heroes ` +
      `(${matches.map((h) => `${h.name} (${h.franchise})`).join(', ')}); ` +
      `returning the first in mock array order.`,
  )
  return matches[0]
}

export interface GetAllHeroesOptions {
  page?: number
  pageSize?: number
  cursor?: string
}

export async function getAllHeroes(options?: GetAllHeroesOptions): Promise<Hero[]> {
  const pageSize = Math.max(1, Math.min(options?.pageSize ?? 100, 1000))
  const page = Math.max(1, options?.page ?? 1)

  if (!supabase) {
    // #460: mirror the DB branch's keyset semantics on the mock array. Numeric
    // ids compare numerically (demo data), anything else compares as text so
    // UUID-shaped ids cannot silently turn into an empty page.
    if (options?.cursor) {
      const cursorId = Number(options.cursor)
      const numeric = !Number.isNaN(cursorId)
      const ordered = [...mockHeroes].sort((a, b) =>
        numeric ? Number(a.id) - Number(b.id) : String(a.id).localeCompare(String(b.id)),
      )
      const remaining = ordered
        .filter((h) => (numeric ? Number(h.id) > cursorId : String(h.id) > options!.cursor!))
        .slice(0, pageSize)
      return enrichHeroesWithTmdb([...remaining])
    }
    const start = (page - 1) * pageSize
    const slice = mockHeroes.slice(start, start + pageSize)
    return enrichHeroesWithTmdb([...slice])
  }

  if (options?.cursor) {
    const query = supabase
      .from('heroes')
      .select('*')
      .order('id')
      .gt('id', options.cursor)
      .limit(pageSize)
    const { data, error } = await query
    if (error) {
      console.error('Error fetching heroes:', error)
      throw new Error('Failed to load heroes')
    }
    return enrichHeroesWithTmdb(data || [])
  }

  const from = (page - 1) * pageSize
  const query = supabase
    .from('heroes')
    .select('*')
    .order('name')
    .range(from, from + pageSize - 1)
  const { data, error } = await query

  if (error) {
    console.error('Error fetching heroes:', error)
    throw new Error('Failed to load heroes')
  }
  return enrichHeroesWithTmdb(data || [])
}

export async function getHeroesCount(): Promise<number> {
  if (!supabase) return mockHeroes.length
  const { count, error } = await supabase
    .from('heroes')
    .select('id', { count: 'exact', head: true })
  if (error) {
    // #481: an empty database and a failed query must stay distinguishable;
    // returning 0 here made outages render as "0 Heroes".
    console.error('Error counting heroes:', error)
    throw new Error('Failed to count heroes')
  }
  return count ?? 0
}

export async function getHeroBySlug(slug: string): Promise<HeroWithRelations | null> {
  if (!supabase) {
    const hero = resolveMockHeroBySlug(slug)
    if (!hero) return null
    const enriched = await enrichHeroesWithTmdb([hero])
    if (!enriched[0]) return null
    return {
      ...enriched[0],
      canon_events: [],
      hero_movies: [],
    }
  }

  // Issue #144: resolve the slug against the indexed `slug` column in a single
  // query. The trigger keeps `slug` in sync with `alias`, so this is exact and
  // never needs the full-table id/alias scan + in-memory filter.
  const selectCols = `
      *,
      canon_events (
        *,
        movies (*)
      ),
      hero_movies (
        movies (*)
      )
    `

  const { data, error } = await supabase
    .from('heroes')
    .select(selectCols)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('Error fetching hero by slug:', error)
    throw new Error('Failed to load hero')
  }

  // Fallback (#343, #503): when the DB slug trigger is missing (fresh restore),
  // the `slug` column may be null/empty, so the indexed lookup misses even
  // though the alias still matches. Resolve it cheaply: identity columns only,
  // bounded by PostgREST's max-rows, then fetch the winner's full row by id.
  if (!data) {
    const { data: candidates, error: listError } = await supabase
      .from('heroes')
      .select('id, slug, alias')
      .limit(1000)
    if (listError) {
      console.error('Error fetching heroes for slug fallback:', listError)
      throw new Error('Failed to load hero')
    }
    const matches = (Array.isArray(candidates) ? candidates : []).filter((r) => {
      const row = r as Record<string, unknown>
      return (
        typeof row?.alias === 'string' &&
        (compareSlug(row.alias as string, slug) || row.slug === slug)
      )
    })
    if (matches.length > 1) {
      // Duplicate aliases exist on purpose (three Spider-Men); pick a stable
      // winner instead of an arbitrary array order, and say so (#503).
      matches.sort((a, b) => String(a.id).localeCompare(String(b.id)))
      console.warn(
        `slug fallback: ${matches.length} heroes match "${slug}"; using ${matches[0].id}`,
      )
    }
    const match = matches[0] as { id?: string } | undefined
    if (!match?.id) return null

    const { data: full, error: fullError } = await supabase
      .from('heroes')
      .select(selectCols)
      .eq('id', match.id)
      .maybeSingle()
    if (fullError) {
      console.error('Error fetching hero after slug fallback:', fullError)
      throw new Error('Failed to load hero')
    }
    if (!full) return null
    return buildHeroWithRelations(full)
  }

  return buildHeroWithRelations(data)
}

/** Runtime validation shared by both slug lookups (#503). */
function buildHeroWithRelations(resolved: unknown): HeroWithRelations {
  const row = resolved as Record<string, unknown>
  // Runtime validation: tolerate schema drift (missing relation arrays, null
  // fields) without crashing. Only the core hero identity fields are required.
  const canonEvents = Array.isArray(row.canon_events) ? (row.canon_events as unknown[]) : []
  const heroMovies = Array.isArray(row.hero_movies) ? (row.hero_movies as unknown[]) : []

  return {
    ...(row as unknown as Hero),
    canon_events: canonEvents as CanonEvent[],
    hero_movies: heroMovies as { movies: Movie }[],
  } as HeroWithRelations
}

/**
 * Resolves a slug to basic visibility fields using the service role, so locked
 * heroes can be distinguished from truly missing ones without exposing them.
 */
export async function getHeroVisibility(
  slug: string,
): Promise<{ is_locked_content: boolean } | null> {
  if (!supabase) {
    const hero = resolveMockHeroBySlug(slug)
    // INTENTIONAL FAIL-CLOSED BEHAVIOR (do not "fix" to oracle semantics):
    // In the mock branch we cannot distinguish a truly missing slug from a
    // locked one, so we report locked=true for BOTH. This masks missing-vs-
    // locked for anonymous callers, but that is deliberate: we never want to
    // leak slug existence or accidentally unlock content when the backing
    // store is unavailable. Do NOT assume oracle semantics here — treat any
    // `true` result as "not publicly visible", never as "confirmed locked".
    return { is_locked_content: hero ? (hero.is_locked_content ?? true) : true }
  }
  let client: SupabaseClient
  try {
    client = getServiceSupabase()
  } catch {
    // Service-role credentials are missing: fail closed. Treat the hero as
    // not visible so the page renders a 404 instead of a 500 or a wrongfully
    // unlocked hero. Never surface the env-var name.
    console.error('getHeroVisibility: Supabase service client is not configured')
    return { is_locked_content: true }
  }
  const { data, error } = await client
    .from('heroes')
    .select('id, alias, slug, is_locked_content')
    .eq('slug', slug)
    .maybeSingle()
  if (error) {
    console.error('Error resolving hero visibility:', error)
    throw new Error('Failed to resolve hero')
  }

  // #508: getHeroBySlug falls back to the normalized alias when `slug` is NULL,
  // so visibility must use the same resolution or a public hero renders as
  // Restricted Access. Lightweight identity-only scan, bounded by max-rows.
  let resolved = data
  if (!resolved) {
    const { data: candidates, error: listError } = await client
      .from('heroes')
      .select('id, slug, alias, is_locked_content')
      .limit(1000)
    if (listError) {
      console.error('Error resolving hero visibility fallback:', listError)
      throw new Error('Failed to resolve hero')
    }
    const matches = (Array.isArray(candidates) ? candidates : []).filter((r) => {
      const row = r as Record<string, unknown>
      return (
        typeof row?.alias === 'string' &&
        (compareSlug(row.alias as string, slug) || row.slug === slug)
      )
    })
    if (matches.length > 1) {
      matches.sort((a, b) => String(a.id).localeCompare(String(b.id)))
      console.warn(
        `visibility fallback: ${matches.length} heroes match "${slug}"; using ${matches[0].id}`,
      )
    }
    resolved = (matches[0] as typeof data) ?? null
  }

  return { is_locked_content: resolved ? Boolean(resolved.is_locked_content) : true }
}

/** Service-role lookup used by authenticated admins, including locked heroes. */
export async function getHeroBySlugForAdmin(slug: string): Promise<HeroWithRelations | null> {
  if (!supabase) return getHeroBySlug(slug)
  let client: SupabaseClient
  try {
    client = getServiceSupabase()
  } catch {
    // Service-role credentials are missing: cannot serve real admin data.
    // Fail closed so an admin never sees a 500 or partial locked content.
    console.error('getHeroBySlugForAdmin: Supabase service client is not configured')
    return null
  }
  const selectCols = `
      *,
      canon_events (
        *,
        movies (*)
      ),
      hero_movies (
        movies (*)
      )
    `

  const { data, error } = await client
    .from('heroes')
    .select(selectCols)
    .eq('slug', slug)
    .maybeSingle()

  if (error) {
    console.error('Error fetching admin hero by slug:', error)
    throw new Error('Failed to load hero')
  }

  // #509: mirror the anonymous alias fallback (#343/#503) so admins can open
  // (and repair slugs for) rows whose trigger did not populate `slug`.
  if (!data) {
    const { data: candidates, error: listError } = await client
      .from('heroes')
      .select('id, slug, alias')
      .limit(1000)
    if (listError) {
      console.error('Error fetching heroes for admin slug fallback:', listError)
      throw new Error('Failed to load hero')
    }
    const matches = (Array.isArray(candidates) ? candidates : []).filter((r) => {
      const row = r as Record<string, unknown>
      return (
        typeof row?.alias === 'string' &&
        (compareSlug(row.alias as string, slug) || row.slug === slug)
      )
    })
    if (matches.length > 1) {
      matches.sort((a, b) => String(a.id).localeCompare(String(b.id)))
      console.warn(
        `admin slug fallback: ${matches.length} heroes match "${slug}"; using ${matches[0].id}`,
      )
    }
    const match = matches[0] as { id?: string } | undefined
    if (!match?.id) return null

    const { data: full, error: fullError } = await client
      .from('heroes')
      .select(selectCols)
      .eq('id', match.id)
      .maybeSingle()
    if (fullError) {
      console.error('Error fetching admin hero after slug fallback:', fullError)
      throw new Error('Failed to load hero')
    }
    return full as HeroWithRelations | null
  }

  return data as HeroWithRelations | null
}

/** Fields the search UI actually renders (HeroCard + client-side filter). */
const SEARCH_HERO_FIELDS =
  'id,slug,name,alias,actor_name,franchise,origin_world,powers,weaknesses,image_url,is_locked_content' as const

/** Lightweight hero shape for search results — omits heavy/unused columns. */
export type SearchHero = Pick<
  Hero,
  | 'id'
  | 'slug'
  | 'name'
  | 'alias'
  | 'actor_name'
  | 'franchise'
  | 'origin_world'
  | 'powers'
  | 'weaknesses'
  | 'image_url'
  | 'is_locked_content'
>

/**
 * Fetches only the columns the search grid and client-side filter need.
 * Keeps the client payload ~60% smaller than select('*').
 */
export async function getSearchHeroes(): Promise<SearchHero[]> {
  if (!supabase) {
    const enriched = await enrichHeroesWithTmdb([...mockHeroes])
    return enriched.map(
      ({
        id,
        slug,
        name,
        alias,
        franchise,
        origin_world,
        powers,
        weaknesses,
        image_url,
        is_locked_content,
      }) => ({
        id,
        slug,
        name,
        alias,
        franchise,
        origin_world,
        powers,
        weaknesses,
        image_url,
        is_locked_content,
      }),
    )
  }

  const { data, error } = await supabase.from('heroes').select(SEARCH_HERO_FIELDS).order('name')

  if (error) {
    console.error('Error fetching search heroes:', error)
    throw new Error('Failed to load heroes')
  }
  // Apply bounded TMDB enrichment to Supabase heroes missing images,
  // reusing the same cache helper from #230/#249.
  return enrichHeroesWithTmdb((data || []) as SearchHero[])
}

/** Demo-mode hero list, used as the homepage fallback when Supabase is down (#482). */
export function getMockHeroes(): Hero[] {
  return [...mockHeroes]
}

/** Full hero list for the admin panel (includes locked content). */
export async function getAllHeroesForAdmin(): Promise<Hero[]> {
  if (!supabase) return [...mockHeroes]
  let client: SupabaseClient
  try {
    client = getServiceSupabase()
  } catch {
    // Service-role credentials are missing: fail so admins see an error
    // state instead of an apparently empty database.
    console.error('getAllHeroesForAdmin: Supabase service client is not configured')
    throw new Error('Database query failed')
  }
  const { data, error } = await client.from('heroes').select('*').order('name')
  if (error) {
    console.error('Error fetching heroes for admin:', error)
    throw new Error('Database query failed')
  }
  return data || []
}

const mockMovies: Movie[] = SEED_MOVIES.map((m): Movie => ({
  id: m.id,
  tmdb_id: 0,
  title: m.title,
  release_date: m.release_date ?? '',
  phase: m.phase as Movie['phase'],
  poster_url: m.poster_url,
  tmdb_rating: null,
}))

/** Release-date ordering shared by the mock branch and tests (#518). */
export function compareMoviesByReleaseDate(a: Movie, b: Movie): number {
  if (!a.release_date && !b.release_date) return 0
  if (!a.release_date) return 1
  if (!b.release_date) return -1
  return a.release_date.localeCompare(b.release_date)
}

export async function getAllMovies(options?: { allowEmpty?: boolean }): Promise<Movie[]> {
  if (!supabase) return [...mockMovies].sort(compareMoviesByReleaseDate)

  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('release_date', { ascending: true, nullsFirst: false })

    if (error) {
      // Do not silently serve empty data when the real database fails, unless
      // the caller explicitly opts in (build-time/static generation), where an
      // outage must not break the whole deployment.
      console.error('Error fetching movies:', error)
      if (options?.allowEmpty) return []
      throw new Error('Failed to load movies')
    }
    return data || []
  } catch (err) {
    console.error('Error fetching movies:', err)
    if (options?.allowEmpty) return []
    throw err instanceof Error ? err : new Error('Failed to load movies')
  }
}
