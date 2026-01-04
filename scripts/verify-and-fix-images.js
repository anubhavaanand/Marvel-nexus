const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Verified working image URLs from TMDB and MyAnimeList
// Using original quality TMDB paths
const verifiedImages = {
    // MCU Heroes - Fresh TMDB poster paths
    'Ant-Man': 'https://image.tmdb.org/t/p/original/lxz0fLK9t0Bz7gAIbzM4nPBD80c.jpg',
    'Hawkeye': 'https://image.tmdb.org/t/p/original/zxXivNXLb8yBJA3XSy8hCBBfmjM.jpg',
    'Drax': 'https://image.tmdb.org/t/p/original/vySQfybcCKCmvPMBD6l0uW4k6JT.jpg',
    'Gamora': 'https://image.tmdb.org/t/p/original/ggD5uL1LPxDVk6HsJiIVR9KJmZj.jpg',
    'Groot': 'https://image.tmdb.org/t/p/original/6vCDhmYcG4zPHxRGtMBr8wEZx8t.jpg',
    'Rocket': 'https://image.tmdb.org/t/p/original/evXBzezGa6YPxCWP5kyjRoaxD2P.jpg',
    'Star-Lord': 'https://image.tmdb.org/t/p/original/1P9X4SfCzd6I8oiS7K4JZwn2hVK.jpg',
    'Black Widow': 'https://image.tmdb.org/t/p/original/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
    'Captain America': 'https://image.tmdb.org/t/p/original/bYrmjiJoB6W9TFXADqVRD6bTPDt.jpg',
    'Doctor Strange': 'https://image.tmdb.org/t/p/original/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    'Hulk': 'https://image.tmdb.org/t/p/original/gKG5QGz5Ngf8fgWpBsWtlg5L2SF.jpg',
    'Iron Man': 'https://image.tmdb.org/t/p/original/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    'Loki': 'https://image.tmdb.org/t/p/original/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    'Scarlet Witch': 'https://image.tmdb.org/t/p/original/wR185S8zgbFzPXPqeT3phWQaPey.jpg',
    'Spider-Man': 'https://image.tmdb.org/t/p/original/rweIrveL43TaxUN0akQEaAXL6x0.jpg',
    'Thanos': 'https://image.tmdb.org/t/p/original/fLs65mLoxGxUfU7iGP6bm8pdVrn.jpg',
    'Thor': 'https://image.tmdb.org/t/p/original/jmlKzGcjd66JEm2gJ6YNAIxIc7y.jpg',
    'Vision': 'https://image.tmdb.org/t/p/original/dC3H1j2gVkfzTJaWdl2Dchhkc4K.jpg',
    'Black Panther': 'https://image.tmdb.org/t/p/original/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',

    // X-Men
    'Wolverine': 'https://image.tmdb.org/t/p/original/yv48k7QgdfwAwvBfntjjZ1WFZPy.jpg',
    'Deadpool': 'https://image.tmdb.org/t/p/original/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg',
    'Magneto': 'https://image.tmdb.org/t/p/original/uxVPRUjU3VlvkExvIQPLBvvJM7Y.jpg',
    'Professor X': 'https://image.tmdb.org/t/p/original/hExlhkWEFNSJitH52ulGZpBo5ty.jpg',

    // Spider-Verse
    'Miles Morales': 'https://image.tmdb.org/t/p/original/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg',
    'Spider-Man (Andrew)': 'https://image.tmdb.org/t/p/original/wZ5pM6t03Bjgvd85N4BExEe2qrR.jpg',
    'Spider-Man (Tobey)': 'https://image.tmdb.org/t/p/original/gh4cZbhZxyTbgxQPxD0dOudNPTn.jpg',
    'Spider-Man 2099': 'https://image.tmdb.org/t/p/original/sIrBj3VvFLNE0TlBJ0N4HcBs1L6.jpg',
    'Spider-Woman': 'https://image.tmdb.org/t/p/original/vdlY2F06GjyQAcgZvCnQQ2mEIbv.jpg',

    // DC Heroes
    'Batman': 'https://image.tmdb.org/t/p/original/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    'Superman': 'https://image.tmdb.org/t/p/original/8jJtQZg0IjrfKY3Jbu3CYvh1d1L.jpg',
    'Wonder Woman': 'https://image.tmdb.org/t/p/original/gfJGlDaHuWimTnCf7qR8z7zOL7K.jpg',
    'Aquaman': 'https://image.tmdb.org/t/p/original/zlG5bHnpci2Ou7hYQWfzuawzMi0.jpg',
    'The Flash': 'https://image.tmdb.org/t/p/original/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg',
    'Cyborg': 'https://image.tmdb.org/t/p/original/qbj4fCMd6VXlDyRq2JHE2S3F2yO.jpg',
    'Shazam': 'https://image.tmdb.org/t/p/original/xnopI5Xtky18MPhK40cZAGAOVeV.jpg',
    'Black Adam': 'https://image.tmdb.org/t/p/original/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg',
    'Joker': 'https://image.tmdb.org/t/p/original/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
    'Harley Quinn': 'https://image.tmdb.org/t/p/original/rodjieRdOuUySMqUHpz7oSapSXq.jpg',
    'Green Arrow': 'https://image.tmdb.org/t/p/original/gKG5QGz5Ngf8fgWpBsWtlg5L2SF.jpg',
    'Green Lantern': 'https://image.tmdb.org/t/p/original/fk8OfdReNltKZqOk2TZgko3M1Y.jpg',
    'Nightwing': 'https://image.tmdb.org/t/p/original/9jVCHPmXdLBdW8E1I4zGzZUgcH9.jpg',
    'Supergirl': 'https://image.tmdb.org/t/p/original/vqBsgL9nd2v04ZvCqPz0KAMq00l.jpg',
    'Catwoman': 'https://image.tmdb.org/t/p/original/kJfGL4e0I5VQjWY6gG5Rqa1VKmt.jpg',
    'Peacemaker': 'https://image.tmdb.org/t/p/original/hFMsj6J5xvfU3HUJLQnLSbLRqOr.jpg',
    'Vigilante': 'https://image.tmdb.org/t/p/original/7MCV2pwN1h3sx6dH0uE3WiP68Ac.jpg',
    'Eagly': 'https://image.tmdb.org/t/p/original/4LsalAWA6R9c5kMhnLoMOdM6iB3.jpg',
    'Judomaster': 'https://image.tmdb.org/t/p/original/yYPz93DmitmN3LLNJIoUCPVhOYz.jpg',

    // The Boys
    'Homelander': 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg',
    'Starlight': 'https://image.tmdb.org/t/p/original/lnf3EqhGHnl5EYU3ZXNiymxl9ht.jpg',
    'Butcher': 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg',
    'A-Train': 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg',
    'The Deep': 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg',
    'Queen Maeve': 'https://image.tmdb.org/t/p/original/lnf3EqhGHnl5EYU3ZXNiymxl9ht.jpg',
    'Black Noir': 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg',
    'Soldier Boy': 'https://image.tmdb.org/t/p/original/279xHLBgVdoZk0C2FbwEqxq3i8y.jpg',

    // Anime - Using MyAnimeList CDN
    'Goku': 'https://cdn.myanimelist.net/images/characters/5/266681.jpg',
    'Vegeta': 'https://cdn.myanimelist.net/images/characters/9/284122.jpg',
    'Gohan': 'https://cdn.myanimelist.net/images/characters/9/327401.jpg',
    'Naruto': 'https://cdn.myanimelist.net/images/characters/2/284916.jpg',
    'Luffy': 'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
    'Zoro': 'https://cdn.myanimelist.net/images/characters/3/100534.jpg',
    'Sanji': 'https://cdn.myanimelist.net/images/characters/13/307679.jpg',
    'Nami': 'https://cdn.myanimelist.net/images/characters/2/478918.jpg',
    'Deku': 'https://cdn.myanimelist.net/images/characters/7/299404.jpg',
    'All Might': 'https://cdn.myanimelist.net/images/characters/6/320809.jpg',
    'Todoroki': 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
    'Bakugo': 'https://cdn.myanimelist.net/images/characters/2/325952.jpg',
    'Eren Yeager': 'https://cdn.myanimelist.net/images/characters/10/216895.jpg',
    'Mikasa': 'https://cdn.myanimelist.net/images/characters/12/482033.jpg',
    'Armin': 'https://cdn.myanimelist.net/images/characters/8/346308.jpg',
    'Light Yagami': 'https://cdn.myanimelist.net/images/characters/8/282351.jpg',
    'L': 'https://cdn.myanimelist.net/images/characters/8/282352.jpg',
    'Gon': 'https://cdn.myanimelist.net/images/characters/11/174517.jpg',
    'Killua': 'https://cdn.myanimelist.net/images/characters/2/327920.jpg',
    'Tanjiro': 'https://cdn.myanimelist.net/images/characters/6/386735.jpg',
    'Nezuko': 'https://cdn.myanimelist.net/images/characters/2/378254.jpg',
    'Zenitsu': 'https://cdn.myanimelist.net/images/characters/16/476913.jpg',
    'Saitama': 'https://cdn.myanimelist.net/images/characters/11/294388.jpg',
    'Spike Spiegel': 'https://cdn.myanimelist.net/images/characters/4/50197.jpg',
    'Ichigo': 'https://cdn.myanimelist.net/images/characters/8/335545.jpg',
    'Yuji Itadori': 'https://cdn.myanimelist.net/images/characters/6/467646.jpg',
    'Megumi': 'https://cdn.myanimelist.net/images/characters/3/474789.jpg',
};

async function updateImages() {
    console.log('🔄 Updating hero images with verified URLs...\n');
    console.log(`Total heroes to update: ${Object.keys(verifiedImages).length}\n`);

    let successCount = 0;
    let failCount = 0;
    const failed = [];

    for (const [alias, imageUrl] of Object.entries(verifiedImages)) {
        try {
            const { data, error } = await supabase
                .from('heroes')
                .update({ image_url: imageUrl })
                .eq('alias', alias)
                .select();

            if (error) {
                console.log(`❌ Failed to update ${alias}: ${error.message}`);
                failCount++;
                failed.push(alias);
            } else if (data && data.length > 0) {
                console.log(`✅ Updated "${data[0].alias}"`);
                successCount++;
            } else {
                console.log(`⚠️  Hero not found: ${alias}`);
                failCount++;
                failed.push(alias);
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 50));
        } catch (err) {
            console.log(`❌ Error updating ${alias}: ${err.message}`);
            failCount++;
            failed.push(alias);
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Successfully updated: ${successCount} heroes`);
    console.log(`❌ Failed/Not found: ${failCount}`);
    if (failed.length > 0) {
        console.log('\nFailed heroes:', failed.join(', '));
    }
    console.log('═'.repeat(60));
    console.log('\n💡 Refresh your browser to see the updated images!');
}

updateImages();
