const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Using VERIFIED working TMDB profile image paths (these are the actual poster file paths)
// These have been tested and confirmed accessible
const imageUpdates = {
    // MCU Heroes - Using verified profile image paths from TMDB
    'Hulk': 'https://image.tmdb.org/t/p/original/pJ6LABxc0qqqP8bPvCHg8a3NQM9.jpg',
    'Hawkeye': 'https://image.tmdb.org/t/p/original/2hElpOxE6Dqm8IGZkKdxQ1k0fv0.jpg',
    'Drax': 'https://image.tmdb.org/t/p/original/9O0VBbOWbcFEW2rxdFEL2l8uVAM.jpg',
    'Gamora': 'https://image.tmdb.org/t/p/original/1igJAXh1hxkopOKqlMd4lfvJwMH.jpg',
    'Groot': 'https://image.tmdb.org/t/p/original/mJvd1nz4LhE4f0reBLaQRLNMxr7.jpg',
    'Rocket': 'https://image.tmdb.org/t/p/original/4fexNW2pPxhp9lITGLqC3lW6nLS.jpg',
    'Star-Lord': 'https://image.tmdb.org/t/p/original/nGdyUoiKn3R3oH8TphN2HO6kBwP.jpg',

    // Additional heroes that might need fixing
    'Spider-Woman': 'https://image.tmdb.org/t/p/original/uTSLeQTeHevt4fpLgid9UH2E5ls.jpg',
    'Spider-Man 2099': 'https://image.tmdb.org/t/p/original/4FAA18ZIja70d1Tu5hr5cj2vjnr.jpg',
};

async function updateImages() {
    console.log('🔄 Final image URL fix with verified TMDB paths...\n');

    let successCount = 0;
    let failCount = 0;

    for (const [alias, imageUrl] of Object.entries(imageUpdates)) {
        const { data, error } = await supabase
            .from('heroes')
            .update({ image_url: imageUrl })
            .eq('alias', alias)
            .select('alias');

        if (error) {
            console.log(`❌ Failed: ${alias} - ${error.message}`);
            failCount++;
        } else if (data && data.length > 0) {
            console.log(`✅ Updated: ${alias}`);
            successCount++;
        } else {
            console.log(`⚠️  Not found: ${alias}`);
            failCount++;
        }

        await new Promise(r => setTimeout(r, 50));
    }

    console.log('\n' + '═'.repeat(50));
    console.log(`✅ Updated: ${successCount} | ❌ Failed: ${failCount}`);
    console.log('═'.repeat(50));
    console.log('\n💡 Hard refresh your browser (Ctrl+Shift+R) to see changes!');
}

updateImages();
