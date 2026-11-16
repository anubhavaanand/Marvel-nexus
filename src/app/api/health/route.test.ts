import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/service-supabase', () => ({
  getServiceSupabase: vi.fn(),
  __resetServiceSupabaseForTests: vi.fn(),
}))

describe('health route', () => {
  beforeEach(() => {
    vi.resetModules()
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns 200 ok when db responds', async () => {
    const { getServiceSupabase } = await import('@/lib/service-supabase')
    vi.mocked(getServiceSupabase).mockReturnValue({
      from: () => ({
        select: () => ({ limit: () => Promise.resolve({ data: [{ id: '1' }], error: null }) }),
      }),
    } as never)
    const { GET } = await import('./route')
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('ok')
    expect(body.db).toBe('ok')
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 503 when db errors', async () => {
    const { getServiceSupabase } = await import('@/lib/service-supabase')
    vi.mocked(getServiceSupabase).mockReturnValue({
      from: () => ({
        select: () => ({ limit: () => Promise.resolve({ data: null, error: new Error('boom') }) }),
      }),
    } as never)
    const { GET } = await import('./route')
    const res = await GET()
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body.status).toBe('error')
    expect(body.db).toBe('error')
  })

  it('returns 503 when not configured', async () => {
    const { getServiceSupabase } = await import('@/lib/service-supabase')
    vi.mocked(getServiceSupabase).mockImplementation(() => {
      throw new Error('Supabase service client is not configured')
    })
    const { GET } = await import('./route')
    const res = await GET()
    expect(res.status).toBe(503)
  })
})
