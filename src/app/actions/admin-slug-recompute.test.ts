import { beforeEach, describe, expect, it, vi } from 'vitest'

// Shared mock data
const mockHeroRow = {
  id: '1',
  name: 'Tony Stark',
  alias: 'Iron Man',
  slug: 'iron-man',
  actor_name: 'Robert Downey Jr.',
  franchise: 'MCU',
  origin_world: 'Earth-616',
  powers: ['Genius'],
  weaknesses: ['Ego'],
  image_url: '',
  is_locked_content: false,
}

// Configurable mock state
let mockConfig: {
  updateReturns?: typeof mockHeroRow
  existingSlug?: typeof mockHeroRow
  /** Slug the action actually tried to write (#527). */
  lastSentSlug?: string | null
} = {}

// Mirrors public.hero_slugify (supabase/migrations/005_hero_slug_index.sql):
// lowercase, non-alphanumerics collapsed to '-'.
function triggerSlugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Helper to create a fresh Supabase mock
const createSupabaseMock = () => {
  let mode: 'select' | 'update' = 'select'
  let eqCol: string | null = null
  let neqCol: string | null = null
  let returnedSlug: string | null = null

  const chain: Record<string, unknown> = {
    from: (table: string) => {
      if (table !== 'heroes') throw new Error(`unexpected table ${table}`)
      return chain
    },
    update: (payload: Record<string, unknown>) => {
      mode = 'update'
      mockConfig.lastSentSlug = typeof payload.slug === 'string' ? payload.slug : null
      // #527: emulate heroes_set_slug (BEFORE UPDATE OF alias), which recomputes
      // NEW.slug from the alias and discards whatever slug the app sent.
      if (typeof payload.alias === 'string') {
        returnedSlug = triggerSlugify(payload.alias)
      } else if (payload.slug) {
        returnedSlug = payload.slug as string
      }
      return chain
    },
    select: () => {
      // Keep update mode so the subsequent single() resolves as an update
      if (mode !== 'update') mode = 'select'
      return chain
    },
    eq: (_col: string) => {
      eqCol = _col
      return chain
    },
    neq: (_col: string) => {
      neqCol = _col
      return chain
    },
    maybeSingle: () => {
      // Update path: update().eq().select().maybeSingle() returns the updated row
      if (mode === 'update') {
        if (!mockConfig.updateReturns) return Promise.resolve({ data: null, error: null })
        return Promise.resolve({
          data: {
            ...mockConfig.updateReturns,
            slug: returnedSlug ?? mockConfig.updateReturns.slug,
          },
          error: null,
        })
      }
      // Collision check: select().eq('slug').neq('id').maybeSingle()
      if (eqCol === 'slug' && neqCol === 'id' && mockConfig.existingSlug) {
        return Promise.resolve({ data: mockConfig.existingSlug, error: null })
      }
      return Promise.resolve({ data: null, error: null })
    },
    single: () => {
      if (mode === 'update' && mockConfig.updateReturns) {
        return Promise.resolve({
          data: {
            ...mockConfig.updateReturns,
            slug: returnedSlug ?? mockConfig.updateReturns.slug,
          },
          error: null,
        })
      }
      return Promise.resolve({ data: mockHeroRow, error: null })
    },
  }
  return chain
}

// Mock cookie store - must be at top level for vi.mock hoisting
const mockCookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => mockCookieStore),
  headers: vi.fn(async () => ({ get: vi.fn() })),
}))

// Mock for rate limiting
vi.mock('@/lib/rate-limit', () => ({
  isRateLimited: vi.fn(() => false),
}))

vi.mock('@/lib/action-rate-limit', () => ({
  checkActionRateLimit: vi.fn(async () => ({ ok: true })),
}))

vi.mock('@/lib/service-supabase', () => ({
  getServiceSupabase: () => createSupabaseMock(),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// Mock admin sessions - must be hoisted
vi.mock('@/lib/admin-sessions', () => ({
  validateSessionToken: vi.fn(async () => true),
}))

describe('updateHeroAction slug recompute - alias changes', () => {
  beforeEach(() => {
    vi.resetModules()
    mockConfig = { updateReturns: mockHeroRow, lastSentSlug: null }
    process.env.ADMIN_PASSWORD = 'secret'

    // Reset cookie store mock
    mockCookieStore.get.mockReset()
    mockCookieStore.set.mockReset()
    mockCookieStore.delete.mockReset()

    // Set up valid admin session cookie
    mockCookieStore.get.mockReturnValue({ value: 'valid-token' })
  })

  it('recomputes slug when alias changes', async () => {
    const { updateHeroAction } = await import('./admin')
    const res = await updateHeroAction('1', { alias: 'Captain America' })
    expect(res).not.toBeNull()
    expect(res!.slug).toBe('captain-america')
  })

  it('keeps original slug when alias unchanged', async () => {
    const { updateHeroAction } = await import('./admin')
    const res = await updateHeroAction('1', { name: 'Anthony Stark' })
    expect(res).not.toBeNull()
    expect(res!.slug).toBe('iron-man')
  })

  it('detects that the slug trigger discards the collision suffix (#527)', async () => {
    vi.resetModules()
    mockConfig = {
      updateReturns: mockHeroRow,
      existingSlug: { ...mockHeroRow, id: '2', slug: 'captain-america' },
    }
    process.env.ADMIN_PASSWORD = 'secret'

    mockCookieStore.get.mockReturnValue({ value: 'valid-token' })

    const { updateHeroAction } = await import('./admin')
    const res = await updateHeroAction('1', { alias: 'Captain America' })
    expect(res).not.toBeNull()
    // The action computed a collision-safe suffix...
    expect(mockConfig.lastSentSlug).toMatch(/^captain-america-[a-f0-9]{4}$/)
    // ...but the database trigger overwrote it, so the stored slug duplicates
    // the other hero's. This documents the production behaviour #527 flagged.
    expect(res!.slug).toBe('captain-america')
  })
})
