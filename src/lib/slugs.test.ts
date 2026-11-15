import { describe, expect, it } from 'vitest'
import { compareSlug, slugifyAlias } from './slugs'

describe('slugifyAlias', () => {
  it.each([
    ['Iron Man', 'iron-man'],
    ['Spider-Man', 'spider-man'],
    ['Star-Lord', 'star-lord'],
    ['Ant-Man', 'ant-man'],
    ['A-Train', 'a-train'],
    ['Spider-Man (Andrew)', 'spider-man-andrew'],
    ['One Punch Man', 'one-punch-man'],
    ["T'Challa", 'tchalla'],
  ])('maps %s to %s', (alias, expected) => {
    expect(slugifyAlias(alias)).toBe(expected)
  })
})

describe('compareSlug', () => {
  it.each([
    ['Spider-Man', 'spider-man'],
    ['Star-Lord', 'star-lord'],
    ['A-Train', 'a-train'],
    ['Spider-Man (Andrew)', 'spider-man-andrew'],
  ])('matches %s to %s', (alias, slug) => {
    expect(compareSlug(alias, slug)).toBe(true)
  })

  it('rejects different aliases', () => {
    expect(compareSlug('Iron Man', 'spider-man')).toBe(false)
  })
})
