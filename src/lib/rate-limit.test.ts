import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { isRateLimited, parseClientIp, resetRateLimiter } from './rate-limit'

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
