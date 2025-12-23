const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// CHARACTER PORTRAITS (Not Movie Posters)
const heroes = [
    // ==========================================
    // THE BOYS (Character Focused)
    // ==========================================
    {
        alias: 'Homelander',
        name: 'John',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/d/d4/Homelander_S3_promotional_photo.jpg/revision/latest?cb=20220603184941', // Wiki Character Portrait
        powers: ['Heat Vision', 'Flight', 'Invulnerability', 'Super Strength'],
        weaknesses: ['Narcissism', 'Need for Adoration'],
        is_locked_content: false
    },
    {
        alias: 'Billy Butcher',
        name: 'William Butcher',
        franchise: 'The Boys',
        origin_world: 'Earth',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/3/36/Billy_Butcher_S3_promo.jpg/revision/latest?cb=20220603185348',
        powers: ['Tactical Genius', 'Brutality', 'Temp V Powers'],
        weaknesses: ['Rage', 'Ryan'],
        is_locked_content: false
    },
    {
        alias: 'Starlight',
        name: 'Annie January',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/c/c5/Starlight_S3_promo.jpg/revision/latest?cb=20220603185526',
        powers: ['Electricity Absorption', 'Light Blasts', 'Super Durability'],
        weaknesses: ['Requires Electricity'],
        is_locked_content: false
    },
    {
        alias: 'Soldier Boy',
        name: 'Ben',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/0/0c/Soldier_Boy_S3.jpg/revision/latest?cb=20220610141630',
        powers: ['Super Strength', 'Energy Blasts', 'Radiation Generation'],
        weaknesses: ['PTSD', 'Radioactivity'],
        is_locked_content: true
    },
    {
        alias: 'A-Train',
        name: 'Reggie Franklin',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/9/9d/A-Train_S3_promo.jpg/revision/latest?cb=20220603185635',
        powers: ['Super Speed', 'Accelerated Metabolism'],
        weaknesses: ['Heart Condition'],
        is_locked_content: false
    },
    {
        alias: 'Queen Maeve',
        name: 'Maggie Shaw',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/a/a3/Queen_Maeve_S3_promo.jpg/revision/latest?cb=20220603185442',
        powers: ['Super Strength', 'Durability', 'Combat Skill'],
        weaknesses: ['Burnout'],
        is_locked_content: false
    },
    {
        alias: 'Black Noir',
        name: 'Earving',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/7/76/Black_Noir_S3_promo.jpg/revision/latest?cb=20220603185734',
        powers: ['Stealth', 'Martial Arts', 'Regeneration'],
        weaknesses: ['Brain Damage', 'Almonds'],
        is_locked_content: false
    },
    {
        alias: 'The Deep',
        name: 'Kevin Moskowitz',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/4/4e/The_Deep_S3_promo.jpg/revision/latest?cb=20220603185824',
        powers: ['Telepathy with Marine Life', 'Gills'],
        weaknesses: ['Gills (Vulnerable)', 'Insecurity'],
        is_locked_content: false
    },
    {
        alias: 'Kimiko',
        name: 'Kimiko Miyashiro',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://static.wikia.nocookie.net/the-boys/images/4/44/Kimiko_S3_promo.jpg/revision/latest?cb=20220603190013',
        powers: ['Regeneration', 'Super Strength'],
        weaknesses: ['Past Trauma'],
        is_locked_content: false
    },

    // ==========================================
    // RE-ADDING KEY HEROES WITH BETTER PORTRAITS
    // ==========================================
    {
        alias: 'Iron Man',
        name: 'Tony Stark',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/3/35/IronMan-EndgameProfile.jpg/revision/latest?cb=20190423175213', // Wiki Portrait
        powers: ['Powered Armor', 'Genius Intellect', 'Flight', 'Energy Blasts'],
        weaknesses: ['Ego', 'Arc Reactor Dependency'],
        is_locked_content: false
    },
    {
        alias: 'Captain America',
        name: 'Steve Rogers',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://static.wikia.nocookie.net/marvelcinematicuniverse/images/d/d7/CapAmerica-EndgameProfile.jpg/revision/latest?cb=20190423175339',
        powers: ['Super Soldier Physiology', 'Vibranium Shield', 'Master Tactician'],
        weaknesses: ['Time Displacement'],
        is_locked_content: false
    },
    {
        alias: 'Deadpool',
        name: 'Wade Wilson',
        franchise: 'X-Men',
        origin_world: 'Earth-TRN414',
        image_url: 'https://static.wikia.nocookie.net/xmenmovies/images/e/eb/Deadpool_promo_DP2.png/revision/latest?cb=20180515224307', // Portrait
        powers: ['Regeneration', '4th Wall Breaking', 'Swordsmanship'],
        weaknesses: ['Annoying'],
        is_locked_content: false
    },
];

async function seedFinal() {
    console.log("🚀 Starting FINAL SEED process (Character Portraits)...");

    // 1. DELETE THESE SPECIFIC HEROES TO UPDATE THEM
    console.log("🗑️  Updating specific heroes...");

    for (const hero of heroes) {
        // Delete if exists to replace cleanly
        await supabase.from('heroes').delete().eq('alias', hero.alias);

        const { error } = await supabase.from('heroes').insert(hero);
        if (error) console.error(`❌ Failed: ${hero.alias}`);
        else console.log(`✅ Updated: ${hero.alias} (Portrait Mode)`);
    }

    console.log(`\n🎉 DONE! Updated The Boys + Key Heroes with Character Portraits.`);
}

seedFinal();
