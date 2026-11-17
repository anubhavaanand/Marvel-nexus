require('dotenv').config({ path: '.env.local' })
const { createSupabaseClient } = require('./lib/supabase')

const supabase = createSupabaseClient()

async function countHeroes() {
  const { count: totalCount, error: totalError } = await supabase
    .from('heroes')
    .select('id', { count: 'exact', head: true })

  if (totalError) {
    console.error(totalError)
    return
  }

  const { data, error } = await supabase.from('heroes').select('franchise')

  if (error) {
    console.error(error)
    return
  }

  console.log(`\n📊 Total Heroes in Database: ${totalCount || data.length}\n`)

  // Count by franchise
  const franchises = {}
  data.forEach((h) => {
    franchises[h.franchise] = (franchises[h.franchise] || 0) + 1
  })

  console.log('By Franchise:')
  Object.entries(franchises)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      console.log(`  ${name}: ${count}`)
    })
}

countHeroes()
