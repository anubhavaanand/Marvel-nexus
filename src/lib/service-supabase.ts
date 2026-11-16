import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Client that talks to Supabase with the service-role key, bypassing RLS.
 * Only import this from server-side code ('use server' modules or server components).
 */
/**
 * Builds the service-role Supabase client (bypasses RLS).
 *
 * Throws a generic, env-var-free error when the service-role key is missing
 * so misconfiguration never surfaces raw credential names to callers. Callers
 * are responsible for catching this and degrading gracefully:
 *   - server actions return a typed { ok: false, error } result
 *   - page data helpers fail closed (return null / treat as not visible)
 */
export function getServiceSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase service client is not configured')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}
