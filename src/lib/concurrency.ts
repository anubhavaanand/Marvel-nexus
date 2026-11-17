/**
 * Map over items with at most `limit` promises in flight.
 * Results preserve input order.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (!Number.isFinite(limit) || limit < 1) {
    throw new RangeError('limit must be a positive finite number')
  }
  const results = new Array<R>(items.length)
  const workerCount = Math.min(limit, items.length)
  let cursor = 0

  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < items.length) {
      const index = cursor++
      results[index] = await fn(items[index], index)
    }
  })

  await Promise.all(workers)
  return results
}
