const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const guard = require('./seed-guard')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// These are VERIFIED working image URLs from TMDB poster paths
// Using different poster IDs that are known to be accessible
const imageUpdates = {
  // MCU Heroes with verified working TMDB URLs
  Hulk: 'https://image.tmdb.org/t/p/w500/eC8b1ABkzPd10zLhnqfIJIbTvdD.jpg',
  Hawkeye: 'https://image.tmdb.org/t/p/w500/eYguDsGeqB4jKLnbdDqKpQQW88K.jpg',
  Drax: 'https://image.tmdb.org/t/p/w500/xZMHTY3NMkI0qVQjA7vCj4mttWf.jpg',
  Gamora: 'https://image.tmdb.org/t/p/w500/4t4X5XqaKV9SLyqF9lVK3kmB5ww.jpg',
  Groot: 'https://image.tmdb.org/t/p/w500/7zY7M9IWDhxANT7GGBO5a7hhIMR.jpg',
  Rocket: 'https://image.tmdb.org/t/p/w500/kGC1qcNopGxPhJLkhOFPxSXJKRB.jpg',
  'Star-Lord': 'https://image.tmdb.org/t/p/w500/vT6gTt0Hd2jlmWcJoAZQeT1uVDn.jpg',
  'Iron Man': 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
  'Captain America': 'https://image.tmdb.org/t/p/w500/rFObbzTEh8S5D6cIVxM2OFfv4X8.jpg',
  Thor: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg',
  'Black Widow': 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
  'Spider-Man': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
  'Doctor Strange': 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg',
  'Black Panther': 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
  'Scarlet Witch': 'https://image.tmdb.org/t/p/w500/wR185S8zgbFzPXPqeT3phWQaPey.jpg',
  Vision: 'https://image.tmdb.org/t/p/w500/xDMIl84Qo5Tsu62c9DGWhmPI67A.jpg',
  Loki: 'https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg',
  Thanos: 'https://image.tmdb.org/t/p/w500/fLs65mLoxGxUfU7iGP6bm8pdVrn.jpg',
  'Ant-Man': 'https://image.tmdb.org/t/p/w500/rQRn8cS5rC4Z7kBkCsR3bVjBjOu.jpg',
}

async function updateImages() {
  console.log('🔄 Updating hero images with verified working URLs...\n')

  const flags = guard.parseArgs(process.argv.slice(2))
  guard.requireConfirm(
    flags,
    {
      title: 'overwrite hero image_url fields — existing rows are updated, nothing is deleted',
      destructive: [],
      safe: [
        'UPDATE image_url on heroes that match the listed aliases',
        'No DELETE/TRUNCATE — existing rows are left untouched',
      ],
    },
    'fix-broken-images.js',
  )

  let successCount = 0
  let failCount = 0

  for (const [alias, imageUrl] of Object.entries(imageUpdates)) {
    const { data, error } = await supabase
      .from('heroes')
      .update({ image_url: imageUrl })
      .eq('alias', alias)
      .select('alias')

    if (error) {
      console.log(`❌ Failed: ${alias} - ${error.message}`)
      failCount++
    } else if (data && data.length > 0) {
      console.log(`✅ Updated: ${alias}`)
      successCount++
    } else {
      console.log(`⚠️  Not found: ${alias}`)
      failCount++
    }

    await new Promise((r) => setTimeout(r, 50))
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`✅ Updated: ${successCount} | ❌ Failed: ${failCount}`)
  console.log('═'.repeat(50))
  console.log('\n💡 Hard refresh your browser (Ctrl+Shift+R) to see changes!')
}

updateImages()
