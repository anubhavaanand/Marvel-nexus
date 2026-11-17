const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

async function checkImages() {
  console.log('🔍 Checking specific hero image URLs...\n')

  const heroesToCheck = ['Hulk', 'Hawkeye', 'Drax', 'Gamora', 'Iron Man', 'Thor']
  let hasErrors = false

  for (const alias of heroesToCheck) {
    const { data, error } = await supabase
      .from('heroes')
      .select('alias, name, image_url')
      .eq('alias', alias)
      .single()

    if (error) {
      console.error(`❌ ${alias}: Query error - ${error.message}`)
      hasErrors = true
    } else if (data) {
      console.log(`${alias}:`)
      console.log(`  Real Name: ${data.name}`)
      console.log(`  Image URL: ${data.image_url}`)
      console.log('')
    } else {
      console.error(`❌ ${alias}: Not found in database`)
      hasErrors = true
    }
  }

  if (hasErrors) {
    process.exitCode = 1
  }
}

checkImages()
