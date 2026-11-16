import { describe, expect, it } from 'vitest'
import { createSessionToken, validateSessionToken } from './admin-sessions'

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
})
