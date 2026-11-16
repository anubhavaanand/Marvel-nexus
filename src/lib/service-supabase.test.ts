import { afterEach, describe, expect, it } from 'vitest'
import { getServiceSupabase, __resetServiceSupabaseForTests } from './service-supabase'

const requiredEnvs = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']

function clearEnvs() {
  for (const key of requiredEnvs) delete process.env[key]
}

afterEach(() => {
  clearEnvs()
  __resetServiceSupabaseForTests()
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

describe('getServiceSupabase (memoization)', () => {
  it('returns the same instance on repeated calls with same env', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'

    const client1 = getServiceSupabase()
    const client2 = getServiceSupabase()

    expect(client1).toBe(client2)
  })

  it('creates a new instance when env changes', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test1.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key-1'

    const client1 = getServiceSupabase()

    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test2.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key-2'

    const client2 = getServiceSupabase()

    expect(client1).not.toBe(client2)
  })

  it('reset clears the cache so next call creates new instance', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key'

    const client1 = getServiceSupabase()
    __resetServiceSupabaseForTests()
    const client2 = getServiceSupabase()

    expect(client1).not.toBe(client2)
  })
})
