import { afterEach, describe, expect, it } from 'vitest'
import { getServiceSupabase } from './service-supabase'

const requiredEnvs = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

function clearEnvs() {
  for (const key of requiredEnvs) delete process.env[key]
}

afterEach(() => {
  clearEnvs()
})

describe('getServiceSupabase (missing service-role config)', () => {
  it('throws a generic error without leaking env-var names', () => {
    clearEnvs()
    expect(() => getServiceSupabase()).toThrow('Supabase service client is not configured')
  })

  it('never mentions SUPABASE_SERVICE_ROLE_KEY in the message', () => {
    clearEnvs()
    try {
      getServiceSupabase()
      throw new Error('expected getServiceSupabase to throw')
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      expect(message).not.toContain('SUPABASE_SERVICE_ROLE_KEY')
      expect(message).not.toContain('NEXT_PUBLIC_SUPABASE_URL')
    }
  })
})
