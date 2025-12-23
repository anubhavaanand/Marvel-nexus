const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function countHeroes() {
    const { data, error, count } = await supabase
        .from('heroes')
        .select('*', { count: 'exact' });

    if (error) {
        console.error(error);
        return;
    }

    console.log(`\n📊 Total Heroes in Database: ${count || data.length}\n`);

    // Count by franchise
    const franchises = {};
    data.forEach(h => {
        franchises[h.franchise] = (franchises[h.franchise] || 0) + 1;
    });

    console.log('By Franchise:');
    Object.entries(franchises).sort((a, b) => b[1] - a[1]).forEach(([name, count]) => {
        console.log(`  ${name}: ${count}`);
    });
}

countHeroes();
