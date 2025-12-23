const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// PEACEMAKER SQUAD (Tagged as DC to bypass DB constraint)
const squad = [
    {
        alias: 'Peacemaker',
        name: 'Christopher Smith',
        franchise: 'DC',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg', // TMDB Poster
        powers: ['Peak Conditioning', 'Armor', 'Peace at all costs'],
        weaknesses: ['Dad'],
        is_locked_content: false
    },
    {
        alias: 'Vigilante',
        name: 'Adrian Chase',
        franchise: 'DC',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/jFpX1iY4X12.jpg', // TMDB
        powers: ['Healing Factor', 'Marskman'],
        weaknesses: ['Social Skills'],
        is_locked_content: false
    },
    {
        alias: 'Judomaster',
        name: 'Judomaster',
        franchise: 'DC',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
        powers: ['Judo', 'Agility'],
        weaknesses: ['Height'],
        is_locked_content: false
    },
    {
        alias: 'Eagly',
        name: 'Eagly',
        franchise: 'DC',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
        powers: ['Flight', 'Claws', 'Hugs'],
        weaknesses: ['Bird'],
        is_locked_content: false
    }
];

async function forcePeacemaker() {
    console.log("🕊️  Forcing Peacemaker Squad (As DC)...");

    for (const hero of squad) {
        await supabase.from('heroes').delete().eq('alias', hero.alias);
        const { error } = await supabase.from('heroes').insert(hero);
        if (error) console.error(`❌ Failed ${hero.alias}: ${error.message}`);
        else console.log(`✅ Added ${hero.alias}`);
    }
}

forcePeacemaker();
