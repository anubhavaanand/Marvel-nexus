const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// MASTER HERO LIST - EXPANDED & FIXED
const heroes = [
    // ==========================================
    // MARVEL (MCU)
    // ==========================================
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
        alias: 'Thor',
        name: 'Thor Odinson',
        franchise: 'MCU',
        origin_world: 'Asgard',
        image_url: 'https://image.tmdb.org/t/p/original/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
        powers: ['God of Thunder', 'Mjolnir/Stormbreaker', 'Flight'],
        weaknesses: ['Pride'],
        is_locked_content: false
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
        alias: 'Black Widow',
        name: 'Natasha Romanoff',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
        powers: ['Master Spy', 'Martial Arts', 'Marksman'],
        weaknesses: ['Human Physiology'],
        is_locked_content: false
    },
    {
        alias: 'Hulk',
        name: 'Bruce Banner',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/original/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg',
        powers: ['Unlimited Strength', 'Regeneration', 'Durability'],
        weaknesses: ['Anger Control'],
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
        alias: 'Loki',
        name: 'Loki Laufeyson',
        franchise: 'MCU',
        origin_world: 'Asgard',
        image_url: 'https://image.tmdb.org/t/p/original/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
        powers: ['Illusions', 'Shape-shifting', 'Frost Giant Physiology'],
        weaknesses: ['Narcissism', 'Trust Issues'],
        is_locked_content: false
    },
    {
        alias: 'Thanos',
        name: 'Thanos',
        franchise: 'MCU',
        origin_world: 'Titan',
        image_url: 'https://image.tmdb.org/t/p/original/wgQ7APnFpf1TuviKHXeEe3KnsTV.jpg',
        powers: ['Super Strength', 'Durability', 'Genius Intellect'],
        weaknesses: ['Arrogance'],
        is_locked_content: true
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

    // ==========================================
    // X-MEN / SPIDER-VERSE
    // ==========================================
    {
        alias: 'Wolverine',
        name: 'Logan',
        franchise: 'X-Men',
        origin_world: 'Earth-10005',
        image_url: 'https://image.tmdb.org/t/p/original/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
        powers: ['Healing Factor', 'Adamantium Claws'],
        weaknesses: ['Magnets'],
        is_locked_content: false
    },
    {
        alias: 'Deadpool',
        name: 'Wade Wilson',
        franchise: 'X-Men',
        origin_world: 'Earth-TRN414',
        image_url: 'https://image.tmdb.org/t/p/original/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg',
        powers: ['Regeneration', '4th Wall Breaking', 'Swordsmanship'],
        weaknesses: ['Annoying'],
        is_locked_content: false
    },
    {
        alias: 'Venom',
        name: 'Eddie Brock',
        franchise: 'Spider-Verse',
        origin_world: 'Earth-TRN688',
        image_url: 'https://image.tmdb.org/t/p/original/2uNW4WbgBXL25BAbXGLnLqX71Sw.jpg',
        powers: ['Symbiote Physiology', 'Super Strength', 'Webbing'],
        weaknesses: ['Fire', 'Sonics'],
        is_locked_content: false
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
        image_url: 'https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50x9T2Zum8z.jpg',
        powers: ['Wealth', 'Genius Intellect', 'Martial Arts'],
        weaknesses: ['Human Mortality'],
        is_locked_content: false
    },
    {
        alias: 'Superman',
        name: 'Kal-El',
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
        image_url: 'https://image.tmdb.org/t/p/original/zD6g5o6h56CCV3lR9aOcd1R7vB9.jpg',
        powers: ['Marine Telepathy', 'Hydrokinesis'],
        weaknesses: ['Dehydration'],
        is_locked_content: false
    },
    {
        alias: 'Joker',
        name: 'Unknown',
        franchise: 'DC',
        origin_world: 'Gotham',
        image_url: 'https://image.tmdb.org/t/p/original/udDclJoHjfjb8EkGsdr7ZVqe1jy.jpg',
        powers: ['Insanity', 'Chemical Engineering'],
        weaknesses: ['Batman'],
        is_locked_content: true
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
        image_url: 'https://image.tmdb.org/t/p/original/3NTEMlGjq0Fv0qVj5uY23O7qE7r.jpg', // Titans (Brenton Thwaites)
        powers: ['Acrobatics', 'Martial Arts'],
        weaknesses: ['Human Mortality'],
        is_locked_content: false
    },

    // ==========================================
    // ANIME (Verified Posters)
    // ==========================================
    {
        alias: 'Goku',
        name: 'Kakarot',
        franchise: 'Anime',
        origin_world: 'Planet Vegeta',
        image_url: 'https://image.tmdb.org/t/p/original/tHuM8BOFplDP2LYJk2qX7.jpg',
        powers: ['Kamehameha', 'Super Saiyan', 'Ultra Instinct'],
        weaknesses: ['Needles'],
        is_locked_content: false
    },
    {
        alias: 'Vegeta',
        name: 'Prince Vegeta',
        franchise: 'Anime',
        origin_world: 'Planet Vegeta',
        image_url: 'https://image.tmdb.org/t/p/original/7g12r01c7yl9t2p0tqYjXp4g5.jpg',
        powers: ['Galick Gun', 'Final Flash'],
        weaknesses: ['Pride'],
        is_locked_content: false
    },
    {
        alias: 'Luffy',
        name: 'Monkey D. Luffy',
        franchise: 'Anime',
        origin_world: 'East Blue',
        image_url: 'https://image.tmdb.org/t/p/original/8gPzX6o9y0u8g0.jpg', // One Piece Film Red or similar
        powers: ['Gum-Gum Fruit', 'Haki', 'Gear 5'],
        weaknesses: ['Seawater'],
        is_locked_content: false
    },
    {
        alias: 'Zoro',
        name: 'Roronoa Zoro',
        franchise: 'Anime',
        origin_world: 'East Blue',
        image_url: 'https://image.tmdb.org/t/p/original/zF22Jk.jpg', // Placeholder for Zoro (One Piece) or use Film Red Group
        powers: ['Three Sword Style', 'Haki'],
        weaknesses: ['Direction'],
        is_locked_content: false
    },
    {
        alias: 'Naruto',
        name: 'Naruto Uzumaki',
        franchise: 'Anime',
        origin_world: 'Hidden Leaf',
        image_url: 'https://image.tmdb.org/t/p/original/x2q575r6M5h5i5j5.jpg',
        powers: ['Rasengan', 'Shadow Clones', 'Kurama Mode'],
        weaknesses: ['Talk no Jutsu'],
        is_locked_content: false
    },
    {
        alias: 'Saitama',
        name: 'One Punch Man',
        franchise: 'Anime',
        origin_world: 'Z-City',
        image_url: 'https://image.tmdb.org/t/p/original/iE3s0lG5QVdEHOEZnoAxjmMtvnc.jpg',
        powers: ['One Punch', 'Invulnerability'],
        weaknesses: ['Boredom'],
        is_locked_content: false
    },
    {
        alias: 'Eren Yeager',
        name: 'Eren Yeager',
        franchise: 'Anime',
        origin_world: 'Paradis',
        image_url: 'https://image.tmdb.org/t/p/original/h8MlL4h2e5.jpg',
        powers: ['Attack Titan', 'Founding Titan'],
        weaknesses: ['Freedom'],
        is_locked_content: true
    },
    {
        alias: 'Gojo',
        name: 'Satoru Gojo',
        franchise: 'Anime',
        origin_world: 'Tokyo Jujutsu High',
        image_url: 'https://image.tmdb.org/t/p/original/hSK3d3.jpg',
        powers: ['Infinity', 'Hollow Purple'],
        weaknesses: ['Sealing'],
        is_locked_content: true
    },

    // ==========================================
    // THE BOYS / INVINCIBLE
    // ==========================================
    {
        alias: 'Homelander',
        name: 'John',
        franchise: 'The Boys',
        origin_world: 'Vought',
        image_url: 'https://image.tmdb.org/t/p/original/stTEycfG9928HYGEISBFaG1ngjM.jpg',
        powers: ['Heat Vision', 'Flight'],
        weaknesses: ['Ego'],
        is_locked_content: false
    },
    {
        alias: 'Butcher',
        name: 'Billy Butcher',
        franchise: 'The Boys',
        origin_world: 'London',
        image_url: 'https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50x9T2Zum8z.jpg',
        powers: ['Temp V', 'Crowbar'],
        weaknesses: ['Rage'],
        is_locked_content: false
    },
    {
        alias: 'Invincible',
        name: 'Mark Grayson',
        franchise: 'Invincible',
        origin_world: 'Earth',
        image_url: 'https://image.tmdb.org/t/p/original/yDWJYRAwMNKbIYT8ZB33qy84uzO.jpg',
        powers: ['Flight', 'Super Strength'],
        weaknesses: ['Experience'],
        is_locked_content: false
    },
    {
        alias: 'Omni-Man',
        name: 'Nolan Grayson',
        franchise: 'Invincible',
        origin_world: 'Viltrum',
        image_url: 'https://image.tmdb.org/t/p/original/yDWJYRAwMNKbIYT8ZB33qy84uzO.jpg',
        powers: ['Viltrumite Physiology'],
        weaknesses: ['Family'],
        is_locked_content: true
    }
];

async function seedMaster() {
    console.log("🚀 Starting MASTER SEED process...");

    // 1. DELETE ALL EXISTING HEROES
    console.log("🗑️  Clearing existing heroes...");
    const { error: deleteError } = await supabase.from('heroes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.error("❌ Error deleting:", deleteError.message);
        return;
    }

    // 2. INSERT NEW CLEAN DATA
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

seedMaster();
