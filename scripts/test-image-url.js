const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * VERIFIED IMAGE URL TESTER
 * This script helps you test image URLs BEFORE adding them to heroes
 * Run: node scripts/test-image-url.js "https://your-image-url.jpg"
 */

async function testImageURL(url) {
    console.log(`\n🔍 Testing Image URL...`);
    console.log(`URL: ${url}\n`);

    try {
        const response = await fetch(url, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Multiverse Archive/1.0)'
            }
        });

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            const contentLength = response.headers.get('content-length');

            console.log(`✅ Image URL is VALID!`);
            console.log(`📄 Content Type: ${contentType}`);
            console.log(`📦 Size: ${(parseInt(contentLength) / 1024).toFixed(2)} KB`);
            console.log(`\n✨ Safe to use!`);
            return true;
        } else {
            console.log(`❌ Image URL FAILED!`);
            console.log(`Status: ${response.status} ${response.statusText}`);
            console.log(`\n⚠️  Do NOT use this URL!`);
            return false;
        }
    } catch (error) {
        console.log(`❌ Error testing URL: ${error.message}`);
        console.log(`\n⚠️  Do NOT use this URL!`);
        return false;
    }
}

// Get URL from command line argument
const testUrl = process.argv[2];

if (!testUrl) {
    console.log(`
📖 Usage:
   node scripts/test-image-url.js "https://image-url.jpg"

📝 Example:
   node scripts/test-image-url.js "https://image.tmdb.org/t/p/w500/abc123.jpg"

💡 Test your image URLs BEFORE adding heroes!
`);
    process.exit(1);
}

testImageURL(testUrl);
