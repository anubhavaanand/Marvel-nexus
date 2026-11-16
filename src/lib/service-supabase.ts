import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * Client that talks to Supabase with the service-role key, bypassing RLS.
 * Only import this from server-side code ('use server' modules or server components).
 */

let cachedClient: SupabaseClient | null = null
let cachedSignature: string | null = null

/**
 * Builds (and memoizes) the service-role Supabase client (bypasses RLS).
 *
 * The client is reused per process to avoid repeated setup cost. The cache is
 * keyed on the current env values, so changes to NEXT_PUBLIC_SUPABASE_URL /
 * SUPABASE_SERVICE_ROLE_KEY (e.g. in tests) invalidate the cached instance.
 * Module reset (vi.resetModules) also clears the cache naturally.
 *
 * Throws a generic, env-var-free error when the service-role key is missing
 * so misconfiguration never surfaces raw credential names to callers. Callers
 * are responsible for catching this and degrading gracefully:
 *   - server actions return a typed { ok: false, error } result
 *   - page data helpers fail closed (return null / treat as not visible)
 */
export function getServiceSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  if (!url || !serviceKey) {
    throw new Error('Supabase service client is not configured')
  }
  const signature = `${url}\u0000${serviceKey}`
  if (cachedClient && cachedSignature === signature) {
    return cachedClient
  }
  cachedClient = createClient(url, serviceKey)
  cachedSignature = signature
  return cachedClient
}

/** Test-only: drop the cached singleton. */
export function __resetServiceSupabaseForTests(): void {
  cachedClient = null
  cachedSignature = null
}
