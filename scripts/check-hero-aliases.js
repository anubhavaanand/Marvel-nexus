const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAliases() {
    console.log('🔍 Fetching all hero aliases from database...\n');

    const { data, error } = await supabase
        .from('heroes')
        .select('id, alias, name, franchise, image_url')
        .order('alias');

    if (error) {
        console.error('❌ Error fetching heroes:', error.message);
        return;
    }

    console.log(`Found ${data.length} heroes in the database:\n`);

    // Group by franchise
    const byFranchise = {};
    data.forEach(hero => {
        if (!byFranchise[hero.franchise]) {
            byFranchise[hero.franchise] = [];
        }
        byFranchise[hero.franchise].push(hero);
    });

    // Display by franchise
    Object.keys(byFranchise).sort().forEach(franchise => {
        console.log(`\n📁 ${franchise}:`);
        console.log('='.repeat(60));
        byFranchise[franchise].forEach(hero => {
            const imageStatus = hero.image_url ?
                (hero.image_url.includes('wikia') || hero.image_url.includes('vignette') ? '⚠️  (Wikia)' : '✅') :
                '❌ (No Image)';
            console.log(`  ${imageStatus} "${hero.alias}" - ${hero.name}`);
        });
    });

    console.log('\n\n' + '='.repeat(60));
    console.log(`Total: ${data.length} heroes`);
    console.log('='.repeat(60));

    // Check for broken image URLs
    console.log('\n🔍 Checking for potentially broken images...\n');
    const brokenImages = data.filter(h =>
        h.image_url && (h.image_url.includes('wikia') || h.image_url.includes('vignette'))
    );

    if (brokenImages.length > 0) {
        console.log(`Found ${brokenImages.length} heroes with potentially broken Wikia URLs:\n`);
        brokenImages.forEach(hero => {
            console.log(`  - "${hero.alias}" (${hero.name})`);
            console.log(`    URL: ${hero.image_url}\n`);
        });
    }
}

checkAliases();
