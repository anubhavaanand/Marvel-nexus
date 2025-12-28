const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkImages() {
    const { data: heroes, error } = await supabase
        .from('heroes')
        .select('id, name, alias, franchise, image_url')
        .order('alias');

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Heroes with potentially missing images:\n');
    heroes.forEach(hero => {
        if (!hero.image_url || hero.image_url.includes('placeholder')) {
            console.log(`- ${hero.alias} (${hero.name}) - ${hero.franchise}`);
            console.log(`  Current URL: ${hero.image_url || 'NULL'}\n`);
        }
    });

    console.log(`\nTotal heroes: ${heroes.length}`);
    console.log(`Heroes with missing images: ${heroes.filter(h => !h.image_url || h.image_url.includes('placeholder')).length}`);
}

checkImages();
