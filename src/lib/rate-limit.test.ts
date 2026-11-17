import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  __setMaxKeysForTest,
  getRateLimiterSize,
  isRateLimited,
  parseClientIp,
  resetRateLimiter,
  resolveClientIp,
} from './rate-limit'

describe('isRateLimited', () => {
  beforeEach(() => resetRateLimiter())
  afterEach(() => vi.useRealTimers())

  it('allows up to the limit inside the window', () => {
    for (let i = 0; i < 3; i++) {
      expect(isRateLimited('ip', 3, 1000)).toBe(false)
    }
    expect(isRateLimited('ip', 3, 1000)).toBe(true)
  })

  it('tracks keys independently', () => {
    expect(isRateLimited('a', 1, 1000)).toBe(false)
    expect(isRateLimited('a', 1, 1000)).toBe(true)
    expect(isRateLimited('b', 1, 1000)).toBe(false)
  })

  it('does not extend lockout expiry on rejected attempts', () => {
    vi.useFakeTimers()
    resetRateLimiter()
    expect(isRateLimited('k', 1, 100)).toBe(false)
    // Repeated rejected attempts must not slide the window.
    vi.advanceTimersByTime(50)
    expect(isRateLimited('k', 1, 100)).toBe(true)
    vi.advanceTimersByTime(30)
    expect(isRateLimited('k', 1, 100)).toBe(true)
    // Original window (100ms) has elapsed; bucket should be unlocked.
    vi.advanceTimersByTime(25)
    expect(isRateLimited('k', 1, 100)).toBe(false)
  })

  it('resets after the window passes', () => {
    vi.useFakeTimers()
    resetRateLimiter()
    expect(isRateLimited('c', 1, 20)).toBe(false)
    expect(isRateLimited('c', 1, 20)).toBe(true)
    vi.advanceTimersByTime(25)
    expect(isRateLimited('c', 1, 20)).toBe(false)
  })
})

describe('parseClientIp', () => {
  it('takes the first entry of a forwarded-for list', () => {
    expect(parseClientIp('203.0.113.7, 10.0.0.1')).toBe('203.0.113.7')
  })

  it('takes the untrusted entry before trusted proxies (multi-hop)', () => {
    // client, proxy1, proxy2 with 2 trusted proxies -> client
    expect(parseClientIp('203.0.113.7, 10.0.0.1, 10.0.0.2', 2)).toBe('203.0.113.7')
    // single trusted proxy -> the entry just before it
    expect(parseClientIp('203.0.113.7, 10.0.0.1, 10.0.0.2', 1)).toBe('10.0.0.1')
  })

  it('falls back to unknown when absent', () => {
    expect(parseClientIp(null)).toBe('unknown')
    expect(parseClientIp('   ')).toBe('unknown')
  })
})

describe('memory bounds', () => {
  afterEach(() => vi.useRealTimers())

  it('prunes fully expired entries', () => {
    vi.useFakeTimers()
    resetRateLimiter()
    isRateLimited('stale', 5, 1_000)
    // Force the periodic prune path on the next call.
    vi.advanceTimersByTime(60_001)
    isRateLimited('fresh', 5, 1_000)
    expect(getRateLimiterSize()).toBe(1)
  })

  it('caps tracked keys', () => {
    vi.useFakeTimers()
    resetRateLimiter()
    // #465: shrink the cap so coverage no longer needs 100k insertions.
    __setMaxKeysForTest(8)
    for (let i = 0; i < 8; i++) {
      isRateLimited(`key-${i}`, 5, 3_600_000)
    }
    vi.advanceTimersByTime(60_001)
    for (let i = 0; i < 3; i++) {
      isRateLimited(`overflow-${i}`, 5, 3_600_000)
    }
    expect(getRateLimiterSize()).toBe(8)
  })
})

describe('resolveClientIp', () => {
  const original = process.env.TRUST_PROXY

  afterEach(() => {
    if (original === undefined) delete process.env.TRUST_PROXY
    else process.env.TRUST_PROXY = original
  })

  it('honors forwarded headers when TRUST_PROXY=true', () => {
    process.env.TRUST_PROXY = 'true'
    expect(resolveClientIp('203.0.113.7, 10.0.0.1', null)).toBe('203.0.113.7')
    expect(resolveClientIp(null, '198.51.100.4')).toBe('198.51.100.4')
  })

  it('ignores spoofable headers without TRUST_PROXY', () => {
    delete process.env.TRUST_PROXY
    expect(resolveClientIp('203.0.113.7, 10.0.0.1', '198.51.100.4')).toBe('unknown')
  })
})

describe('eviction order and expiry', () => {
  beforeEach(() => resetRateLimiter())
  afterEach(() => vi.useRealTimers())

  it('expires per-key entries on access', () => {
    vi.useFakeTimers()
    isRateLimited('x', 1, 10)
    vi.advanceTimersByTime(15)
    expect(isRateLimited('x', 1, 10)).toBe(false)
  })

  it('evicts expired entries before LRU on overflow', () => {
    vi.useFakeTimers()
    resetRateLimiter()
    // Fill map with some entries
    isRateLimited('expired-1', 5, 10)
    isRateLimited('expired-2', 5, 10)
    isRateLimited('valid-1', 5, 100000)
    // Advance past expiry for expired keys
    vi.advanceTimersByTime(20)
    // Trigger periodic prune by advancing past PRUNE_INTERVAL_MS
    vi.advanceTimersByTime(60_001)
    // Add more keys to force capacity check
    isRateLimited('new-1', 5, 100000)
    isRateLimited('new-2', 5, 100000)
    // Expired keys should be gone, valid ones remain
    expect(getRateLimiterSize()).toBeLessThanOrEqual(4)
  })

  it('keeps recently accessed keys over older ones on overflow', () => {
    vi.useFakeTimers()
    resetRateLimiter()
    __setMaxKeysForTest(8)
    // Fill to capacity, then re-touch key-0 so it becomes most-recently-used.
    for (let i = 0; i < 8; i++) {
      isRateLimited(`key-${i}`, 5, 3_600_000)
    }
    isRateLimited('key-0', 5, 3_600_000)
    vi.advanceTimersByTime(60_001)
    // Force overflow with new keys; LRU must drop the cold front entries first.
    for (let i = 0; i < 5; i++) {
      isRateLimited(`overflow-${i}`, 5, 3_600_000)
    }
    expect(getRateLimiterSize()).toBe(8)
    // key-0 was refreshed last, so it survives as a tracked bucket; the cold
    // front entries were the ones evicted instead.
    expect(isRateLimited('key-0', 1, 3_600_000)).toBe(true)
    expect(isRateLimited('key-1', 1, 3_600_000)).toBe(false)
  })
})
