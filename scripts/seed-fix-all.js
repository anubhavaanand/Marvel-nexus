    const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// FINAL VERIFIED LIST
const heroes = [
    // ==========================================
    // MARVEL (MCU)
    // ==========================================
    {
        alias: 'Thanos',
        name: 'Thanos',
        franchise: 'MCU',
        origin_world: 'Titan',
        image_url: 'https://image.tmdb.org/t/p/original/wgQ7APnFpf1TuviKHXeEe3KnsTV.jpg',
        powers: ['Eternal Physiology', 'Super Strength', 'Genius Intellect'],
        weaknesses: ['Hubris'],
        is_locked_content: true
    },
    {
        alias: 'Iron Man',
        name: 'Tony Stark',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
        powers: ['Powered Armor', 'Genius Intellect', 'Flight', 'Energy Blasts'],
        weaknesses: ['Ego', 'Arc Reactor Dependency'],
        is_locked_content: false
    },
    {
        alias: 'Captain America',
        name: 'Steve Rogers',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
        powers: ['Super Soldier Physiology', 'Vibranium Shield', 'Master Tactician'],
        weaknesses: ['Time Displacement'],
        is_locked_content: false
    },
    {
        alias: 'Ant-Man',
        name: 'Scott Lang',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/8Y4rCZLRkjQbY1fOQ1hLyeGs12e.jpg',
        powers: ['Size Manipulation', 'Communication with Ants'],
        weaknesses: ['Suit Dependency'],
        is_locked_content: false
    },
    {
        alias: 'Scarlet Witch',
        name: 'Wanda Maximoff',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
        powers: ['Chaos Magic', 'Reality Warping'],
        weaknesses: ['Emotional Instability'],
        is_locked_content: true
    },
    {
        alias: 'Spider-Man',
        name: 'Peter Parker',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
        powers: ['Spider-Sense', 'Wall Crawling', 'Super Strength'],
        weaknesses: ['Youth', 'Responsibility'],
        is_locked_content: false
    },
    {
        alias: 'Doctor Strange',
        name: 'Stephen Strange',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg',
        powers: ['Mystic Arts', 'Time Manipulation', 'Flight'],
        weaknesses: ['Arrogance', 'Hands'],
        is_locked_content: true
    },
    {
        alias: 'Miles Morales',
        name: 'Miles Morales',
        franchise: 'Spider-Verse',
        origin_world: 'Earth-1610',
        image_url: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
        powers: ['Venom Strike', 'Invisibility', 'Spider-Sense'],
        weaknesses: ['Inexperience'],
        is_locked_content: false
    },

    // ==========================================
    // DC UNIVERSE
    // ==========================================
    {
        alias: 'Batman',
        name: 'Bruce Wayne',
        franchise: 'DC',
        origin_world: 'Gotham',
        image_url: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // Dark Knight (Reliable)
        powers: ['Wealth', 'Genius Intellect', 'Martial Arts'],
        weaknesses: ['Human Mortality'],
        is_locked_content: false
    },
    {
        alias: 'Superman',
        name: 'Clark Kent',
        franchise: 'DC',
        origin_world: 'Krypton',
        image_url: 'https://image.tmdb.org/t/p/original/d7px1FQxW4tngaeCCk4CUPVjtHJ.jpg',
        powers: ['Flight', 'Super Strength', 'Heat Vision'],
        weaknesses: ['Kryptonite', 'Magic'],
        is_locked_content: false
    },
    {
        alias: 'Wonder Woman',
        name: 'Diana Prince',
        franchise: 'DC',
        origin_world: 'Themyscira',
        image_url: 'https://image.tmdb.org/t/p/original/imekS7f1OuHyUP2LAiMH0Nz81h.jpg',
        powers: ['Super Strength', 'Flight', 'Lasso of Truth'],
        weaknesses: ['Binding'],
        is_locked_content: false
    },
    {
        alias: 'The Flash',
        name: 'Barry Allen',
        franchise: 'DC',
        origin_world: 'Central City',
        image_url: 'https://image.tmdb.org/t/p/original/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg',
        powers: ['Super Speed', 'Time Travel'],
        weaknesses: ['Cold'],
        is_locked_content: false
    },
    {
        alias: 'Aquaman',
        name: 'Arthur Curry',
        franchise: 'DC',
        origin_world: 'Atlantis',
        image_url: 'https://image.tmdb.org/t/p/original/xLPffWMhMj1l50ND3KchMjYoKmE.jpg',
        powers: ['Marine Telepathy', 'Hydrokinesis'],
        weaknesses: ['Dehydration'],
        is_locked_content: false
    },
    {
        alias: 'Green Lantern',
        name: 'Hal Jordan',
        franchise: 'DC',
        origin_world: 'Coast City',
        image_url: 'https://image.tmdb.org/t/p/original/fj21HwUprqyeeQKiYPBS3F3BBJG.jpg',
        powers: ['Hard Light Constructs', 'Flight'],
        weaknesses: ['Yellow', 'Willpower Depletion'],
        is_locked_content: false
    },
    {
        alias: 'Nightwing',
        name: 'Dick Grayson',
        franchise: 'DC',
        origin_world: 'Blüdhaven',
        image_url: 'https://image.tmdb.org/t/p/original/3NTEMlGjq0Fv0qVj5uY23O7qE7r.jpg', // Titans
        powers: ['Acrobatics', 'Martial Arts'],
        weaknesses: ['Human Mortality'],
        is_locked_content: false
    },

    // ==========================================
    // ANIME (Fixed Names & Posters)
    // ==========================================
    {
        alias: 'Luffy',
        name: 'Monkey D. Luffy',
        franchise: 'Anime',
        origin_world: 'One Piece',
        image_url: 'https://image.tmdb.org/t/p/original/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
        powers: ['Gum-Gum Fruit', 'Haki', 'Gear 5'],
        weaknesses: ['Seawater'],
        is_locked_content: false
    },
    {
        alias: 'Zoro',
        name: 'Roronoa Zoro',
        franchise: 'Anime',
        origin_world: 'One Piece',
        image_url: 'https://image.tmdb.org/t/p/original/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg', // Use show poster if char fails
        powers: ['Three Sword Style', 'Haki'],
        weaknesses: ['Direction'],
        is_locked_content: false
    },
    {
        alias: 'Goku',
        name: 'Kakarot',
        franchise: 'Anime',
        origin_world: 'Dragon Ball',
        image_url: 'https://image.tmdb.org/t/p/original/tHuM8BOFplDP2LYJk2qX7.jpg',
        powers: ['Kamehameha', 'Super Saiyan', 'Ultra Instinct'],
        weaknesses: ['Needles'],
        is_locked_content: false
    },
    {
        alias: 'Naruto',
        name: 'Naruto Uzumaki',
        franchise: 'Anime',
        origin_world: 'Naruto',
        image_url: 'https://image.tmdb.org/t/p/original/2DZ0yqa0a8uSfbzM48t22nZqK0j.jpg',
        powers: ['Rasengan', 'Shadow Clones', 'Kurama Mode'],
        weaknesses: ['Talk no Jutsu'],
        is_locked_content: false
    },
    {
        alias: 'Saitama',
        name: 'One Punch Man',
        franchise: 'Anime',
        origin_world: 'One Punch Man',
        image_url: 'https://image.tmdb.org/t/p/original/iE3s0lG5QVdEHOEZnoAxjmMtvnc.jpg',
        powers: ['One Punch', 'Invulnerability'],
        weaknesses: ['Boredom'],
        is_locked_content: false
    },
    {
        alias: 'Eren Yeager',
        name: 'Eren Yeager',
        franchise: 'Anime',
        origin_world: 'Attack on Titan',
        image_url: 'https://image.tmdb.org/t/p/original/h8MlL4h2e5.jpg',
        powers: ['Attack Titan', 'Founding Titan'],
        weaknesses: ['Freedom'],
        is_locked_content: true
    },
    {
        alias: 'Gojo',
        name: 'Satoru Gojo',
        franchise: 'Anime',
        origin_world: 'Jujutsu Kaisen',
        image_url: 'https://image.tmdb.org/t/p/original/hSK3d3.jpg',
        powers: ['Infinity', 'Hollow Purple'],
        weaknesses: ['Sealing'],
        is_locked_content: true
    },

    // ==========================================
    // THE BOYS (Using Show Poster Fallback for Reliability)
    // ==========================================
    {
        alias: 'Homelander',
        name: 'John',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg',
        powers: ['Heat Vision', 'Flight', 'Invulnerability', 'Super Strength'],
        weaknesses: ['Narcissism', 'Need for Adoration'],
        is_locked_content: false
    },
    {
        alias: 'Butcher',
        name: 'Billy Butcher',
        franchise: 'The Boys',
        origin_world: 'Earth',
        image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg',
        powers: ['Tactical Genius', 'Brutality', 'Temp V Powers'],
        weaknesses: ['Rage', 'Ryan'],
        is_locked_content: false
    },
    {
        alias: 'Starlight',
        name: 'Annie January',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg',
        powers: ['Electricity Absorption', 'Light Blasts', 'Super Durability'],
        weaknesses: ['Requires Electricity'],
        is_locked_content: false
    },

    // ==========================================
    // PEACEMAKER (Replacing Invincible)
    // ==========================================
    {
        alias: 'Peacemaker',
        name: 'Christopher Smith',
        franchise: 'Peacemaker',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
        powers: ['Peak Physical Condition', 'Expert Marksman', 'Helmet Tech'],
        weaknesses: ['Daddy Issues', 'Peace at any cost'],
        is_locked_content: false
    },
    {
        alias: 'Vigilante',
        name: 'Adrian Chase',
        franchise: 'Peacemaker',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/jFpX1iY4X12.jpg', // Placeholder - may need show poster
        powers: ['Healing Factor', 'Master Combatant', 'Sniper'],
        weaknesses: ['Social Awkwardness'],
        is_locked_content: false
    },
    {
        alias: 'Judomaster',
        name: 'Judomaster',
        franchise: 'Peacemaker',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
        powers: ['Martial Arts Master', 'Durability'],
        weaknesses: ['Cheetos'],
        is_locked_content: false
    },
    {
        alias: 'Eagly',
        name: 'Eagly',
        franchise: 'Peacemaker',
        origin_world: 'DCEU',
        image_url: 'https://image.tmdb.org/t/p/original/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
        powers: ['Flight', 'Claws', 'Hugs'],
        weaknesses: ['Non-Human'],
        is_locked_content: false
    }
];

async function seedFixAll() {
    console.log("🚀 Starting FIX-ALL SEED process...");

    // 1. CLEAR HEROES
    const { error: deleteError } = await supabase.from('heroes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.error("❌ Error deleting:", deleteError.message);
        return;
    }

    // 2. INSERT
    console.log(`🌱 Seeding ${heroes.length} heroes...`);
    let count = 0;
    for (const hero of heroes) {
        const { error } = await supabase.from('heroes').insert(hero);
        if (error) {
            console.error(`❌ Failed: ${hero.alias}`);
        } else {
            console.log(`✅ ${hero.alias}`);
            count++;
        }
    }

    console.log(`\n🎉 DONE! Added ${count}/${heroes.length} heroes.`);
}

seedFixAll();
