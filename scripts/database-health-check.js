const { createSupabaseClient } = require('./lib/supabase')
const https = require('https')
const http = require('http')

// Function to check if URL is accessible
function checkUrl(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve({ accessible: false, reason: 'No URL' })
      return
    }

    const protocol = url.startsWith('https') ? https : http
    const request = protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        resolve({ accessible: true, statusCode: 200 })
      } else {
        resolve({ accessible: false, statusCode: res.statusCode })
      }
    })

    request.on('error', (err) => {
      resolve({ accessible: false, reason: err.message })
    })

    request.setTimeout(5000, () => {
      request.destroy()
      resolve({ accessible: false, reason: 'Timeout' })
    })
  })
}

async function healthCheck() {
  const supabase = createSupabaseClient()
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log('║         🏥 DATABASE HEALTH CHECK - Full Scan 🏥           ║')
  console.log('╚═══════════════════════════════════════════════════════════╝\n')

  // 1. CONNECTION TEST
  console.log('🔌 Testing Database Connection...')
  const { data: testData, error: testError } = await supabase
    .from('heroes')
    .select('count')
    .limit(1)

  if (testError) {
    console.error('❌ Connection Failed:', testError.message)
    console.log('\n💡 Check your .env.local file has valid credentials:')
    console.log('   NEXT_PUBLIC_SUPABASE_URL=your_project_url')
    console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_key\n')
    return
  }
  console.log('✅ Connection Successful\n')

  // 2. GET ALL HEROES
  console.log('📊 Fetching All Heroes...')
  const { data: heroes, error } = await supabase.from('heroes').select('*').order('alias')

  if (error) {
    console.error('❌ Error:', error.message)
    return
  }

  console.log(`✅ Found ${heroes.length} heroes\n`)

  // 3. FRANCHISE BREAKDOWN
  console.log('═'.repeat(60))
  console.log('📚 FRANCHISE BREAKDOWN:')
  console.log('═'.repeat(60))
  const franchises = {}
  heroes.forEach((h) => {
    franchises[h.franchise] = (franchises[h.franchise] || 0) + 1
  })

  Object.entries(franchises)
    .sort((a, b) => b[1] - a[1])
    .forEach(([name, count]) => {
      console.log(`  ${name.padEnd(20)} ${count} heroes`)
    })

  // 4. CHECK FOR BROKEN IMAGES
  console.log('\n' + '═'.repeat(60))
  console.log('🖼️  CHECKING IMAGE URLS (this may take a minute)...')
  console.log('═'.repeat(60))

  const brokenImages = []
  const slowImages = []
  let checked = 0

  for (const hero of heroes) {
    checked++
    process.stdout.write(`\rProgress: ${checked}/${heroes.length}`)

    const startTime = Date.now()
    const result = await checkUrl(hero.image_url)
    const responseTime = Date.now() - startTime

    if (!result.accessible) {
      brokenImages.push({
        ...hero,
        reason: result.reason || `Status: ${result.statusCode}`,
      })
    } else if (responseTime > 3000) {
      slowImages.push({ ...hero, responseTime })
    }
  }

  console.log('\n')

  // 5. CHECK FOR MISSING DATA
  console.log('═'.repeat(60))
  console.log('🔍 DATA QUALITY CHECK:')
  console.log('═'.repeat(60))

  const missingData = {
    name: heroes.filter((h) => !h.name || h.name.trim() === ''),
    alias: heroes.filter((h) => !h.alias || h.alias.trim() === ''),
    franchise: heroes.filter((h) => !h.franchise),
    origin_world: heroes.filter((h) => !h.origin_world),
    image_url: heroes.filter((h) => !h.image_url),
    powers: heroes.filter((h) => !h.powers || h.powers.length === 0),
    weaknesses: heroes.filter((h) => !h.weaknesses || h.weaknesses.length === 0),
  }

  let hasIssues = false
  Object.entries(missingData).forEach(([field, items]) => {
    if (items.length > 0) {
      hasIssues = true
      console.log(`  ⚠️  ${items.length} heroes missing ${field}`)
      items.slice(0, 3).forEach((h) => {
        console.log(`     - ${h.alias || 'Unknown'}`)
      })
      if (items.length > 3) {
        console.log(`     ... and ${items.length - 3} more`)
      }
    }
  })

  if (!hasIssues) {
    console.log('  ✅ All heroes have complete data!')
  }

  // 6. DUPLICATE CHECK
  console.log('\n' + '═'.repeat(60))
  console.log('🔄 DUPLICATE CHECK:')
  console.log('═'.repeat(60))

  const aliases = {}
  const duplicates = []
  heroes.forEach((h) => {
    if (aliases[h.alias]) {
      duplicates.push(h.alias)
    }
    aliases[h.alias] = (aliases[h.alias] || 0) + 1
  })

  if (duplicates.length > 0) {
    console.log(`  ⚠️  Found ${duplicates.length} duplicate aliases:`)
    duplicates.forEach((alias) => {
      console.log(`     - ${alias} (appears ${aliases[alias]} times)`)
    })
  } else {
    console.log('  ✅ No duplicate aliases found!')
  }

  // 7. FINAL REPORT
  console.log('\n' + '═'.repeat(60))
  console.log('📋 FINAL REPORT:')
  console.log('═'.repeat(60))
  console.log(`  Total Heroes:       ${heroes.length}`)
  console.log(`  Broken Images:      ${brokenImages.length}`)
  console.log(`  Slow Images (>3s):  ${slowImages.length}`)
  console.log(`  Duplicates:         ${duplicates.length}`)
  console.log(`  Missing Data:       ${hasIssues ? 'Yes ⚠️' : 'None ✅'}`)

  if (brokenImages.length > 0) {
    console.log('\n' + '═'.repeat(60))
    console.log('❌ BROKEN IMAGES:')
    console.log('═'.repeat(60))
    brokenImages.forEach((h) => {
      console.log(`  ${h.alias} (${h.franchise})`)
      console.log(`     URL: ${h.image_url}`)
      console.log(`     Reason: ${h.reason}\n`)
    })
  }

  if (slowImages.length > 0) {
    console.log('═'.repeat(60))
    console.log('⏱️  SLOW IMAGES (may need optimization):')
    console.log('═'.repeat(60))
    slowImages.slice(0, 10).forEach((h) => {
      console.log(`  ${h.alias}: ${h.responseTime}ms`)
    })
    if (slowImages.length > 10) {
      console.log(`  ... and ${slowImages.length - 10} more`)
    }
  }

  // 8. HEALTH SCORE
  console.log('\n' + '═'.repeat(60))
  // #500: an empty database is "no data", not a critical failure.
  const healthScore =
    heroes.length === 0
      ? null
      : Math.round(
          ((heroes.length - brokenImages.length - duplicates.length) / heroes.length) * 100,
        )
  console.log(`🏆 OVERALL HEALTH SCORE: ${healthScore === null ? 'N/A' : `${healthScore}%`}`)
  console.log('═'.repeat(60))

  if (healthScore === null) {
    console.log('ℹ️  No heroes found — run the seed scripts before scoring this database.')
  } else if (healthScore >= 95) {
    console.log('🎉 EXCELLENT! Database is in great shape!')
  } else if (healthScore >= 80) {
    console.log('👍 GOOD! Minor issues to address.')
  } else if (healthScore >= 60) {
    console.log('⚠️  WARNING! Several issues need attention.')
  } else {
    console.log('❌ CRITICAL! Database needs immediate fixes.')
  }

  console.log('')
}

healthCheck().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
