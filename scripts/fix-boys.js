const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// THE BOYS - Using Show Poster (Most Reliable)
const boys = [
    {
        alias: 'Homelander',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg' // The Boys Show Poster
        }
    },
    {
        alias: 'Butcher',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        }
    },
    {
        alias: 'Starlight',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        }
    },
    {
        alias: 'Soldier Boy',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        }
    },
    {
        alias: 'A-Train',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        }
    },
    {
        alias: 'Queen Maeve',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        }
    },
    {
        alias: 'Black Noir',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        }
    },
    {
        alias: 'The Deep',
        updates: {
            image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg'
        }
    }
];

async function fixBoys() {
    console.log("💥 Fixing The Boys images...");

    for (const hero of boys) {
        const { error } = await supabase
            .from('heroes')
            .update(hero.updates)
            .eq('alias', hero.alias);

        if (error) {
            console.error(`❌ Failed ${hero.alias}: ${error.message}`);
        } else {
            console.log(`✅ Updated ${hero.alias}`);
        }
    }

    console.log("🦸 The Boys are back!");
}

fixBoys();
