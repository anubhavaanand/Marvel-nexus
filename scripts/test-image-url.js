require('dotenv').config({ path: '.env.local' })
const { createSupabaseClient } = require('./lib/supabase')

const supabase = createSupabaseClient()

/**
 * VERIFIED IMAGE URL TESTER
 * This script helps you test image URLs BEFORE adding them to heroes
 * Run: node scripts/test-image-url.js "https://your-image-url.jpg"
 */

const { isAllowedImageUrl } = require('./lib/image-url-policy')

async function testImageURL(url) {
  console.log(`\n🔍 Testing Image URL...`)
  console.log(`URL: ${url}\n`)

  // #513: the app's own allowlist decides whether a URL is usable.
  if (!isAllowedImageUrl(url)) {
    console.log(`❌ Image URL REJECTED by the app validator (host/path/protocol not allowed).`)
    console.log(`   It will fail next/image even if it downloads.`)
    console.log(`\n⚠️  Do NOT use this URL!`)
    return false
  }
  console.log(`✅ Allowed by the image-URL policy.`)

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; Multiverse Archive/1.0)',
    }
    let response = await fetch(url, { method: 'HEAD', headers, signal: AbortSignal.timeout(10000) })

    // Some hosts answer HEAD with 405/403 but serve GET fine: retry with a range.
    if (!response.ok && (response.status === 405 || response.status === 403)) {
      response = await fetch(url, {
        method: 'GET',
        headers: { ...headers, Range: 'bytes=0-0' },
        signal: AbortSignal.timeout(10000),
      })
    }

    if (response.ok) {
      const contentType = response.headers.get('content-type')
      const contentLength = response.headers.get('content-length')

      console.log(`✅ Image URL is VALID!`)
      console.log(`📄 Content Type: ${contentType ?? 'unknown'}`)
      console.log(
        `📦 Size: ${contentLength ? `${(parseInt(contentLength, 10) / 1024).toFixed(2)} KB` : 'unknown'}`,
      )
      console.log(`\n✨ Safe to use!`)
      return true
    } else {
      console.log(`❌ Image URL FAILED!`)
      console.log(`Status: ${response.status} ${response.statusText}`)
      console.log(`\n⚠️  Do NOT use this URL!`)
      return false
    }
  } catch (error) {
    console.log(`❌ Error testing URL: ${error.message}`)
    console.log(`\n⚠️  Do NOT use this URL!`)
    return false
  }
}

// Get URL from command line argument
const testUrl = process.argv[2]

if (!testUrl) {
  console.log(`
📖 Usage:
   node scripts/test-image-url.js "https://image-url.jpg"

📝 Example:
   node scripts/test-image-url.js "https://image.tmdb.org/t/p/w500/abc123.jpg"

💡 Test your image URLs BEFORE adding heroes!
`)
  process.exit(1)
}

testImageURL(testUrl)
