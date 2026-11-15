import { describe, expect, it } from 'vitest'
import { mapWithConcurrency } from './concurrency'

describe('mapWithConcurrency', () => {
  it('preserves input order', async () => {
    const result = await mapWithConcurrency([1, 2, 3, 4, 5], 2, async (n) => n * 2)
    expect(result).toEqual([2, 4, 6, 8, 10])
  })

  it('never exceeds the limit', async () => {
    let active = 0
    let maxActive = 0

    await mapWithConcurrency(
      Array.from({ length: 12 }, (_, i) => i),
      3,
      async (n) => {
        active++
        maxActive = Math.max(maxActive, active)
        await new Promise((resolve) => setTimeout(resolve, 5))
        active--
        return n
      },
    )

    expect(maxActive).toBeLessThanOrEqual(3)
  })

  it('handles empty input', async () => {
    await expect(mapWithConcurrency([], 3, async () => 1)).resolves.toEqual([])
  })
})
