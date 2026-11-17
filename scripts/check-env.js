const { createClient } = require('@supabase/supabase-js')
const crypto = require('node:crypto')
require('dotenv').config({ path: '.env.local' })

function fingerprint(key) {
  if (!key) return 'undefined'
  const hash = crypto.createHash('sha256').update(key).digest('hex')
  return `sha256:${hash.slice(0, 8)}`
}

const verbose = process.argv.includes('--verbose')

async function main() {
  console.log('🔍 Checking Supabase Environment Variables...\n')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('NEXT_PUBLIC_SUPABASE_URL:', url ? '✅ Set' : '❌ Missing')
  if (verbose) console.log('  Value:', url || 'undefined')

  console.log('\nSUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✅ Set' : '❌ Missing')
  if (verbose)
    console.log(
      '  Value:',
      serviceKey ? `${fingerprint(serviceKey)} (length ${serviceKey.length})` : 'undefined',
    )

  console.log('\nNEXT_PUBLIC_SUPABASE_ANON_KEY:', anonKey ? '✅ Set' : '❌ Missing')
  if (verbose)
    console.log(
      '  Value:',
      anonKey ? `${fingerprint(anonKey)} (length ${anonKey.length})` : 'undefined',
    )

  console.log('\n' + '='.repeat(60))

  if (!url || !url.includes('supabase.co')) {
    console.log('❌ URL appears invalid or missing')
    console.log('\n💡 Your URL should look like:')
    console.log('   https://YOUR_PROJECT.supabase.co')
    process.exit(1)
  } else {
    console.log('✅ URL format looks correct')

    // Try to create client
    try {
      const supabase = createClient(url, serviceKey || anonKey)
      console.log('✅ Supabase client created successfully')

      // Try a simple query with timeout
      console.log('\n🔄 Testing database connection...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      try {
        const { data, error } = await supabase
          .from('heroes')
          .select('count')
          .limit(1)
          .abortSignal(controller.signal)

        clearTimeout(timeoutId)

        if (error) {
          console.log('❌ Connection test failed:', error.message)
          console.log('\n💡 This could mean:')
          console.log('   1. Database/project has been deleted')
          console.log('   2. Invalid credentials')
          console.log('   3. Network/firewall issue')
          process.exit(1)
        } else {
          console.log('✅ Connection successful!')
        }
      } catch (err) {
        clearTimeout(timeoutId)
        if (err.name === 'AbortError' || err.name === 'TimeoutError') {
          console.log('❌ Connection test timed out after 10s')
          process.exit(1)
        }
        throw err
      }
    } catch (err) {
      console.log('❌ Failed to create client:', err.message)
      process.exit(1)
    }
  }
}

main().catch((err) => {
  console.error('❌ Unexpected error:', err.message)
  process.exit(1)
})