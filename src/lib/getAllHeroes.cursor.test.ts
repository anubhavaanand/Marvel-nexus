import { afterEach, describe, expect, it, vi } from 'vitest'

// #460: the demo/mock branch of getAllHeroes must honour the cursor option the
// same way the database branch does (keyset on id, ascending).

const originalEnv = { ...process.env }

afterEach(() => {
  process.env = { ...originalEnv }
  vi.resetModules()
})

async function loadWithoutSupabase() {
  delete process.env.NEXT_PUBLIC_SUPABASE_URL
  delete process.env.SUPABASE_URL
  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
  return import('@/lib/supabase')
}

describe('getAllHeroes cursor pagination (#460)', () => {
  it('walks every hero exactly once when Supabase is not configured', async () => {
    const { getAllHeroes } = await loadWithoutSupabase()

    const firstPage = await getAllHeroes({ pageSize: 5 })
    expect(firstPage.length).toBe(5)

    const collected = [...firstPage]
    let cursor: string | undefined = String(firstPage[firstPage.length - 1].id)
    for (let guard = 0; guard < 100 && cursor; guard += 1) {
      const page = await getAllHeroes({ pageSize: 5, cursor })
      if (page.length === 0) break
      collected.push(...page)
      if (page.length < 5) break
      cursor = String(page[page.length - 1].id)
    }

    const ids = collected.map((h) => String(h.id))
    expect(new Set(ids).size).toBe(ids.length) // no repeated rows
    const full = await getAllHeroes({ page: 1, pageSize: 1000 })
    expect(collected.length).toBe(full.length) // nothing skipped
    expect(ids).toEqual([...ids].sort((a, b) => Number(a) - Number(b))) // ascending id
  })

  it('returns an empty page past the last cursor', async () => {
    const { getAllHeroes } = await loadWithoutSupabase()
    const page = await getAllHeroes({ pageSize: 5, cursor: '999999' })
    expect(page).toEqual([])
  })

  it('compares non-numeric ids as text instead of yielding an empty page', async () => {
    const { getAllHeroes } = await loadWithoutSupabase()
    // The seed mock uses numeric strings; a UUID-shaped cursor must still
    // produce a deterministic, non-NaN ordering rather than dropping everything.
    const page = await getAllHeroes({ pageSize: 3, cursor: '00000000-0000-0000-0000-000000000000' })
    expect(page.length).toBeGreaterThan(0)
  })
})
