import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cookieStore = { get: vi.fn(), set: vi.fn(), delete: vi.fn() }
const headersList = { get: vi.fn() }

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
  headers: vi.fn(async () => headersList),
}))
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('@/lib/admin-sessions', () => ({
  createSessionToken: vi.fn(async () => {
    throw new Error('db down')
  }),
  ensurePasswordEpochFresh: vi.fn(async () => {}),
  revokeSessionToken: vi.fn(),
  validateSessionToken: vi.fn(),
}))
vi.mock('@/lib/service-supabase', () => ({ getServiceSupabase: () => ({ from: () => ({}) }) }))

import { resetRateLimiter } from '@/lib/rate-limit'

beforeEach(() => {
  cookieStore.get.mockReset()
  cookieStore.set.mockReset()
  cookieStore.delete.mockReset()
  headersList.get.mockReset()
  headersList.get.mockImplementation((name: string) => {
    if (name === 'x-forwarded-for') return '203.0.113.7'
    if (name === 'x-forwarded-proto') return 'https'
    return null
  })
  resetRateLimiter()
  process.env.ADMIN_PASSWORD = 'secret'
})

afterEach(() => {
  delete process.env.ADMIN_PASSWORD
})

describe('loginAdminAction session creation failure', () => {
  it('returns Login failed when createSessionToken throws', async () => {
    const { loginAdminAction } = await import('./admin')
    const res = await loginAdminAction('secret')
    expect(res).toEqual({ ok: false, error: 'Login failed' })
    expect(cookieStore.set).not.toHaveBeenCalled()
  })
})
