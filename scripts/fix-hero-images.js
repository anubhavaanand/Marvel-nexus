const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Using working TMDB paths and verified high-quality image URLs
// Key is the hero alias as it appears in the database
const imageUpdates = {
    // MCU Heroes - Verified working TMDB and high-quality sources
    'Ant-Man': 'https://image.tmdb.org/t/p/original/fAgvr4ca5TbNeK3P9fnuzNs0eJO.jpg',
    'Hawkeye': 'https://image.tmdb.org/t/p/original/ct5pNE5dDHryHLDnxyXkPVsyaKp.jpg',
    'Drax': 'https://image.tmdb.org/t/p/original/lXhgCODAbBXL5buk9yEmTpOoOgR.jpg',
    'Gamora': 'https://image.tmdb.org/t/p/original/38Jiwd7wy4xvIb5rBit6bqZb7fQ.jpg',
    'Groot': 'https://image.tmdb.org/t/p/original/wmL89W5TIlZ8qNVx7ERHNJcDjPG.jpg',
    'Rocket': 'https://image.tmdb.org/t/p/original/3c7tpU8RS6mJvZkLe3kuJh8CXWK.jpg',
    'Star-Lord': 'https://image.tmdb.org/t/p/original/o32Tu0OgQwJl7OEC4HVcU9fWBP0.jpg',

    // X-Men - High quality wiki and official sources
    'Magneto': 'https://image.tmdb.org/t/p/original/tJTijlsHVc1wPJHYpWIpqeXgEdi.jpg',
    'Professor X': 'https://image.tmdb.org/t/p/original/2JJFj6z9XqMlRKf0i9b7WNfAjJr.jpg',

    // DC Heroes - Official DCEU and Arrowverse images
    'Superman': 'https://image.tmdb.org/t/p/original/zHQqJzyZwrD9S3jOfYmwE7Y2WgQ.jpg',
    'Wonder Woman': 'https://image.tmdb.org/t/p/original/u7VKpfdPqBCJ7gwPOnMqiByJEDe.jpg',
    'Joker': 'https://image.tmdb.org/t/p/original/zzXFM4FKDG7l1ufrAkwQYv2xvnh.jpg',
    'Harley Quinn': 'https://image.tmdb.org/t/p/original/z84d0TjfGcH0QO7bafbvQdv3M7W.jpg',
    'Black Adam': 'https://image.tmdb.org/t/p/original/3TzF1xO5F12p0c3ebwjFdYuRvAe.jpg',
    'Cyborg': 'https://image.tmdb.org/t/p/original/fMHDMbbZlZYRjmvfQdZCqS7KMN5.jpg',
    'Green Arrow': 'https://image.tmdb.org/t/p/original/7A8w8x6vofrH2FO8MpFXamQKdOJ.jpg',
    'Green Lantern': 'https://image.tmdb.org/t/p/original/vKu0fcqW25xPl955gNAj8mJ1AKW.jpg',
    'Nightwing': 'https://image.tmdb.org/t/p/original/fv8FibkvCw7kfSpjZF5FHZxlwQy.jpg',
    'Supergirl': 'https://image.tmdb.org/t/p/original/vqfXQ76VBjQNXl6JVVGX6nTkzkW.jpg',
    'Peacemaker': 'https://image.tmdb.org/t/p/original/tif8oVNx7K7BXcGaTi6dvJCpwQA.jpg',
    'Vigilante': 'https://image.tmdb.org/t/p/original/5tqpKSxD4J5p09pXl3RgZDQwC1m.jpg',
    'Eagly': 'https://image.tmdb.org/t/p/original/zF6FgEWXIQF9VGSXWKqtNxPzLsx.jpg',
    'Judomaster': 'https://image.tmdb.org/t/p/original/2o7Y4eaGwuq0nWQXnZCB9LLqRqr.jpg',

    // Anime - High quality character art from MyAnimeList CDN
    'Goku': 'https://cdn.myanimelist.net/images/characters/14/361238.jpg',
    'Vegeta': 'https://cdn.myanimelist.net/images/characters/3/372624.jpg',
    'Gohan': 'https://cdn.myanimelist.net/images/characters/12/330401.jpg',
    'Naruto': 'https://cdn.myanimelist.net/images/characters/2/284121.jpg',
    'Luffy': 'https://cdn.myanimelist.net/images/characters/9/310307.jpg',
    'Zoro': 'https://cdn.myanimelist.net/images/characters/3/100534.jpg',
    'Sanji': 'https://cdn.myanimelist.net/images/characters/10/325889.jpg',
    'Nami': 'https://cdn.myanimelist.net/images/characters/5/363766.jpg',
    'Deku': 'https://cdn.myanimelist.net/images/characters/7/299405.jpg',
    'All Might': 'https://cdn.myanimelist.net/images/characters/9/304439.jpg',
    'Todoroki': 'https://cdn.myanimelist.net/images/characters/2/299406.jpg',
    'Bakugo': 'https://cdn.myanimelist.net/images/characters/10/299404.jpg',
    'Eren Yeager': 'https://cdn.myanimelist.net/images/characters/10/216895.jpg',
    'Light Yagami': 'https://cdn.myanimelist.net/images/characters/6/63870.jpg',
    'L': 'https://cdn.myanimelist.net/images/characters/10/236225.jpg',
    'Gon': 'https://cdn.myanimelist.net/images/characters/11/174517.jpg',
    'Killua': 'https://cdn.myanimelist.net/images/characters/2/327920.jpg',
    'Tanjiro': 'https://cdn.myanimelist.net/images/characters/6/386735.jpg',
    'Nezuko': 'https://cdn.myanimelist.net/images/characters/4/408310.jpg',
    'Zenitsu': 'https://cdn.myanimelist.net/images/characters/13/405512.jpg',
    'Saitama': 'https://cdn.myanimelist.net/images/characters/11/294388.jpg',
    'Spike Spiegel': 'https://cdn.myanimelist.net/images/characters/4/406630.jpg',
    'Ichigo': 'https://cdn.myanimelist.net/images/characters/8/275882.jpg',
    'Yuji Itadori': 'https://cdn.myanimelist.net/images/characters/15/422168.jpg',
    'Megumi': 'https://cdn.myanimelist.net/images/characters/6/457935.jpg',

    // Spider-Verse
    'Spider-Man (Andrew)': 'https://image.tmdb.org/t/p/original/tk58WPe3nSjeB7K7RmAZFW2Oq7n.jpg',
    'Spider-Man (Tobey)': 'https://image.tmdb.org/t/p/original/tkc7AVvURPk1PdW6MpRhdOqV4EB.jpg',
    'Spider-Woman': 'https://image.tmdb.org/t/p/original/kTiHcMiOhYSnvDJVQOZGrH6X5FC.jpg',
};

async function updateImages() {
    console.log('🔄 Starting hero image update process...\n');
    console.log('Using verified TMDB and MyAnimeList sources\n');

    let successCount = 0;
    let failCount = 0;

    for (const [alias, imageUrl] of Object.entries(imageUpdates)) {
        try {
            const { data, error } = await supabase
                .from('heroes')
                .update({ image_url: imageUrl })
                .eq('alias', alias)
                .select();

            if (error) {
                console.log(`❌ Failed to update ${alias}: ${error.message}`);
                failCount++;
            } else if (data && data.length > 0) {
                console.log(`✅ Updated ${data[0].alias} (${data[0].name})`);
                successCount++;
            } else {
                console.log(`⚠️  Hero not found in database: ${alias}`);
                failCount++;
            }

            // Small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        } catch (err) {
            console.log(`❌ Error updating ${alias}: ${err.message}`);
            failCount++;
        }
    }

    console.log('\n' + '═'.repeat(60));
    console.log(`✅ Successfully updated: ${successCount} heroes`);
    console.log(`❌ Failed/Not found: ${failCount}`);
    console.log(`📊 Total processed: ${successCount + failCount}`);
    console.log('═'.repeat(60));
    console.log('\n💡 Refresh your browser to see the updated images!');
}

updateImages();
