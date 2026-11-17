import { describe, expect, it } from 'vitest'
import { getMCUPhase } from './tmdb'

describe('getMCUPhase', () => {
  it.each([
    ['2008-05-02', 'Phase 1'],
    ['2012-05-04', 'Phase 1'],
    ['2015-05-01', 'Phase 2'],
    ['2019-04-26', 'Phase 3'],
    ['2022-11-11', 'Phase 4'],
    ['2024-07-26', 'Phase 5'],
    ['2025-02-14', 'Phase 6'],
  ])('maps %s to %s', (releaseDate, expected) => {
    expect(getMCUPhase(releaseDate)).toBe(expected)
  })

  // #461: invalid/empty dates must not silently become Phase 6.
  it.each([[''], ['not-a-date'], ['2025-99-99']] as const)(
    'returns null for invalid date %p',
    (releaseDate: string) => {
      expect(getMCUPhase(releaseDate)).toBeNull()
    },
  )
})
