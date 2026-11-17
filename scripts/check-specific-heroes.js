require('dotenv').config({ path: '.env.local' })
const { createSupabaseClient } = require('./lib/supabase')

// Default alias list. Override via CLI args or CHECK_HERO_ALIASES env var
// (comma-separated). Exported so callers/tests can reuse.
const DEFAULT_HERO_ALIASES = ['Hulk', 'Hawkeye', 'Drax', 'Gamora', 'Iron Man', 'Thor']

function resolveAliases() {
  const cli = process.argv.slice(2).filter(Boolean)
  if (cli.length) return cli
  const env = process.env.CHECK_HERO_ALIASES
  if (env)
    return env
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  return DEFAULT_HERO_ALIASES
}

const HERO_ALIASES = resolveAliases()

const supabase = createSupabaseClient()

async function checkImages(aliases = HERO_ALIASES) {
  console.log('🔍 Checking specific hero image URLs...\n')

  let hasErrors = false

  for (const alias of aliases) {
    const { data, error } = await supabase
      .from('heroes')
      .select('alias, name, image_url')
      .eq('alias', alias)
      .maybeSingle()

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
  return { hasErrors }
}

module.exports = { DEFAULT_HERO_ALIASES, HERO_ALIASES, resolveAliases, checkImages }

if (require.main === module) {
  checkImages()
}
