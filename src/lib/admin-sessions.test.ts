import { describe, expect, it, vi, beforeEach } from 'vitest'

const store = new Map<string, { token_hash: string; expires_at: string }>()

vi.mock('./service-supabase', () => ({
  getServiceSupabase: () => ({
    from: () => ({
      select: (_cols: string) => ({
        limit: async () => ({ error: null }),
        eq: (col: string, val: string) => ({
          maybeSingle: async () => {
            const row = store.get(val)
            if (!row) return { data: null, error: null }
            return { data: row, error: null }
          },
        }),
      }),
      insert: async (row: { token_hash: string; expires_at: string }) => {
        store.set(row.token_hash, row)
        return { error: null }
      },
      delete: () => ({
        eq: async (col: string, val: string) => {
          if (col === 'token_hash') store.delete(val)
          return {}
        },
        lt: async () => ({}),
      }),
    }),
  }),
}))

import { createSessionToken, revokeSessionToken, validateSessionToken } from './admin-sessions'

beforeEach(() => {
  store.clear()
})

describe('admin session tokens', () => {
  it('creates a token that validates', async () => {
    const token = await createSessionToken()
    await expect(validateSessionToken(token)).resolves.toBe(true)
  })

  it('rejects an empty or malformed token', async () => {
    await expect(validateSessionToken('')).resolves.toBe(false)
    await expect(validateSessionToken('not-a-token')).resolves.toBe(false)
  })

  it('rejects a tampered token', async () => {
    const token = await createSessionToken()
    await expect(validateSessionToken(`${token}x`)).resolves.toBe(false)
  })

  it('rejects a revoked token', async () => {
    const token = await createSessionToken()
    await expect(validateSessionToken(token)).resolves.toBe(true)
    await revokeSessionToken(token)
    await expect(validateSessionToken(token)).resolves.toBe(false)
  })

  it('treats revoking an empty token as a no-op', async () => {
    await expect(revokeSessionToken('')).resolves.toBeUndefined()
  })
})
