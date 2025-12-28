const { createClient } = require('@supabase/supabase-js');
const https = require('https');
const http = require('http');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Function to check if URL is accessible
function checkUrl(url) {
    return new Promise((resolve) => {
        if (!url) {
            resolve(false);
            return;
        }

        const protocol = url.startsWith('https') ? https : http;
        const request = protocol.get(url, (res) => {
            resolve(res.statusCode === 200);
        });

        request.on('error', () => {
            resolve(false);
        });

        request.setTimeout(5000, () => {
            request.destroy();
            resolve(false);
        });
    });
}

async function findBrokenImages() {
    console.log('Checking all hero images...\n');

    const { data: heroes, error } = await supabase
        .from('heroes')
        .select('id, name, alias, franchise, image_url')
        .order('alias');

    if (error) {
        console.error('Error:', error);
        return;
    }

    const brokenImages = [];

    for (const hero of heroes) {
        const isAccessible = await checkUrl(hero.image_url);
        if (!isAccessible) {
            brokenImages.push(hero);
            console.log(`❌ ${hero.alias} (${hero.name}) - ${hero.franchise}`);
            console.log(`   URL: ${hero.image_url}\n`);
        } else {
            console.log(`✅ ${hero.alias}`);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`Total heroes: ${heroes.length}`);
    console.log(`Working images: ${heroes.length - brokenImages.length}`);
    console.log(`Broken images: ${brokenImages.length}`);
    console.log(`${'='.repeat(60)}\n`);

    if (brokenImages.length > 0) {
        console.log('Heroes with broken images:');
        brokenImages.forEach(h => {
            console.log(`  - ${h.alias} (${h.franchise})`);
        });
    }
}

findBrokenImages();
