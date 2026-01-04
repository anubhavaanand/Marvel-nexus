const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use service role key for admin-level access
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Using ACTUAL aliases from database (checked with check-hero-aliases.js)
// These are the only 2 heroes with broken Wikia URLs
const imageUpdates = {
    // Spider-Verse - Fix the 2 broken Wikia URLs
    'Spider-Man (Andrew)': 'https://image.tmdb.org/t/p/original/tk58WPe3nSjeB7K7RmAZFW2Oq7n.jpg',
    'Spider-Man (Tobey)': 'https://image.tmdb.org/t/p/original/tkc7AVvURPk1PdW6MpRhdOqV4EB.jpg',
};

async function updateImages() {
    console.log('🔄 Fixing Spider-Man image URLs...\n');
    console.log('Using verified TMDB sources for Andrew and Tobey variants\n');

    let successCount = 0;
    let failCount = 0;

    for (const [alias, imageUrl] of Object.entries(imageUpdates)) {
        try {
            const { data, error } = await supabase
                .from('heroes')
                .update({ image_url: imageUrl })
                .eq('alias', alias)
                .select();

            if (error) {
                console.log(`❌ Failed to update ${alias}: ${error.message}`);
                failCount++;
            } else if (data && data.length > 0) {
                console.log(`✅ Updated "${data[0].alias}" - ${data[0].name}`);
                console.log(`   New URL: ${imageUrl}\n`);
                successCount++;
            } else {
                console.log(`⚠️  Hero not found in database: ${alias}`);
                failCount++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
            console.log(`❌ Error updating ${alias}: ${err.message}`);
            failCount++;
        }
    }

    console.log('═'.repeat(60));
    console.log(`✅ Successfully updated: ${successCount} heroes`);
    console.log(`❌ Failed/Not found: ${failCount}`);
    console.log('═'.repeat(60));
    console.log('\n💡 Refresh your browser to see the updated images!');

    if (successCount > 0) {
        console.log('\n🎉 All hero images are now using reliable sources!');
    } else {
        console.log('\n⚠️  Note: Images may already be correct or aliases may not match.');
        console.log('    Run: node scripts/check-hero-aliases.js to verify');
    }
}

updateImages();
