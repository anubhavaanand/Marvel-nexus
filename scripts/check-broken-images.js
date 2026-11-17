const { createClient } = require('@supabase/supabase-js')
const https = require('https')
const http = require('http')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

// #487: follow up to 3 redirects and treat 2xx/3xx as reachable.
const REDIRECT_LIMIT = 3

function checkUrlOnce(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ accessible: false, statusCode: null, location: null })
      return
    }

    const protocol = url.startsWith('https') ? https : http
    const request = protocol.get(url, (res) => {
      const result = {
        accessible: res.statusCode >= 200 && res.statusCode < 400,
        statusCode: res.statusCode,
        location: res.headers.location || null,
      }
      res.destroy()
      resolve(result)
    })

    request.on('error', () => {
      resolve({ accessible: false, statusCode: null, location: null })
    })

    request.setTimeout(5000, () => {
      request.destroy()
      resolve({ accessible: false, statusCode: null, location: null })
    })
  })
}

async function checkUrl(url) {
  let current = url
  for (let hop = 0; hop <= REDIRECT_LIMIT; hop++) {
    const result = await checkUrlOnce(current)
    if (
      !result.accessible ||
      !result.location ||
      ![301, 302, 303, 307, 308].includes(result.statusCode)
    ) {
      return result.accessible
    }
    current = new URL(result.location, current).toString()
  }
  return false
}

async function findBrokenImages() {
  console.log('Checking all hero images...\n')

  const { data: heroes, error } = await supabase
    .from('heroes')
    .select('id, name, alias, franchise, image_url')
    .order('alias')

  if (error) {
    console.error('Error:', error)
    return
  }

  const brokenImages = []

  for (const hero of heroes) {
    const isAccessible = await checkUrl(hero.image_url)
    if (!isAccessible) {
      brokenImages.push(hero)
      console.log(`❌ ${hero.alias} (${hero.name}) - ${hero.franchise}`)
      console.log(`   URL: ${hero.image_url}\n`)
    } else {
      console.log(`✅ ${hero.alias}`)
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`Total heroes: ${heroes.length}`)
  console.log(`Working images: ${heroes.length - brokenImages.length}`)
  console.log(`Broken images: ${brokenImages.length}`)
  console.log(`${'='.repeat(60)}\n`)

  if (brokenImages.length > 0) {
    console.log('Heroes with broken images:')
    brokenImages.forEach((h) => {
      console.log(`  - ${h.alias} (${h.franchise})`)
    })
  }
}

findBrokenImages()
