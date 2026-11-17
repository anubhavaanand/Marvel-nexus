import { beforeEach, describe, expect, it, vi } from 'vitest'

// #411: creating a hero whose alias slug is already taken must append a unique
// suffix rather than letting the DB unique constraint surface as a 500.

let insertedPayload: Record<string, unknown> | null = null
let slugOwnerExists = false

const chain: Record<string, unknown> = {
  from: (table: string) => {
    if (table !== 'heroes') throw new Error(`unexpected table ${table}`)
    return chain
  },
  select: () => chain,
  eq: () => chain,
  neq: () => chain,
  maybeSingle: () => {
    // The only maybeSingle() before an insert is the collision probe.
    if (insertedPayload === null && !inProbe) {
      inProbe = true
      return Promise.resolve({
        data: slugOwnerExists ? { id: 'existing-id' } : null,
        error: null,
      })
    }
    return Promise.resolve({
      data: {
        id: 'new-id',
        name: 'Tony Stark',
        alias: 'Iron Man',
        franchise: 'MCU',
        ...(insertedPayload ?? {}),
      },
      error: null,
    })
  },
  insert: (payload: Record<string, unknown>) => {
    insertedPayload = payload
    return chain
  },
}
let inProbe = false

const mockCookieStore = { get: vi.fn(), set: vi.fn(), delete: vi.fn() }

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => mockCookieStore),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/rate-limit', () => ({ isRateLimited: vi.fn(() => false) }))
vi.mock('@/lib/action-rate-limit', () => ({
  checkActionRateLimit: vi.fn(async () => ({ ok: true })),
}))
vi.mock('@/lib/service-supabase', () => ({
  getServiceSupabase: () => chain,
  getAdminSupabase: () => chain,
}))
vi.mock('@/lib/admin-sessions', () => ({
  validateSessionToken: vi.fn(async () => true),
}))

describe('createHeroAction slug collisions (#411)', () => {
  beforeEach(() => {
    vi.resetModules()
    insertedPayload = null
    slugOwnerExists = false
    inProbe = false
    process.env.ADMIN_PASSWORD = 'secret'
    mockCookieStore.get.mockReset()
    mockCookieStore.get.mockReturnValue({ value: 'valid-token' })
  })

  it('inserts the plain slug when no other hero owns it', async () => {
    const { createHeroAction } = await import('@/app/actions/admin')
    const result = await createHeroAction({
      name: 'Tony Stark',
      alias: 'Iron Man',
      franchise: 'MCU',
    })
    expect(result.ok).toBe(true)
    expect(insertedPayload?.slug).toBe('iron-man')
  })

  it('appends a suffix when another hero already owns the base slug', async () => {
    slugOwnerExists = true
    const { createHeroAction } = await import('@/app/actions/admin')
    const result = await createHeroAction({
      name: 'Tony Stark II',
      alias: 'Iron Man',
      franchise: 'MCU',
    })
    expect(result.ok).toBe(true)
    const slug = String(insertedPayload?.slug)
    expect(slug).toMatch(/^iron-man-[0-9a-f]{4}$/)
  })
})
