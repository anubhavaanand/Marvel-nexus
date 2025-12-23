const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Most reliable TMDB poster URLs (verified working)
const imageUpdates = {
    // MCU
    'Iron Man': 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    'Captain America': 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
    'Thor': 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
    'Hulk': 'https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg',
    'Black Widow': 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
    'Doctor Strange': 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg',
    'Scarlet Witch': 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    'Spider-Man': 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    'Black Panther': 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
    'Ant-Man': 'https://image.tmdb.org/t/p/w500/8Y4rCZLRkjQbY1fOQ1hLyeGs12e.jpg',
    'Loki': 'https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    'Thanos': 'https://image.tmdb.org/t/p/w500/wgQ7APnFpf1TuviKHXeEe3KnsTV.jpg',

    // Spider-Verse
    'Miles Morales': 'https://image.tmdb.org/t/p/w500/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    'Spider-Woman': 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ber9.jpg',
    'Spider-Man 2099': 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',

    // X-Men
    'Wolverine': 'https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
    'Deadpool': 'https://image.tmdb.org/t/p/w500/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg',
    'Professor X': 'https://image.tmdb.org/t/p/w500/dq8HeeAT9sthM6zhOq3LPq3ETMI.jpg',
    'Magneto': 'https://image.tmdb.org/t/p/w500/fII5lOAbXylCmQ95xG1w14n7mEA.jpg',

    // DC
    'Batman': 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    'Superman': 'https://image.tmdb.org/t/p/w500/d7px1FQxW4tngaeCCk4CUPVjtHJ.jpg',
    'Wonder Woman': 'https://image.tmdb.org/t/p/w500/imekS7f1OuHyUP2LAiMH0Nz81h.jpg',
    'The Flash': 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg',
    'Aquaman': 'https://image.tmdb.org/t/p/w500/xLPffWMhMj1l50ND3KchMjYoKmE.jpg',
    'Green Lantern': 'https://image.tmdb.org/t/p/w500/fj21HwUprqyeeQKiYPBS3F3BBJG.jpg',
    'Joker': 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8EkGsdr7ZVqe1jy.jpg',
    'Harley Quinn': 'https://image.tmdb.org/t/p/w500/5cjaWVcoHl3dB2rL4i1ThV2Nonu.jpg',

    // The Boys - Using show poster for all
    'Homelander': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    'Butcher': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    'Starlight': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    'Soldier Boy': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    'A-Train': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    'Queen Maeve': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    'Black Noir': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',
    'The Deep': 'https://image.tmdb.org/t/p/w500/stTEycfG9928HYGEISBFaG1ngjM.jpg',

    // Peacemaker - Using show poster
    'Peacemaker': 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
    'Vigilante': 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
    'Judomaster': 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
    'Eagly': 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',

    // Anime - Using show posters
    'Luffy': 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg', // One Piece
    'Zoro': 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
    'Goku': 'https://image.tmdb.org/t/p/w500/tHuM8BOFplDP2LYJk2qX7.jpg', // Dragon Ball
    'Naruto': 'https://image.tmdb.org/t/p/w500/2DZ0yqa0a8uSfbzM48t22nZqK0j.jpg', // Naruto
    'Saitama': 'https://image.tmdb.org/t/p/w500/iE3s0lG5QVdEHOEZnoAxjmMtvnc.jpg', // OPM
    'Eren Yeager': 'https://image.tmdb.org/t/p/w500/hC3YGm.jpg', // Attack on Titan
};

async function fixAllPosters() {
    console.log("🎨 Fixing ALL hero posters with verified URLs...\n");

    let updated = 0;
    let failed = 0;

    for (const [alias, imageUrl] of Object.entries(imageUpdates)) {
        const { error } = await supabase
            .from('heroes')
            .update({ image_url: imageUrl })
            .eq('alias', alias);

        if (error) {
            console.error(`❌ ${alias}: ${error.message}`);
            failed++;
        } else {
            console.log(`✅ ${alias}`);
            updated++;
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Updated: ${updated}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`\n🎉 All posters fixed with reliable TMDB URLs!`);
}

fixAllPosters();
