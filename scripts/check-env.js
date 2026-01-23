const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Supabase Environment Variables...\n');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('NEXT_PUBLIC_SUPABASE_URL:', url ? '✅ Set' : '❌ Missing');
console.log('  Value:', url || 'undefined');

console.log('\nSUPABASE_SERVICE_ROLE_KEY:', serviceKey ? '✅ Set' : '❌ Missing');
console.log('  Value:', serviceKey ? `${serviceKey.substring(0, 20)}...` : 'undefined');

console.log('\nNEXT_PUBLIC_SUPABASE_ANON_KEY:', anonKey ? '✅ Set' : '❌ Missing');
console.log('  Value:', anonKey ? `${anonKey.substring(0, 20)}...` : 'undefined');

console.log('\n' + '='.repeat(60));

if (!url || !url.includes('supabase.co')) {
    console.log('❌ URL appears invalid or missing');
    console.log('\n💡 Your URL should look like:');
    console.log('   https://YOUR_PROJECT.supabase.co');
} else {
    console.log('✅ URL format looks correct');

    // Try to create client
    try {
        const supabase = createClient(url, serviceKey || anonKey);
        console.log('✅ Supabase client created successfully');

        // Try a simple query
        console.log('\n🔄 Testing database connection...');
        supabase.from('heroes').select('count').limit(1).then(({ data, error }) => {
            if (error) {
                console.log('❌ Connection test failed:', error.message);
                console.log('\n💡 This could mean:');
                console.log('   1. Database/project has been deleted');
                console.log('   2. Invalid credentials');
                console.log('   3. Network/firewall issue');
            } else {
                console.log('✅ Connection successful!');
            }
        });
    } catch (err) {
        console.log('❌ Failed to create client:', err.message);
    }
}
