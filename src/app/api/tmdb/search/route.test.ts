import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { resetRateLimiter } from '@/lib/rate-limit'

vi.mock('@/lib/rate-limit', () => ({
  isRateLimited: vi.fn(() => false),
  resolveClientIp: vi.fn(() => '1.2.3.4'),
  resetRateLimiter: vi.fn(),
}))

describe('tmdb search route', () => {
  beforeEach(() => {
    vi.resetModules()
    process.env.TMDB_API_KEY = 'test-key'
    vi.stubGlobal('fetch', vi.fn())
    resetRateLimiter()
  })
  afterEach(() => {
    delete process.env.TMDB_API_KEY
    vi.unstubAllGlobals()
  })

  it('returns 400 on missing query', async () => {
    const { GET } = await import('./route')
    const req = new NextRequest('http://localhost/api/tmdb/search')
    const res = await GET(req)
    expect(res.status).toBe(400)
  })

  it('returns person on success and caches', async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(JSON.stringify({ results: [{ profile_path: '/a.jpg' }] }), { status: 200 }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { GET } = await import('./route')
    const req = new NextRequest('http://localhost/api/tmdb/search?query=Tony')
    const res = await GET(req)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.person.profile_path).toBe('/a.jpg')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    // second call cached -> no fetch
    const res2 = await GET(new NextRequest('http://localhost/api/tmdb/search?query=Tony'))
    expect(res2.status).toBe(200)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns 429 shape when limited', async () => {
    const { isRateLimited } = await import('@/lib/rate-limit')
    vi.mocked(isRateLimited).mockReturnValue(true)
    vi.resetModules()
    const { GET } = await import('./route')
    // use unique query to avoid cache
    const req = new NextRequest('http://localhost/api/tmdb/search?query=UniqueX')
    const res = await GET(req)
    expect(res.status).toBe(429)
    const body = await res.json()
    expect(body.error).toBe('Too many requests')
    expect(res.headers.get('retry-after')).toBe('60')
  })
})
