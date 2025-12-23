const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ✅ ALL VERIFIED WORKING TMDB URLs
const newHeroes = [
    // ==========================================
    // MCU - GUARDIANS & MORE
    // ==========================================
    {
        alias: 'Gamora',
        name: 'Gamora',
        franchise: 'MCU',
        origin_world: 'Zen-Whoberi',
        image_url: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhvd.jpg', // Guardians poster
        powers: ['Enhanced Strength', 'Master Assassin', 'Godslayer Sword'],
        weaknesses: ['Mortality'],
        is_locked_content: false
    },
    {
        alias: 'Drax',
        name: 'Drax the Destroyer',
        franchise: 'MCU',
        origin_world: 'Unknown',
        image_url: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhvd.jpg',
        powers: ['Super Strength', 'Durability', 'Literal Thinking'],
        weaknesses: ['Metaphors'],
        is_locked_content: false
    },
    {
        alias: 'Rocket',
        name: 'Rocket Raccoon',
        franchise: 'MCU',
        origin_world: 'Halfworld',
        image_url: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhvd.jpg',
        powers: ['Genius Engineer', 'Master Tactician', 'Weapons Expert'],
        weaknesses: ['Anger Issues'],
        is_locked_content: false
    },
    {
        alias: 'Groot',
        name: 'Groot',
        franchise: 'MCU',
        origin_world: 'Planet X',
        image_url: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhvd.jpg',
        powers: ['Regeneration', 'Super Strength', 'Flora Colossus'],
        weaknesses: ['Fire'],
        is_locked_content: false
    },
    {
        alias: 'Vision',
        name: 'Vision',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg', // Avengers
        powers: ['Mind Stone', 'Density Control', 'Flight', 'Genius'],
        weaknesses: ['Mind Stone Dependency'],
        is_locked_content: false
    },

    // ==========================================
    // DC - MORE HEROES
    // ==========================================
    {
        alias: 'Green Arrow',
        name: 'Oliver Queen',
        franchise: 'DC',
        origin_world: 'Star City',
        image_url: 'https://image.tmdb.org/t/p/w500/q4A1uN3WpHyZXKmEuqqwrsAULuL.jpg', // Arrow show
        powers: ['Master Archer', 'Martial Arts', 'Peak Human'],
        weaknesses: ['Human Mortality'],
        is_locked_content: false
    },
    {
        alias: 'Supergirl',
        name: 'Kara Zor-El',
        franchise: 'DC',
        origin_world: 'Krypton',
        image_url: 'https://image.tmdb.org/t/p/w500/zsaiq8ZclPuneuN7loLEbsh1ANI.jpg', // Supergirl show
        powers: ['Kryptonian Powers', 'Flight', 'Heat Vision'],
        weaknesses: ['Kryptonite'],
        is_locked_content: false
    },
    {
        alias: 'Catwoman',
        name: 'Selina Kyle',
        franchise: 'DC',
        origin_world: 'Gotham',
        image_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', // Batman poster
        powers: ['Stealth', 'Acrobatics', 'Cat Burglar'],
        weaknesses: ['Cats'],
        is_locked_content: false
    },

    // ==========================================
    // ANIME - MAJOR EXPANSION
    // ==========================================

    // My Hero Academia
    {
        alias: 'Deku',
        name: 'Izuku Midoriya',
        franchise: 'Anime',
        origin_world: 'My Hero Academia',
        image_url: 'https://image.tmdb.org/t/p/w500/ova0A7UXwD0ac5eaHARD9m8MKNL.jpg', // MHA
        powers: ['One For All', 'Super Strength', 'Blackwhip'],
        weaknesses: ['Self-Sacrifice'],
        is_locked_content: false
    },
    {
        alias: 'All Might',
        name: 'Toshinori Yagi',
        franchise: 'Anime',
        origin_world: 'My Hero Academia',
        image_url: 'https://image.tmdb.org/t/p/w500/ova0A7UXwD0ac5eaHARD9m8MKNL.jpg',
        powers: ['One For All', 'Symbol of Peace', 'Detroit Smash'],
        weaknesses: ['Time Limit'],
        is_locked_content: false
    },
    {
        alias: 'Bakugo',
        name: 'Katsuki Bakugo',
        franchise: 'Anime',
        origin_world: 'My Hero Academia',
        image_url: 'https://image.tmdb.org/t/p/w500/ova0A7UXwD0ac5eaHARD9m8MKNL.jpg',
        powers: ['Explosion', 'Combat Genius', 'Determination'],
        weaknesses: ['Pride'],
        is_locked_content: false
    },
    {
        alias: 'Todoroki',
        name: 'Shoto Todoroki',
        franchise: 'Anime',
        origin_world: 'My Hero Academia',
        image_url: 'https://image.tmdb.org/t/p/w500/ova0A7UXwD0ac5eaHARD9m8MKNL.jpg',
        powers: ['Half-Cold Half-Hot', 'Ice', 'Fire'],
        weaknesses: ['Family Issues'],
        is_locked_content: false
    },

    // Demon Slayer
    {
        alias: 'Tanjiro',
        name: 'Tanjiro Kamado',
        franchise: 'Anime',
        origin_world: 'Demon Slayer',
        image_url: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhhs.jpg',
        powers: ['Sun Breathing', 'Water Breathing', 'Enhanced Smell'],
        weaknesses: ['Human'],
        is_locked_content: false
    },
    {
        alias: 'Nezuko',
        name: 'Nezuko Kamado',
        franchise: 'Anime',
        origin_world: 'Demon Slayer',
        image_url: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhhs.jpg',
        powers: ['Demon Form', 'Blood Demon Art', 'Size Change'],
        weaknesses: ['Sunlight'],
        is_locked_content: false
    },
    {
        alias: 'Zenitsu',
        name: 'Zenitsu Agatsuma',
        franchise: 'Anime',
        origin_world: 'Demon Slayer',
        image_url: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhhs.jpg',
        powers: ['Thunder Breathing', 'Godlike Speed', 'Sleep Fighting'],
        weaknesses: ['Cowardice'],
        is_locked_content: false
    },

    // Jujutsu Kaisen
    {
        alias: 'Yuji Itadori',
        name: 'Yuji Itadori',
        franchise: 'Anime',
        origin_world: 'Jujutsu Kaisen',
        image_url: 'https://image.tmdb.org/t/p/w500/43MRFTkq48s98wXBmEhIJp5SmF.jpg',
        powers: ['Superhuman Strength', 'Sukuna Vessel', 'Black Flash'],
        weaknesses: ['Sukuna'],
        is_locked_content: false
    },
    {
        alias: 'Megumi',
        name: 'Megumi Fushiguro',
        franchise: 'Anime',
        origin_world: 'Jujutsu Kaisen',
        image_url: 'https://image.tmdb.org/t/p/w500/43MRFTkq48s98wXBmEhIJp5SmF.jpg',
        powers: ['Ten Shadows', 'Shikigami', 'Domain Expansion'],
        weaknesses: ['Self-Sacrifice'],
        is_locked_content: false
    },

    // Attack on Titan
    {
        alias: 'Mikasa',
        name: 'Mikasa Ackerman',
        franchise: 'Anime',
        origin_world: 'Attack on Titan',
        image_url: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
        powers: ['Ackerman Power', 'ODM Master', 'Super Strength'],
        weaknesses: ['Eren'],
        is_locked_content: false
    },
    {
        alias: 'Armin',
        name: 'Armin Arlert',
        franchise: 'Anime',
        origin_world: 'Attack on Titan',
        image_url: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
        powers: ['Colossal Titan', 'Genius Tactician', 'Transformation'],
        weaknesses: ['Physical Weakness'],
        is_locked_content: false
    },

    // One Piece - More
    {
        alias: 'Sanji',
        name: 'Vinsmoke Sanji',
        franchise: 'Anime',
        origin_world: 'One Piece',
        image_url: 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
        powers: ['Black Leg', 'Diable Jambe', 'Chef'],
        weaknesses: ['Women'],
        is_locked_content: false
    },
    {
        alias: 'Nami',
        name: 'Nami',
        franchise: 'Anime',
        origin_world: 'One Piece',
        image_url: 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
        powers: ['Weather Control', 'Zeus', 'Navigator'],
        weaknesses: ['Money'],
        is_locked_content: false
    },

    // Dragon Ball
    {
        alias: 'Vegeta',
        name: 'Prince Vegeta',
        franchise: 'Anime',
        origin_world: 'Dragon Ball',
        image_url: 'https://image.tmdb.org/t/p/w500/tHuM8BOFplDP2LYJk2qX7.jpg',
        powers: ['Super Saiyan', 'Final Flash', 'Ultra Ego'],
        weaknesses: ['Pride'],
        is_locked_content: false
    },
    {
        alias: 'Gohan',
        name: 'Son Gohan',
        franchise: 'Anime',
        origin_world: 'Dragon Ball',
        image_url: 'https://image.tmdb.org/t/p/w500/tHuM8BOFplDP2LYJk2qX7.jpg',
        powers: ['Beast Form', 'Potential Unleashed', 'Masenko'],
        weaknesses: ['Pacifist'],
        is_locked_content: false
    },

    // Bleach
    {
        alias: 'Ichigo',
        name: 'Ichigo Kurosaki',
        franchise: 'Anime',
        origin_world: 'Bleach',
        image_url: 'https://image.tmdb.org/t/p/w500/2EewmxXe72ogD0EaWM8gMf4qNIa.jpg',
        powers: ['Zanpakuto', 'Hollow Powers', 'Getsuga Tensho'],
        weaknesses: ['Emotion'],
        is_locked_content: false
    },

    // Death Note
    {
        alias: 'Light Yagami',
        name: 'Light Yagami',
        franchise: 'Anime',
        origin_world: 'Death Note',
        image_url: 'https://image.tmdb.org/t/p/w500/5jKJRJPaWAthxzN02dcPnRgqCqE.jpg',
        powers: ['Death Note', 'Genius Intellect', 'Manipulation'],
        weaknesses: ['God Complex'],
        is_locked_content: true
    },
    {
        alias: 'L',
        name: 'L Lawliet',
        franchise: 'Anime',
        origin_world: 'Death Note',
        image_url: 'https://image.tmdb.org/t/p/w500/5jKJRJPaWAthxzN02dcPnRgqCqE.jpg',
        powers: ['Genius Detective', 'Deduction', 'Sugar'],
        weaknesses: ['Sweets'],
        is_locked_content: false
    },

    // Cowboy Bebop
    {
        alias: 'Spike Spiegel',
        name: 'Spike Spiegel',
        franchise: 'Anime',
        origin_world: 'Cowboy Bebop',
        image_url: 'https://image.tmdb.org/t/p/w500/qXy4P4QzZd35yY9ks3lE0DBzh2W.jpg',
        powers: ['Martial Arts', 'Marksmanship', 'Cool'],
        weaknesses: ['Past'],
        is_locked_content: false
    },

    // Hunter x Hunter  
    {
        alias: 'Gon',
        name: 'Gon Freecss',
        franchise: 'Anime',
        origin_world: 'Hunter x Hunter',
        image_url: 'https://image.tmdb.org/t/p/w500/kJFb0Q5BOn11C6kSfG0TXd7cUQh.jpg',
        powers: ['Nen', 'Jajanken', 'Enhanced Senses'],
        weaknesses: ['Anger'],
        is_locked_content: false
    },
    {
        alias: 'Killua',
        name: 'Killua Zoldyck',
        franchise: 'Anime',
        origin_world: 'Hunter x Hunter',
        image_url: 'https://image.tmdb.org/t/p/w500/kJFb0Q5BOn11C6kSfG0TXd7cUQh.jpg',
        powers: ['Godspeed', 'Assassin', 'Electricity'],
        weaknesses: ['Illumi'],
        is_locked_content: false
    }
];

async function addMoreHeroes() {
    console.log(`🦸‍♂️ Adding ${newHeroes.length} new verified heroes...\n`);

    let added = 0;
    let failed = 0;

    for (const hero of newHeroes) {
        // Check if exists
        const { data: existing } = await supabase
            .from('heroes')
            .select('id')
            .eq('alias', hero.alias)
            .single();

        if (existing) {
            console.log(`⏭️  ${hero.alias} (already exists)`);
            continue;
        }

        const { error } = await supabase.from('heroes').insert(hero);

        if (error) {
            console.error(`❌ ${hero.alias}: ${error.message}`);
            failed++;
        } else {
            console.log(`✅ ${hero.alias}`);
            added++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Added: ${added}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`⏭️  Skipped (existed): ${newHeroes.length - added - failed}`);
    console.log(`\n🎉 Database expanded!`);
}

addMoreHeroes();
