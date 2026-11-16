import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/**
 * Client that talks to Supabase with the service-role key, bypassing RLS.
 * Only import this from server-side code ('use server' modules or server components).
 */
export function getServiceSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Service Role Key is missing')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}
