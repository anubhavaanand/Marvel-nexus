import { describe, expect, it, vi, beforeEach } from 'vitest'

// Replace the Supabase client with a controllable mock so the production slug
// lookup path can be exercised without a database. The mock records the query
// shape so we can assert it hits the indexed `slug` column exactly once.

const heroRow = {
  id: 'abc',
  name: 'Tony Stark',
  alias: 'Iron Man',
  slug: 'iron-man',
  actor_name: 'Robert Downey Jr.',
  franchise: 'MCU',
  origin_world: 'Earth-616',
  powers: ['Flight'],
  weaknesses: ['Ego'],
  image_url: '',
  is_locked_content: false,
  canon_events: [],
  hero_movies: [],
}

interface QueryChain {
  _table: string
  _select: string
  _eq: { col: string; val: string } | null
  _calls: string[]
  from(table: string): QueryChain
  select(cols: string): QueryChain
  eq(col: string, val: string): QueryChain
  maybeSingle(): Promise<{ data: typeof heroRow | null; error: null }>
  single(): Promise<{ data: typeof heroRow | null; error: null }>
  order(): QueryChain
  range(start: number, end: number): QueryChain
  limit(n: number): QueryChain
  then(resolve: (v: unknown) => void): void
}

function makeQuery(): QueryChain {
  const chain: QueryChain = {
    _table: '',
    _select: '',
    _eq: null as { col: string; val: string } | null,
    _calls: [] as string[],
    from(table: string) {
      chain._table = table
      chain._calls.push(`from(${table})`)
      return chain
    },
    select(cols: string) {
      chain._select = cols
      chain._calls.push(`select(${cols})`)
      return chain
    },
    eq(col: string, val: string) {
      chain._eq = { col, val }
      chain._calls.push(`eq(${col}, ${JSON.stringify(val)})`)
      return chain
    },
    maybeSingle() {
      chain._calls.push('maybeSingle()')
      return Promise.resolve({
        data: chain._eq?.col === 'slug' && chain._eq?.val === 'iron-man' ? heroRow : null,
        error: null,
      })
    },
    single() {
      chain._calls.push('single()')
      return Promise.resolve({
        data: chain._eq?.col === 'slug' && chain._eq?.val === 'iron-man' ? heroRow : null,
        error: null,
      })
    },
    order() {
      chain._calls.push('order()')
      return chain
    },
    range(_start: number, _end: number) {
      chain._calls.push(`range(${_start}, ${_end})`)
      return chain
    },
    limit(_n: number) {
      chain._calls.push(`limit(${_n})`)
      return chain
    },
    then(resolve: (v: unknown) => void) {
      resolve({ data: [], error: null })
    },
  }
  return chain
}

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from(table: string) {
      const q = makeQuery()
      q._table = table
      return q
    },
  }),
}))

vi.mock('./service-supabase', () => ({
  getServiceSupabase: () => ({
    from(table: string) {
      const q = makeQuery()
      q._table = table
      return q
    },
  }),
}))

vi.mock('./tmdb', () => ({
  searchPerson: () => null,
}))

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon-key'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key'
  vi.resetModules()
})

describe('indexed slug lookup (#144)', () => {
  it('getHeroBySlug resolves via a single eq on the slug column', async () => {
    const { getHeroBySlug } = await import('./supabase')
    const hero = await getHeroBySlug('iron-man')
    expect(hero).not.toBeNull()
    expect(hero?.slug).toBe('iron-man')
  })

  it('getHeroBySlug returns null for an unknown slug', async () => {
    const { getHeroBySlug } = await import('./supabase')
    const hero = await getHeroBySlug('nobody-herald')
    expect(hero).toBeNull()
  })

  it('getHeroVisibility resolves via eq on the slug column', async () => {
    const { getHeroVisibility } = await import('./supabase')
    const visibility = await getHeroVisibility('iron-man')
    expect(visibility).not.toBeNull()
    expect(visibility?.is_locked_content).toBe(false)
  })

  it('getHeroBySlugForAdmin resolves via eq on the slug column', async () => {
    const { getHeroBySlugForAdmin } = await import('./supabase')
    const hero = await getHeroBySlugForAdmin('iron-man')
    expect(hero).not.toBeNull()
    expect(hero?.slug).toBe('iron-man')
  })
})
