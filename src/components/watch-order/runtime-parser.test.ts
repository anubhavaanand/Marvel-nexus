import { describe, it, expect } from 'vitest'
import { parseRuntime, parseRuntimes } from './runtime-parser'

describe('parseRuntime', () => {
  it('parses "Xh Ym" format', () => {
    expect(parseRuntime('2h 4m').minutes).toBe(124)
    expect(parseRuntime('2h 4m').parsed).toBe(true)
  })
  it('parses "Xh" only', () => {
    expect(parseRuntime('1h').minutes).toBe(60)
    expect(parseRuntime('1h').parsed).toBe(true)
  })
  it('parses "Ym" only', () => {
    expect(parseRuntime('45m').minutes).toBe(45)
    expect(parseRuntime('45m').parsed).toBe(true)
  })
  it('parses "Ymin" variant', () => {
    expect(parseRuntime('90min').minutes).toBe(90)
    expect(parseRuntime('90min').parsed).toBe(true)
  })
  it('parses "1h 5m"', () => {
    expect(parseRuntime('1h 5m').minutes).toBe(65)
    expect(parseRuntime('1h 5m').parsed).toBe(true)
  })
  it('returns parsed false for unparseable', () => {
    expect(parseRuntime('unknown').parsed).toBe(false)
    expect(parseRuntime('unknown').minutes).toBe(0)
  })
  it('returns parsed false for empty', () => {
    expect(parseRuntime('').parsed).toBe(false)
    expect(parseRuntime(undefined).parsed).toBe(false)
  })
})

describe('parseRuntimes', () => {
  it('sums parseable runtimes and reports unparseable', () => {
    const { totalMinutes, unparseable } = parseRuntimes(['2h 4m', '45m', 'bogus', '1h'])
    expect(totalMinutes).toBe(124 + 45 + 60)
    expect(unparseable).toHaveLength(1)
    expect(unparseable[0].original).toBe('bogus')
  })
})