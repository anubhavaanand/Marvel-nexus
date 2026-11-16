import { describe, expect, it } from 'vitest'
import { createSessionToken, revokeSessionToken, validateSessionToken } from './admin-sessions'

describe('admin session tokens (stateless fallback)', () => {
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
    const [expiresAt] = token.split('.')
    await expect(validateSessionToken(`${Number(expiresAt) + 1}.${token}`)).resolves.toBe(false)
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

  it('keeps the most recent revocation valid after hitting the bound', async () => {
    // Revoke well past the in-memory cap (4096). Pruning must evict the
    // oldest entries without throwing; the latest revocation stays live.
    const tokens: string[] = []
    for (let i = 0; i < 4500; i += 1) {
      tokens.push(await createSessionToken())
    }
    for (const token of tokens) {
      await revokeSessionToken(token)
    }
    // Latest revoked token must still be rejected (not yet evicted).
    await expect(validateSessionToken(tokens[tokens.length - 1])).resolves.toBe(false)
  })
})
