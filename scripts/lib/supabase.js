'use strict'

const { createClient } = require('@supabase/supabase-js')

/**
 * Load environment variables from .env.local.
 *
 * dotenv is a devDependency and is already used by every script in this
 * directory, so we require it here rather than making the helper depend on
 * the caller remembering to load it.
 */
function loadEnv() {
  // eslint-disable-next-line global-require
  require('dotenv').config({ path: '.env.local' })
}

/**
 * Validate that the required Supabase credentials are present and return
 * them. Throws a descriptive Error instead of calling process.exit so the
 * caller can decide how to handle a missing configuration (test, import,
 * programmatic use).
 *
 * @param {{ SUPABASE_SERVICE_ROLE_KEY?: string, NEXT_PUBLIC_SUPABASE_URL?: string }} [env=process.env]
 * @returns {{ url: string, serviceRoleKey: string }}
 */
function getCredentials(env = process.env) {
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

  const missing = []
  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!serviceRoleKey) missing.push('SUPABASE_SERVICE_ROLE_KEY')

  if (missing.length > 0) {
    throw new Error(
      `Missing Supabase credential(s) in .env.local: ${missing.join(', ')}` +
        '\n\nPlease set:\n' +
        '  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url\n' +
        '  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key',
    )
  }

  return { url, serviceRoleKey }
}

/**
 * Create a Supabase client configured with the service-role key.
 *
 * Loads .env.local, validates the credentials, and throws a clear error
 * when they are missing instead of exiting the process.
 *
 * @param {object} [opts]
 * @param {boolean} [opts.loadEnv=true] - whether to call dotenv.config()
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 */
function createSupabaseClient({ loadEnv: shouldLoadEnv = true } = {}) {
  if (shouldLoadEnv) {
    loadEnv()
  }

  const { url, serviceRoleKey } = getCredentials()
  return createClient(url, serviceRoleKey)
}

module.exports = { createSupabaseClient, getCredentials, loadEnv }
