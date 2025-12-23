const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkHeroes() {
    const { data, error } = await supabase
        .from('heroes')
        .select('name, alias, franchise');

    if (error) {
        console.error(error);
        return;
    }

    console.log("--- HEROES IN DB ---");
    data.forEach(h => console.log(`${h.alias} [${h.franchise}]`));

    const pm = data.filter(h => h.franchise === 'Peacemaker');
    console.log(`\nTotal Peacemaker Heroes: ${pm.length}`);
}

checkHeroes();
