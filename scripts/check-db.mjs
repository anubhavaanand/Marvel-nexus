import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables are missing in .env.local')
  process.exit(1)
}

const supabase = createClient(url, serviceKey)

async function check() {
  console.log('🔍 Checking Supabase connection...\n')
  
  const tables = ['heroes', 'movies', 'canon_events', 'hero_movies']
  let allGood = true

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (error) {
      console.log(`❌ ${table}: ${error.message}`)
      allGood = false
    } else {
      console.log(`✅ ${table}: EXISTS (${count} rows in database)`)
    }
  }

  console.log('\n' + (allGood ? '🎉 All tables ready!' : '⚠️  Tables are missing — need to run setup SQL'))
}

check().catch(console.error)
