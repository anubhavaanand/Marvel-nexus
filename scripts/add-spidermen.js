const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const spidermen = [
    {
        alias: 'Spider-Man (Tobey)',
        name: 'Peter Parker',
        franchise: 'Spider-Verse',
        origin_world: 'Earth-96283',
        image_url: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/9/90/Spider-Man_No_Way_Home_profile_Tobey_Maguire.jpg/revision/latest?cb=20211222020212', // Verified Character Profile
        powers: ['Organic Webbing', 'Super Strength', 'Spider-Sense'],
        weaknesses: ['Back Pain', 'Mary Jane'],
        is_locked_content: false
    },
    {
        alias: 'Spider-Man (Andrew)',
        name: 'Peter Parker',
        franchise: 'Spider-Verse',
        origin_world: 'Earth-120703',
        image_url: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/5/52/Spider-Man_No_Way_Home_profile_Andrew_Garfield.jpg/revision/latest?cb=20211221195655', // Verified Character Profile
        powers: ['Agility', 'Web Shooters', 'Scientific Genius'],
        weaknesses: ['Guilt (Gwen Stacy)', 'Rage'],
        is_locked_content: false
    }
];

async function addSpidermen() {
    console.log("🕷️  Adding The Spider-Men...");

    for (const hero of spidermen) {
        // Delete if exists to avoid dupes
        await supabase.from('heroes').delete().eq('alias', hero.alias);

        const { error } = await supabase.from('heroes').insert(hero);
        if (error) console.error(`❌ Failed: ${hero.alias}`);
        else console.log(`✅ ${hero.alias}`);
    }

    console.log("🕸️  Spider-Verse Expanded!");
}

addSpidermen();
