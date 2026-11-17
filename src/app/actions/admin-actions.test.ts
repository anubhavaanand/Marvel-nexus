import { beforeEach, describe, expect, it, vi } from 'vitest'

// #528: focused coverage for the destructive/support admin actions that had no
// direct unit tests beyond login.

const cookieStore = {
  get: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

const validateSessionToken = vi.fn(async () => true)
const revokeSessionToken = vi.fn(async () => {})

vi.mock('@/lib/admin-sessions', () => ({
  validateSessionToken,
  revokeSessionToken,
}))

vi.mock('@/lib/action-rate-limit', () => ({
  checkActionRateLimit: vi.fn(async () => ({ ok: true })),
}))

// Minimal chain: from(table).select().eq().maybeSingle() and .rpc().
type DbMock = ReturnType<typeof makeDbMock>
let dbMock: DbMock

function makeDbMock(config: { rpcError?: Error | null; selectData?: unknown } = {}) {
  const state = { rpcCalls: 0 }
  const chain: Record<string, unknown> = { state }
  chain.from = () => chain
  chain.select = () => chain
  chain.eq = () => chain
  chain.neq = () => chain
  chain.maybeSingle = () => Promise.resolve({ data: config.selectData ?? null, error: null })
  chain.rpc = () => {
    state.rpcCalls += 1
    return Promise.resolve({ error: config.rpcError ?? null })
  }
  return chain
}

vi.mock('@/lib/service-supabase', () => ({
  getAdminSupabase: () => dbMock,
}))

describe('admin actions (#528)', () => {
  beforeEach(() => {
    vi.resetModules()
    cookieStore.get.mockReset()
    cookieStore.delete.mockReset()
    validateSessionToken.mockReset()
    validateSessionToken.mockResolvedValue(true)
    revokeSessionToken.mockReset()
    dbMock = makeDbMock()
    process.env.ADMIN_PASSWORD = 'secret'
  })

  it('logout revokes the session when a cookie exists', async () => {
    cookieStore.get.mockReturnValue({ value: 'token-1' })
    const { logoutAdminAction } = await import('./admin')
    await logoutAdminAction()
    expect(revokeSessionToken).toHaveBeenCalledWith('token-1')
    expect(cookieStore.delete).toHaveBeenCalledWith('admin_session')
  })

  it('logout deletes the cookie even without a session', async () => {
    cookieStore.get.mockReturnValue(undefined)
    const { logoutAdminAction } = await import('./admin')
    await logoutAdminAction()
    expect(revokeSessionToken).not.toHaveBeenCalled()
    expect(cookieStore.delete).toHaveBeenCalledWith('admin_session')
  })

  it('checkAdminAuthAction returns false when the cookie is missing', async () => {
    cookieStore.get.mockReturnValue(undefined)
    const { checkAdminAuthAction } = await import('./admin')
    await expect(checkAdminAuthAction()).resolves.toBe(false)
  })

  it('checkAdminAuthAction returns false for an invalid token', async () => {
    cookieStore.get.mockReturnValue({ value: 'expired' })
    validateSessionToken.mockResolvedValue(false)
    const { checkAdminAuthAction } = await import('./admin')
    await expect(checkAdminAuthAction()).resolves.toBe(false)
  })

  it('deleteHeroAction refuses an unauthenticated caller', async () => {
    cookieStore.get.mockReturnValue(undefined)
    validateSessionToken.mockResolvedValue(false)
    const { deleteHeroAction } = await import('./admin')
    await expect(deleteHeroAction('hero-1')).resolves.toBe(false)
    expect((dbMock.state as { rpcCalls: number }).rpcCalls).toBe(0)
  })

  it('deleteHeroAction surfaces a real RPC failure', async () => {
    cookieStore.get.mockReturnValue({ value: 'token-1' })
    dbMock = makeDbMock({ rpcError: new Error('permission denied') })
    const { deleteHeroAction } = await import('./admin')
    await expect(deleteHeroAction('hero-1')).resolves.toBe(false)
  })

  it('createHeroAction refuses an unauthenticated caller', async () => {
    cookieStore.get.mockReturnValue(undefined)
    const { createHeroAction } = await import('./admin')
    const result = await createHeroAction({ name: 'New Hero', alias: 'New' })
    await expect(result).toMatchObject({ ok: false, kind: 'auth' })
  })

  it('testDatabaseConnectionAction reports a failed query', async () => {
    cookieStore.get.mockReturnValue({ value: 'token-1' })
    const failing = {
      from: () => ({
        select: () => Promise.resolve({ error: { message: 'boom' }, count: null }),
      }),
    }
    dbMock = failing as unknown as DbMock
    const { testDatabaseConnectionAction } = await import('./admin')
    const res = await testDatabaseConnectionAction()
    expect(res.ok).toBe(false)
  })
})
