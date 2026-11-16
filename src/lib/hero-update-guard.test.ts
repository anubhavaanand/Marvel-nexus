import { describe, expect, it } from 'vitest'
import { isValidHeroUpdatePayload } from './hero-update-guard'

describe('isValidHeroUpdatePayload', () => {
  it('accepts a normal hero update', () => {
    expect(isValidHeroUpdatePayload({ alias: 'Iron Man', powers: ['Flight'] })).toBe(true)
  })

  it('rejects non-objects, arrays, null', () => {
    expect(isValidHeroUpdatePayload(null)).toBe(false)
    expect(isValidHeroUpdatePayload([])).toBe(false)
    expect(isValidHeroUpdatePayload('x')).toBe(false)
    expect(isValidHeroUpdatePayload(42)).toBe(false)
  })

  it('rejects too many fields', () => {
    const obj: Record<string, string> = {}
    for (let i = 0; i < 20; i++) obj[`f${i}`] = 'v'
    expect(isValidHeroUpdatePayload(obj)).toBe(false)
  })

  it('rejects oversized strings and arrays', () => {
    expect(isValidHeroUpdatePayload({ alias: 'a'.repeat(501) })).toBe(false)
    const bigArr = Array.from({ length: 51 }, () => 'x')
    expect(isValidHeroUpdatePayload({ powers: bigArr })).toBe(false)
    expect(isValidHeroUpdatePayload({ powers: ['a'.repeat(201)] })).toBe(false)
  })

  it('rejects unknown keys', () => {
    expect(isValidHeroUpdatePayload({ alias: 'Iron Man', foo: 'bar' })).toBe(false)
    expect(isValidHeroUpdatePayload({ id: 1 } as unknown)).toBe(false)
  })

  it('rejects non-string array items and unknown types', () => {
    expect(isValidHeroUpdatePayload({ powers: [1, 2] as unknown })).toBe(false)
    expect(isValidHeroUpdatePayload({ alias: 5 as unknown })).toBe(false)
  })
})
