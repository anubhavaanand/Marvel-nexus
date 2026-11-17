import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const store = new Map<string, { token_hash: string; expires_at: string }>()

let shouldError = false
let probeCount = 0

vi.mock('./service-supabase', () => ({
  getServiceSupabase: () => ({
    from: () => ({
      select: (_cols: string) => ({
        limit: async () => {
          probeCount += 1
          if (shouldError) return { error: { message: 'transient error' } }
          return { error: null }
        },
        eq: (col: string, val: string) => ({
          maybeSingle: async () => {
            if (shouldError) return { data: null, error: { message: 'transient error' } }
            const row = store.get(val)
            if (!row) return { data: null, error: null }
            return { data: row, error: null }
          },
        }),
      }),
      insert: async (row: { token_hash: string; expires_at: string }) => {
        if (shouldError) return { error: { message: 'transient error' } }
        store.set(row.token_hash, row)
        return { error: null }
      },
      delete: () => ({
        eq: async (col: string, val: string) => {
          if (shouldError) return { error: { message: 'transient error' } }
          if (col === 'token_hash') store.delete(val)
          return {}
        },
        lt: async () => {
          if (shouldError) return { error: { message: 'transient error' } }
          return {}
        },
      }),
    }),
  }),
}))

import {
  createSessionToken,
  revokeSessionToken,
  validateSessionToken,
  __resetDbModeForTest,
} from './admin-sessions'

beforeEach(() => {
  store.clear()
  shouldError = false
  probeCount = 0
  __resetDbModeForTest()
})

afterEach(() => {
  vi.useRealTimers()
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

describe('transient DB error recovery (re-probe)', () => {
  beforeEach(() => {
    store.clear()
    shouldError = false
    probeCount = 0
    __resetDbModeForTest()
  })

  it('recovers after a transient error on initial probe', async () => {
    shouldError = true
    await expect(createSessionToken()).rejects.toThrow(
      'Admin sessions require the admin_sessions table',
    )

    vi.useFakeTimers()
    vi.advanceTimersByTime(3000)

    shouldError = false
    const token = await createSessionToken()
    await expect(validateSessionToken(token)).resolves.toBe(true)
  })

  it('continues validating during transient write errors', async () => {
    const token = await createSessionToken()
    await expect(validateSessionToken(token)).resolves.toBe(true)

    shouldError = true
    await expect(createSessionToken()).rejects.toThrow('Failed to create admin session')

    // Validation may fail during the error, but dbMode is NOT permanently disabled.
    // After recovery, validation works again.

    vi.useFakeTimers()
    vi.advanceTimersByTime(3000)
    shouldError = false
    const token2 = await createSessionToken()
    await expect(validateSessionToken(token2)).resolves.toBe(true)
  })

  it('recovers validation after transient read error', async () => {
    const token = await createSessionToken()
    await expect(validateSessionToken(token)).resolves.toBe(true)

    shouldError = true
    await expect(validateSessionToken(token)).resolves.toBe(false)

    vi.useFakeTimers()
    vi.advanceTimersByTime(3000)
    shouldError = false
    await expect(validateSessionToken(token)).resolves.toBe(true)
  })

  it('revoke triggers re-probe on error but does not throw', async () => {
    const token = await createSessionToken()
    await expect(validateSessionToken(token)).resolves.toBe(true)

    shouldError = true
    await expect(revokeSessionToken(token)).resolves.toBeUndefined()

    vi.useFakeTimers()
    vi.advanceTimersByTime(3000)
    shouldError = false
    const token2 = await createSessionToken()
    await expect(validateSessionToken(token2)).resolves.toBe(true)
  })
})

describe('probe deduplication (concurrency)', () => {
  beforeEach(() => {
    store.clear()
    shouldError = false
    probeCount = 0
    __resetDbModeForTest()
  })

  it('dedupes concurrent probes into a single DB probe', async () => {
    const [a, b] = await Promise.all([createSessionToken(), createSessionToken()])
    expect(typeof a).toBe('string')
    expect(typeof b).toBe('string')
    expect(probeCount).toBe(1)
  })
})
