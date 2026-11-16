import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cookieStore = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

const headersList = {
  get: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
  headers: vi.fn(async () => headersList),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

// In-memory admin_sessions stand-in: sessions now require the DB for durable
// revocation (#223), so the login flow tests provide a minimal table mock.
vi.mock('@/lib/service-supabase', () => {
  const store = new Map<string, { token_hash: string; expires_at: string }>()
  return {
    getServiceSupabase: () => ({
      from: (table: string) => {
        if (table !== 'admin_sessions') throw new Error(`unexpected table ${table}`)
        let mode: 'select' | 'delete' = 'select'
        let filterHash: string | null = null
        let ltValue: string | null = null
        const chain: Record<string, unknown> = {
          select: () => {
            mode = 'select'
            return chain
          },
          insert: (row: { token_hash: string; expires_at: string }) => {
            store.set(row.token_hash, row)
            return Promise.resolve({ error: null })
          },
          delete: () => {
            mode = 'delete'
            return chain
          },
          eq: (_col: string, val: string) => {
            filterHash = val
            return chain
          },
          lt: (_col: string, val: string) => {
            ltValue = val
            return chain
          },
          limit: () => Promise.resolve({ error: null }),
          maybeSingle: () => {
            if (mode === 'delete') {
              if (filterHash) store.delete(filterHash)
              return Promise.resolve({ data: null, error: null })
            }
            const row = filterHash ? store.get(filterHash) : undefined
            return Promise.resolve({ data: row ?? null, error: null })
          },
          then: (resolve: (value: unknown) => void) => {
            if (mode === 'delete') {
              if (filterHash) store.delete(filterHash)
              else if (ltValue) {
                const cutoff = new Date(ltValue).getTime()
                for (const [key, value] of [...store]) {
                  if (new Date(value.expires_at).getTime() < cutoff) store.delete(key)
                }
              }
            }
            resolve({ data: null, error: null })
          },
        }
        return chain
      },
    }),
  }
})

import { resetRateLimiter } from '@/lib/rate-limit'

beforeEach(() => {
  cookieStore.get.mockReset()
  cookieStore.set.mockReset()
  cookieStore.delete.mockReset()
  headersList.get.mockReset()
  headersList.get.mockImplementation((name: string) => {
    if (name === 'x-forwarded-for') return '203.0.113.7'
    if (name === 'x-real-ip') return null
    if (name === 'x-forwarded-proto') return 'https'
    return null
  })
  resetRateLimiter()
  process.env.ADMIN_PASSWORD = 'secret'
})

afterEach(() => {
  delete process.env.ADMIN_PASSWORD
  vi.useRealTimers()
})

describe('loginAdminAction', () => {
  it('succeeds with correct password, sets cookie, validates session', async () => {
    const { loginAdminAction, checkAdminAuthAction, logoutAdminAction } = await import('./admin')
    const { validateSessionToken } = await import('@/lib/admin-sessions')

    const res = await loginAdminAction('secret')
    expect(res).toEqual({ ok: true })
    expect(cookieStore.set).toHaveBeenCalledWith(
      'admin_session',
      expect.any(String),
      expect.objectContaining({ httpOnly: true, secure: true }),
    )
    const token = cookieStore.set.mock.calls[0][1]
    await expect(validateSessionToken(token)).resolves.toBe(true)

    // checkAdminAuthAction reads cookie
    cookieStore.get.mockReturnValue({ value: token })
    await expect(checkAdminAuthAction()).resolves.toBe(true)

    // logout revokes
    cookieStore.get.mockReturnValue({ value: token })
    await logoutAdminAction()
    expect(cookieStore.delete).toHaveBeenCalledWith('admin_session')
    await expect(validateSessionToken(token)).resolves.toBe(false)
  })

  it('fails on wrong password without setting cookie', async () => {
    const { loginAdminAction } = await import('./admin')
    const res = await loginAdminAction('wrong')
    expect(res).toEqual({ ok: false, error: 'Login failed' })
    expect(cookieStore.set).not.toHaveBeenCalled()
  })

  it('fails when ADMIN_PASSWORD missing', async () => {
    delete process.env.ADMIN_PASSWORD
    const { loginAdminAction } = await import('./admin')
    const res = await loginAdminAction('secret')
    expect(res).toEqual({ ok: false, error: 'Login failed' })
    expect(cookieStore.set).not.toHaveBeenCalled()
  })

  it('rate limits after 5 attempts', async () => {
    const { loginAdminAction } = await import('./admin')
    for (let i = 0; i < 5; i++) {
      await loginAdminAction('wrong')
    }
    const res = await loginAdminAction('wrong')
    expect(res).toEqual({ ok: false, error: 'Too many attempts. Please try again later.' })
  })

  it('resets after window passes', async () => {
    vi.useFakeTimers()
    const { loginAdminAction } = await import('./admin')
    for (let i = 0; i < 5; i++) {
      await loginAdminAction('wrong')
    }
    vi.advanceTimersByTime(61_000)
    const res = await loginAdminAction('wrong')
    expect(res).toEqual({ ok: false, error: 'Login failed' })
  })
})