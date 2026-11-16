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
} = {}

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
      if (payload.slug) returnedSlug = payload.slug as string
      return chain
    },
    select: () => {
      // Keep update mode so the subsequent single() resolves as an update
      if (mode !== 'update') mode = 'select'
      return chain
    },
    eq: (_col: string, val: string) => {
      eqCol = _col
      return chain
    },
    neq: (_col: string, val: string) => {
      neqCol = _col
      return chain
    },
    maybeSingle: () => {
      if (mode === 'select' && eqCol === 'slug' && neqCol === 'id' && mockConfig.existingSlug) {
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
    mockConfig = { updateReturns: mockHeroRow }
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

  it('appends suffix on slug collision with another hero', async () => {
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
    expect(res!.slug).toMatch(/^captain-america-[a-f0-9]{4}$/)
  })
})
