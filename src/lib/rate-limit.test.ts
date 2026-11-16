import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
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

  it('resets after the window passes', () => {
    vi.useFakeTimers()
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
    for (let i = 0; i < 100_000; i++) {
      isRateLimited(`key-${i}`, 5, 3_600_000)
    }
    vi.advanceTimersByTime(60_001)
    for (let i = 0; i < 10; i++) {
      isRateLimited(`overflow-${i}`, 5, 3_600_000)
    }
    expect(getRateLimiterSize()).toBe(100_000)
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
