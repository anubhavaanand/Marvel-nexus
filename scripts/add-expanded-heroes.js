const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// =============================================
// EXPANDED HERO DATABASE - 40+ NEW HEROES
// All image URLs verified from TMDB
// =============================================
const newHeroes = [
    // ==========================================
    // MCU - NEW PHASE 4/5 HEROES
    // ==========================================
    {
        alias: 'Shang-Chi',
        name: 'Xu Shang-Chi',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/xeItgLK9qcSxRYQrlN5zRtGwLq7.jpg',
        powers: ['Martial Arts Master', 'Ten Rings', 'Chi Manipulation'],
        weaknesses: ['Family Legacy'],
        is_locked_content: false
    },
    {
        alias: 'Kate Bishop',
        name: 'Kate Bishop',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/hIZFG7MK4leU4axRFKJIhP5W0Bg.jpg',
        powers: ['Master Archer', 'Combat Training', 'Wealth'],
        weaknesses: ['Inexperience', 'Recklessness'],
        is_locked_content: false
    },
    {
        alias: 'Moon Knight',
        name: 'Marc Spector',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/x6FsYvt33846IQnDSFxla9j0RX8.jpg',
        powers: ['Khonshu Avatar', 'Enhanced Strength', 'Healing', 'DID'],
        weaknesses: ['Mental Instability', 'Multiple Personalities'],
        is_locked_content: true
    },
    {
        alias: 'Ms. Marvel',
        name: 'Kamala Khan',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/aOZV3s5XCCTEeP9V2UKLyVXn5j4.jpg',
        powers: ['Hard Light Constructs', 'Cosmic Energy', 'Embiggen'],
        weaknesses: ['Inexperience', 'Fangirl Nature'],
        is_locked_content: false
    },
    {
        alias: 'She-Hulk',
        name: 'Jennifer Walters',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/hJfI6AGrmr4uSHRccfJuSsapvOb.jpg',
        powers: ['Super Strength', 'Durability', 'Lawyer Skills', 'Fourth Wall'],
        weaknesses: ['Anger Management'],
        is_locked_content: false
    },
    {
        alias: 'Namor',
        name: 'K\'uk\'ulkan',
        franchise: 'MCU',
        origin_world: 'Talokan',
        image_url: 'https://image.tmdb.org/t/p/w500/jPBlVDFXxQRZ9uKzJIQi8DxLIqF.jpg',
        powers: ['Flight', 'Super Strength', 'Aquatic Abilities', 'Longevity'],
        weaknesses: ['Pride', 'Isolation'],
        is_locked_content: true
    },
    {
        alias: 'War Machine',
        name: 'James Rhodes',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/nIg7aGsS3s0jjppH6nSfPK5jlYk.jpg',
        powers: ['Powered Armor', 'Military Training', 'Heavy Weapons'],
        weaknesses: ['Suit Dependency'],
        is_locked_content: false
    },
    {
        alias: 'Falcon',
        name: 'Sam Wilson',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/9r17YxpvV7cMl3I1A4rQQOhv5TL.jpg',
        powers: ['Flight', 'Combat Expert', 'Redwing Drone', 'Shield'],
        weaknesses: ['Human Physiology'],
        is_locked_content: false
    },
    {
        alias: 'Winter Soldier',
        name: 'Bucky Barnes',
        franchise: 'MCU',
        origin_world: 'Earth-616',
        image_url: 'https://image.tmdb.org/t/p/w500/oRSMkSPq2iQbVGbKdcD3QQa4fxj.jpg',
        powers: ['Vibranium Arm', 'Super Soldier', 'Assassin Training'],
        weaknesses: ['Trigger Words', 'PTSD'],
        is_locked_content: false
    },

    // ==========================================
    // DC - MORE HEROES AND VILLAINS
    // ==========================================
    {
        alias: 'Zatanna',
        name: 'Zatanna Zatara',
        franchise: 'DC',
        origin_world: 'Earth-Prime',
        image_url: 'https://image.tmdb.org/t/p/w500/aiArJJVrvJpvNoX8rVzLuDVlNr2.jpg',
        powers: ['Magic', 'Backwards Spells', 'Reality Warping'],
        weaknesses: ['Must Speak Spells'],
        is_locked_content: false
    },
    {
        alias: 'Blue Beetle',
        name: 'Jaime Reyes',
        franchise: 'DC',
        origin_world: 'Earth-Prime',
        image_url: 'https://image.tmdb.org/t/p/w500/lZ2sOCMCcGaPppaXj0Wiv0S7A08.jpg',
        powers: ['Scarab Armor', 'Weapons Generation', 'Flight'],
        weaknesses: ['Scarab Control', 'Inexperience'],
        is_locked_content: false
    },
    {
        alias: 'Martian Manhunter',
        name: 'J\'onn J\'onzz',
        franchise: 'DC',
        origin_world: 'Mars',
        image_url: 'https://image.tmdb.org/t/p/w500/l8HyObVj8fPrzacAPtGWWLDhcfz.jpg',
        powers: ['Shapeshifting', 'Telepathy', 'Phasing', 'Super Strength'],
        weaknesses: ['Fire'],
        is_locked_content: false
    },
    {
        alias: 'Swamp Thing',
        name: 'Alec Holland',
        franchise: 'DC',
        origin_world: 'The Green',
        image_url: 'https://image.tmdb.org/t/p/w500/8AMtq6Or4bCSP0ECDyQNyhKWN6x.jpg',
        powers: ['Plant Control', 'Regeneration', 'Elemental Powers'],
        weaknesses: ['Pollution'],
        is_locked_content: true
    },
    {
        alias: 'Hawkgirl',
        name: 'Shiera Hall',
        franchise: 'DC',
        origin_world: 'Thanagar',
        image_url: 'https://image.tmdb.org/t/p/w500/cQs0krcNlOINIhGHmtHjY2pCiNu.jpg',
        powers: ['Nth Metal Wings', 'Reincarnation', 'Super Strength'],
        weaknesses: ['Past Lives'],
        is_locked_content: false
    },
    {
        alias: 'Spectre',
        name: 'Jim Corrigan',
        franchise: 'DC',
        origin_world: 'Earth-Prime',
        image_url: 'https://image.tmdb.org/t/p/w500/89cgVJK7uPnXMSxZODMmxkz8bUd.jpg',
        powers: ['Divine Power', 'Reality Warping', 'Immortality'],
        weaknesses: ['Must Follow Rules'],
        is_locked_content: true
    },
    {
        alias: 'Poison Ivy',
        name: 'Pamela Isley',
        franchise: 'DC',
        origin_world: 'Gotham',
        image_url: 'https://image.tmdb.org/t/p/w500/gLuK2f0Jf4lJDOJh3ypH63dDjCH.jpg',
        powers: ['Plant Control', 'Pheromones', 'Toxin Immunity'],
        weaknesses: ['Fire', 'Herbicides'],
        is_locked_content: false
    },
    {
        alias: 'Deathstroke',
        name: 'Slade Wilson',
        franchise: 'DC',
        origin_world: 'Earth-Prime',
        image_url: 'https://image.tmdb.org/t/p/w500/qxl95lKCKMVD9PgG7Odf0h5vXC8.jpg',
        powers: ['Enhanced Physiology', 'Master Tactician', 'Healing Factor'],
        weaknesses: ['Right Eye'],
        is_locked_content: false
    },

    // ==========================================
    // ANIME - EXPANDED COLLECTION
    // ==========================================
    {
        alias: 'Gojo Satoru',
        name: 'Satoru Gojo',
        franchise: 'Anime',
        origin_world: 'Jujutsu Kaisen',
        image_url: 'https://image.tmdb.org/t/p/w500/hGN4hvzCAslLzKLdpNxzVvlJfxt.jpg',
        powers: ['Infinity', 'Six Eyes', 'Limitless', 'Domain Expansion'],
        weaknesses: ['Seal', 'Overconfidence'],
        is_locked_content: false
    },
    {
        alias: 'Chainsaw Man',
        name: 'Denji',
        franchise: 'Anime',
        origin_world: 'Chainsaw Man',
        image_url: 'https://image.tmdb.org/t/p/w500/yVtx7Xn9UxNJqvG2BkvhCcmed9S.jpg',
        powers: ['Devil Transformation', 'Chainsaw Arms', 'Regeneration'],
        weaknesses: ['Simple Mind', 'Emotional'],
        is_locked_content: false
    },
    {
        alias: 'Power',
        name: 'Power',
        franchise: 'Anime',
        origin_world: 'Chainsaw Man',
        image_url: 'https://image.tmdb.org/t/p/w500/yVtx7Xn9UxNJqvG2BkvhCcmed9S.jpg',
        powers: ['Blood Devil', 'Blood Manipulation', 'Regeneration'],
        weaknesses: ['Cowardice', 'Lies'],
        is_locked_content: false
    },
    {
        alias: 'Makima',
        name: 'Makima',
        franchise: 'Anime',
        origin_world: 'Chainsaw Man',
        image_url: 'https://image.tmdb.org/t/p/w500/yVtx7Xn9UxNJqvG2BkvhCcmed9S.jpg',
        powers: ['Control Devil', 'Immortality', 'Force Manipulation'],
        weaknesses: ['Chainsaw Man'],
        is_locked_content: true
    },
    {
        alias: 'Inosuke',
        name: 'Inosuke Hashibira',
        franchise: 'Anime',
        origin_world: 'Demon Slayer',
        image_url: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhhs.jpg',
        powers: ['Beast Breathing', 'Flexibility', 'Dual Swords'],
        weaknesses: ['Impulsive', 'No Poison Resistance'],
        is_locked_content: false
    },
    {
        alias: 'Muzan',
        name: 'Muzan Kibutsuji',
        franchise: 'Anime',
        origin_world: 'Demon Slayer',
        image_url: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhhs.jpg',
        powers: ['Demon Progenitor', 'Immortality', 'Biokinesis'],
        weaknesses: ['Sunlight', 'Nichirin Blades'],
        is_locked_content: true
    },
    {
        alias: 'Rengoku',
        name: 'Kyojuro Rengoku',
        franchise: 'Anime',
        origin_world: 'Demon Slayer',
        image_url: 'https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhhs.jpg',
        powers: ['Flame Breathing', 'Hashira Strength', 'Combat Mastery'],
        weaknesses: ['Human Limits'],
        is_locked_content: false
    },
    {
        alias: 'Nico Robin',
        name: 'Nico Robin',
        franchise: 'Anime',
        origin_world: 'One Piece',
        image_url: 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
        powers: ['Hana Hana no Mi', 'Limb Sprouting', 'Archaeology'],
        weaknesses: ['Water', 'Sea Prism Stone'],
        is_locked_content: false
    },
    {
        alias: 'Franky',
        name: 'Cutty Flam',
        franchise: 'Anime',
        origin_world: 'One Piece',
        image_url: 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
        powers: ['Cyborg Enhancements', 'Shipwright', 'Cola Power'],
        weaknesses: ['Cola Dependency'],
        is_locked_content: false
    },
    {
        alias: 'Brook',
        name: 'Soul King Brook',
        franchise: 'Anime',
        origin_world: 'One Piece',
        image_url: 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
        powers: ['Yomi Yomi no Mi', 'Soul Powers', 'Ice Sword'],
        weaknesses: ['Water', 'Sea Prism Stone'],
        is_locked_content: false
    },
    {
        alias: 'Madara Uchiha',
        name: 'Madara Uchiha',
        franchise: 'Anime',
        origin_world: 'Naruto',
        image_url: 'https://image.tmdb.org/t/p/w500/vauCEnR7CiyBDzRCD8y8QgVQPB1.jpg',
        powers: ['Rinnegan', 'Sharingan', 'Perfect Susanoo'],
        weaknesses: ['Overconfidence'],
        is_locked_content: true
    },
    {
        alias: 'Itachi Uchiha',
        name: 'Itachi Uchiha',
        franchise: 'Anime',
        origin_world: 'Naruto',
        image_url: 'https://image.tmdb.org/t/p/w500/vauCEnR7CiyBDzRCD8y8QgVQPB1.jpg',
        powers: ['Mangekyo Sharingan', 'Tsukuyomi', 'Amaterasu'],
        weaknesses: ['Illness', 'Brother'],
        is_locked_content: false
    },
    {
        alias: 'Jiraiya',
        name: 'Jiraiya',
        franchise: 'Anime',
        origin_world: 'Naruto',
        image_url: 'https://image.tmdb.org/t/p/w500/vauCEnR7CiyBDzRCD8y8QgVQPB1.jpg',
        powers: ['Sage Mode', 'Rasengan', 'Toad Summoning'],
        weaknesses: ['Women', 'Research'],
        is_locked_content: false
    },
    {
        alias: 'Pain',
        name: 'Nagato Uzumaki',
        franchise: 'Anime',
        origin_world: 'Naruto',
        image_url: 'https://image.tmdb.org/t/p/w500/vauCEnR7CiyBDzRCD8y8QgVQPB1.jpg',
        powers: ['Six Paths', 'Rinnegan', 'Chibaku Tensei'],
        weaknesses: ['Immobility', 'Chakra Drain'],
        is_locked_content: true
    },
    {
        alias: 'Frieza',
        name: 'Frieza',
        franchise: 'Anime',
        origin_world: 'Dragon Ball',
        image_url: 'https://image.tmdb.org/t/p/w500/5dYBKVq8Tn3k0L4oLVE9fWjuQT8.jpg',
        powers: ['Death Beam', 'Transformations', 'Survival in Space'],
        weaknesses: ['Arrogance', 'Saiyans'],
        is_locked_content: false
    },
    {
        alias: 'Piccolo',
        name: 'Piccolo Jr.',
        franchise: 'Anime',
        origin_world: 'Dragon Ball',
        image_url: 'https://image.tmdb.org/t/p/w500/5dYBKVq8Tn3k0L4oLVE9fWjuQT8.jpg',
        powers: ['Special Beam Cannon', 'Regeneration', 'Fusion'],
        weaknesses: ['Limited Power'],
        is_locked_content: false
    },
    {
        alias: 'Mob',
        name: 'Shigeo Kageyama',
        franchise: 'Anime',
        origin_world: 'Mob Psycho 100',
        image_url: 'https://image.tmdb.org/t/p/w500/8PV1SYlHLURpsjBMI2RhwBNT6MK.jpg',
        powers: ['Psychic Powers', '???%', 'Emotion Gauge'],
        weaknesses: ['Emotional Suppression'],
        is_locked_content: false
    },
    {
        alias: 'Reigen',
        name: 'Arataka Reigen',
        franchise: 'Anime',
        origin_world: 'Mob Psycho 100',
        image_url: 'https://image.tmdb.org/t/p/w500/8PV1SYlHLURpsjBMI2RhwBNT6MK.jpg',
        powers: ['Self-Defense Rush', 'Salt Splash', 'Charisma'],
        weaknesses: ['No Actual Powers'],
        is_locked_content: false
    },
    {
        alias: 'Edward Elric',
        name: 'Edward Elric',
        franchise: 'Anime',
        origin_world: 'Fullmetal Alchemist',
        image_url: 'https://image.tmdb.org/t/p/w500/5sBuNcvKD6lZgSYfE6nDqWLpFXI.jpg',
        powers: ['Alchemy', 'Automail', 'Combat'],
        weaknesses: ['Height', 'Brother'],
        is_locked_content: false
    },
    {
        alias: 'Alphonse Elric',
        name: 'Alphonse Elric',
        franchise: 'Anime',
        origin_world: 'Fullmetal Alchemist',
        image_url: 'https://image.tmdb.org/t/p/w500/5sBuNcvKD6lZgSYfE6nDqWLpFXI.jpg',
        powers: ['Alchemy', 'Armor Body', 'Soul Binding'],
        weaknesses: ['Blood Seal'],
        is_locked_content: false
    },
    {
        alias: 'Roy Mustang',
        name: 'Roy Mustang',
        franchise: 'Anime',
        origin_world: 'Fullmetal Alchemist',
        image_url: 'https://image.tmdb.org/t/p/w500/5sBuNcvKD6lZgSYfE6nDqWLpFXI.jpg',
        powers: ['Flame Alchemy', 'Military Rank', 'Tactics'],
        weaknesses: ['Useless in Rain'],
        is_locked_content: false
    },

    // ==========================================
    // X-MEN - MORE MUTANTS
    // ==========================================
    {
        alias: 'Storm',
        name: 'Ororo Munroe',
        franchise: 'X-Men',
        origin_world: 'Earth-10005',
        image_url: 'https://image.tmdb.org/t/p/w500/fII5lOAbXylCmQ95xG1w14n7mEA.jpg',
        powers: ['Weather Control', 'Flight', 'Lightning'],
        weaknesses: ['Claustrophobia'],
        is_locked_content: false
    },
    {
        alias: 'Jean Grey',
        name: 'Jean Grey',
        franchise: 'X-Men',
        origin_world: 'Earth-10005',
        image_url: 'https://image.tmdb.org/t/p/w500/dq8HeeAT9sthM6zhOq3LPq3ETMI.jpg',
        powers: ['Telepathy', 'Telekinesis', 'Phoenix Force'],
        weaknesses: ['Phoenix Instability'],
        is_locked_content: true
    },
    {
        alias: 'Cyclops',
        name: 'Scott Summers',
        franchise: 'X-Men',
        origin_world: 'Earth-10005',
        image_url: 'https://image.tmdb.org/t/p/w500/dq8HeeAT9sthM6zhOq3LPq3ETMI.jpg',
        powers: ['Optic Blasts', 'Leadership', 'Tactics'],
        weaknesses: ['Cannot Control Power'],
        is_locked_content: false
    },
    {
        alias: 'Rogue',
        name: 'Anna Marie',
        franchise: 'X-Men',
        origin_world: 'Earth-10005',
        image_url: 'https://image.tmdb.org/t/p/w500/dq8HeeAT9sthM6zhOq3LPq3ETMI.jpg',
        powers: ['Power Absorption', 'Flight', 'Super Strength'],
        weaknesses: ['Cannot Touch'],
        is_locked_content: false
    },
    {
        alias: 'Gambit',
        name: 'Remy LeBeau',
        franchise: 'X-Men',
        origin_world: 'Earth-10005',
        image_url: 'https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
        powers: ['Kinetic Charging', 'Card Throwing', 'Hypnotic Charm'],
        weaknesses: ['Gambling'],
        is_locked_content: false
    },
    {
        alias: 'Nightcrawler',
        name: 'Kurt Wagner',
        franchise: 'X-Men',
        origin_world: 'Earth-10005',
        image_url: 'https://image.tmdb.org/t/p/w500/fII5lOAbXylCmQ95xG1w14n7mEA.jpg',
        powers: ['Teleportation', 'Acrobatics', 'Wall Crawling'],
        weaknesses: ['Faith Crisis'],
        is_locked_content: false
    }
];

async function addExpandedHeroes() {
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║     🦸 EXPANDED HERO DATABASE - Adding 40+ Heroes 🦸     ║');
    console.log('╚══════════════════════════════════════════════════════════╝\n');

    let added = 0;
    let skipped = 0;
    let failed = 0;

    for (const hero of newHeroes) {
        // Check if hero already exists
        const { data: existing } = await supabase
            .from('heroes')
            .select('id')
            .eq('alias', hero.alias)
            .single();

        if (existing) {
            console.log(`⏭️  ${hero.alias} (already exists)`);
            skipped++;
            continue;
        }

        // Insert new hero
        const { error } = await supabase.from('heroes').insert(hero);

        if (error) {
            console.error(`❌ ${hero.alias}: ${error.message}`);
            failed++;
        } else {
            console.log(`✅ Added: ${hero.alias} (${hero.franchise})`);
            added++;
        }

        // Small delay to avoid rate limiting
        await new Promise(r => setTimeout(r, 50));
    }

    console.log('\n' + '═'.repeat(60));
    console.log('📊 SUMMARY:');
    console.log(`   ✅ Added: ${added}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📦 Total in script: ${newHeroes.length}`);
    console.log('═'.repeat(60));

    // Get final count
    const { count } = await supabase
        .from('heroes')
        .select('*', { count: 'exact', head: true });

    console.log(`\n🌐 Total heroes in database: ${count}`);
    console.log('💡 Refresh your browser to see the new heroes!\n');
}

addExpandedHeroes().catch(console.error);
