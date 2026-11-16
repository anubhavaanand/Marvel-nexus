const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const guard = require('./seed-guard')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

const spidermen = [
  {
    alias: 'Spider-Man (Tobey)',
    name: 'Peter Parker',
    franchise: 'Spider-Verse',
    origin_world: 'Earth-96283',
    image_url:
      'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/90/Spider-Man_No_Way_Home_profile_Tobey_Maguire.jpg/revision/latest?cb=20211222020212', // Verified Character Profile
    powers: ['Organic Webbing', 'Super Strength', 'Spider-Sense'],
    weaknesses: ['Back Pain', 'Mary Jane'],
    is_locked_content: false,
  },
  {
    alias: 'Spider-Man (Andrew)',
    name: 'Peter Parker',
    franchise: 'Spider-Verse',
    origin_world: 'Earth-120703',
    image_url:
      'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/52/Spider-Man_No_Way_Home_profile_Andrew_Garfield.jpg/revision/latest?cb=20211221195655', // Verified Character Profile
    powers: ['Agility', 'Web Shooters', 'Scientific Genius'],
    weaknesses: ['Guilt (Gwen Stacy)', 'Rage'],
    is_locked_content: false,
  },
]

async function addSpidermen() {
  console.log('🕷️  Adding The Spider-Men...')

  const flags = guard.parseArgs(process.argv.slice(2))
  // This script deletes existing rows for the two aliases it manages —
  // destructive, so require an explicit opt-in.
  if (!flags.confirm) {
    console.log('')
    console.log('⚠️  add-spidermen.js — overwrites 2 existing hero rows (DESTRUCTIVE)')
    console.log('')
    console.log('This script will:')
    console.log('   🗑️  DELETE existing rows for aliases: Spider-Man (Tobey), Spider-Man (Andrew)')
    console.log('   ✅  Insert/update the two Spider-Verse heroes')
    console.log('')
    console.log('To proceed, re-run with --confirm:')
    console.log('   node scripts/add-spidermen.js --confirm')
    console.log('   OR set SEED_CONFIRM=1 in your environment')
    process.exit(1)
  }

  for (const hero of spidermen) {
    // Delete if exists to avoid dupes
    await supabase.from('heroes').delete().eq('alias', hero.alias)

    const { error } = await supabase.from('heroes').insert(hero)
    if (error) console.error(`❌ Failed: ${hero.alias}`)
    else console.log(`✅ ${hero.alias}`)
  }

  console.log('🕸️  Spider-Verse Expanded!')
}

addSpidermen().catch(console.error)
