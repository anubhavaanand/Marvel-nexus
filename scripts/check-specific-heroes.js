require('dotenv').config({ path: '.env.local' })
const { createSupabaseClient } = require('./lib/supabase')

const supabase = createSupabaseClient()

async function checkImages() {
  console.log('🔍 Checking specific hero image URLs...\n')

  const heroesToCheck = ['Hulk', 'Hawkeye', 'Drax', 'Gamora', 'Iron Man', 'Thor']

  for (const alias of heroesToCheck) {
    const { data, error } = await supabase
      .from('heroes')
      .select('alias, name, image_url')
      .eq('alias', alias)
      .single()

    if (data) {
      console.log(`${alias}:`)
      console.log(`  Real Name: ${data.name}`)
      console.log(`  Image URL: ${data.image_url}`)
      console.log('')
    } else {
      console.log(`${alias}: Not found`)
    }
  }
}

checkImages()
