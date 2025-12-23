const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local')
    console.log('\nPlease set:')
    console.log('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
    console.log('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const heroes = [
    // ========================================
    // MARVEL - MCU (8 heroes)
    // ========================================
    { name: "Tony Stark", alias: "Iron Man", franchise: "MCU", origin_world: "Earth-616", powers: ["Powered Armor", "Genius Intellect", "Flight", "Energy Projection"], weaknesses: ["Arc Reactor Dependency", "Ego"], image_url: "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg", is_locked_content: false },
    { name: "Steve Rogers", alias: "Captain America", franchise: "MCU", origin_world: "Earth-616", powers: ["Super Soldier Serum", "Vibranium Shield", "Enhanced Strength"], weaknesses: ["Idealism"], image_url: "https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg", is_locked_content: false },
    { name: "Thor Odinson", alias: "Thor", franchise: "MCU", origin_world: "Asgard", powers: ["Lightning Manipulation", "Mjolnir", "Superhuman Strength"], weaknesses: ["Arrogance"], image_url: "https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg", is_locked_content: false },
    { name: "Bruce Banner", alias: "Hulk", franchise: "MCU", origin_world: "Earth-616", powers: ["Superhuman Strength", "Healing Factor", "Durability"], weaknesses: ["Anger Control"], image_url: "https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg", is_locked_content: false },
    { name: "Natasha Romanoff", alias: "Black Widow", franchise: "MCU", origin_world: "Earth-616", powers: ["Master Spy", "Combat Expert", "Acrobatics"], weaknesses: ["Human Physiology"], image_url: "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg", is_locked_content: false },
    { name: "Wanda Maximoff", alias: "Scarlet Witch", franchise: "MCU", origin_world: "Earth-616", powers: ["Reality Warping", "Chaos Magic", "Telepathy"], weaknesses: ["Mental Instability"], image_url: "https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg", is_locked_content: false },
    { name: "T'Challa", alias: "Black Panther", franchise: "MCU", origin_world: "Earth-616", powers: ["Vibranium Suit", "Enhanced Strength", "Combat Expert"], weaknesses: ["Sonic Attacks"], image_url: "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg", is_locked_content: false },
    { name: "Peter Parker", alias: "Spider-Man", franchise: "MCU", origin_world: "Earth-616", powers: ["Spider-Sense", "Wall-Crawling", "Superhuman Strength"], weaknesses: ["Ethyl Chloride"], image_url: "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg", is_locked_content: false },

    // ========================================
    // MARVEL - X-Men (4 heroes)
    // ========================================
    { name: "Logan", alias: "Wolverine", franchise: "X-Men", origin_world: "Earth-10005", powers: ["Adamantium Claws", "Healing Factor", "Enhanced Senses"], weaknesses: ["Muramasa Blade"], image_url: "https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg", is_locked_content: false },
    { name: "Charles Xavier", alias: "Professor X", franchise: "X-Men", origin_world: "Earth-10005", powers: ["Telepathy", "Mind Control", "Psychic Powers"], weaknesses: ["Paralysis"], image_url: "https://image.tmdb.org/t/p/w500/dq8HeeAT9sthM6zhOq3LPq3ETMI.jpg", is_locked_content: false },
    { name: "Erik Lehnsherr", alias: "Magneto", franchise: "X-Men", origin_world: "Earth-10005", powers: ["Magnetism Control", "Metal Manipulation", "Flight"], weaknesses: ["Non-Metallic Materials"], image_url: "https://image.tmdb.org/t/p/w500/fII5lOAbXylCmQ95xG1w14n7mEA.jpg", is_locked_content: false },
    { name: "Wade Wilson", alias: "Deadpool", franchise: "X-Men", origin_world: "Earth-TRN414", powers: ["Healing Factor", "4th Wall Awareness", "Combat Expert"], weaknesses: ["Carbonadium"], image_url: "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg", is_locked_content: false },

    // ========================================
    // MARVEL - Spider-Verse (3 heroes)
    // ========================================
    { name: "Miles Morales", alias: "Spider-Man (Miles)", franchise: "Spider-Verse", origin_world: "Earth-1610", powers: ["Venom Strike", "Invisibility", "Spider-Sense"], weaknesses: ["Inexperience"], image_url: "https://image.tmdb.org/t/p/w500/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg", is_locked_content: false },
    { name: "Gwen Stacy", alias: "Spider-Woman", franchise: "Spider-Verse", origin_world: "Earth-65", powers: ["Spider-Sense", "Acrobatics", "Wall-Crawling"], weaknesses: ["Emotional Burden"], image_url: "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ber9.jpg", is_locked_content: false },
    { name: "Miguel O'Hara", alias: "Spider-Man 2099", franchise: "Spider-Verse", origin_world: "Earth-928", powers: ["Talons", "Accelerated Vision", "Organic Webbing"], weaknesses: ["Light Sensitivity"], image_url: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg", is_locked_content: false },

    // ========================================
    // DC UNIVERSE (18 heroes)
    // ========================================
    { name: "Bruce Wayne", alias: "Batman", franchise: "DC", origin_world: "Earth-Prime", powers: ["Peak Human Conditioning", "Genius Intellect", "Martial Arts Master"], weaknesses: ["No Superpowers", "Trauma"], image_url: "https://image.tmdb.org/t/p/w500/eP5NL7lCJRhSvohOL5Yb4D2LbI8.jpg", is_locked_content: false },
    { name: "Clark Kent", alias: "Superman", franchise: "DC", origin_world: "Krypton", powers: ["Super Strength", "Flight", "Heat Vision", "Invulnerability"], weaknesses: ["Kryptonite", "Magic"], image_url: "https://image.tmdb.org/t/p/w500/6Xw4IOLV0DlbyMVp0TINaAYXqbl.jpg", is_locked_content: false },
    { name: "Diana Prince", alias: "Wonder Woman", franchise: "DC", origin_world: "Themyscira", powers: ["Superhuman Strength", "Flight", "Combat Mastery", "Lasso of Truth"], weaknesses: ["Piercing Weapons"], image_url: "https://image.tmdb.org/t/p/w500/gfJGlDaHuWimErCr5Ql0I8x9QSy.jpg", is_locked_content: false },
    { name: "Barry Allen", alias: "The Flash", franchise: "DC", origin_world: "Earth-Prime", powers: ["Super Speed", "Time Travel", "Speed Force"], weaknesses: ["Cold Temperatures"], image_url: "https://image.tmdb.org/t/p/w500/lJA2RCMfsWoskqlQhXPSLFQGXEJ.jpg", is_locked_content: false },
    { name: "Arthur Curry", alias: "Aquaman", franchise: "DC", origin_world: "Atlantis", powers: ["Underwater Breathing", "Super Strength", "Telepathy with Sea Life"], weaknesses: ["Dehydration"], image_url: "https://image.tmdb.org/t/p/w500/ZoRNzGK0yzBrspDqxpSJQmT9haJ.jpg", is_locked_content: false },
    { name: "Victor Stone", alias: "Cyborg", franchise: "DC", origin_world: "Earth-Prime", powers: ["Cybernetic Enhancement", "Technopathy", "Super Strength"], weaknesses: ["EMP", "Hacking"], image_url: "https://image.tmdb.org/t/p/w500/iLgMMQqTfxfLAbVHjpK6Qf1dQKn.jpg", is_locked_content: false },
    { name: "Dick Grayson", alias: "Nightwing", franchise: "DC", origin_world: "Earth-Prime", powers: ["Peak Human Conditioning", "Acrobatics Master", "Escrima Sticks"], weaknesses: ["Human Physiology"], image_url: "https://image.tmdb.org/t/p/w500/n9p9b0Vxg5v5lRJjcq9UqXfqLjH.jpg", is_locked_content: false },
    { name: "Jason Todd", alias: "Red Hood", franchise: "DC", origin_world: "Earth-Prime", powers: ["Combat Expert", "Marksmanship", "Resurrection"], weaknesses: ["Rage"], image_url: "https://image.tmdb.org/t/p/w500/qUxUqRWaJYjVSwlv6EXWxXdEJrN.jpg", is_locked_content: false },
    { name: "Barbara Gordon", alias: "Batgirl", franchise: "DC", origin_world: "Earth-Prime", powers: ["Genius Intellect", "Martial Arts", "Hacking"], weaknesses: ["Human Physiology"], image_url: "https://image.tmdb.org/t/p/w500/rZvDKC9BAWVlPr6LWYsFgbRQ0R9.jpg", is_locked_content: false },
    { name: "Hal Jordan", alias: "Green Lantern", franchise: "DC", origin_world: "Earth-Prime", powers: ["Power Ring", "Construct Creation", "Flight"], weaknesses: ["Willpower Dependency"], image_url: "https://image.tmdb.org/t/p/w500/fj21HwUprqyeeQKiYPBS3F3BBJG.jpg", is_locked_content: false },
    { name: "Billy Batson", alias: "Shazam", franchise: "DC", origin_world: "Earth-Prime", powers: ["Wisdom of Solomon", "Strength of Hercules", "Power of Zeus"], weaknesses: ["Must Say Shazam"], image_url: "https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg", is_locked_content: false },
    { name: "Kara Zor-El", alias: "Supergirl", franchise: "DC", origin_world: "Krypton", powers: ["Super Strength", "Flight", "Heat Vision", "Freeze Breath"], weaknesses: ["Kryptonite"], image_url: "https://image.tmdb.org/t/p/w500/zsaiq8ZclPuneuN7loLEbsh1ANI.jpg", is_locked_content: false },
    { name: "John Constantine", alias: "Constantine", franchise: "DC", origin_world: "Earth-Prime", powers: ["Magic", "Occult Knowledge", "Demon Summoning"], weaknesses: ["Mortality", "Guilt"], image_url: "https://image.tmdb.org/t/p/w500/4y3eEp4e91UV1xaTPNmIvZi5TP9.jpg", is_locked_content: false },
    { name: "Teth-Adam", alias: "Black Adam", franchise: "DC", origin_world: "Kahndaq", powers: ["Strength of Amon", "Speed of Heru", "Power of Aton"], weaknesses: ["Must Say Shazam", "Rage"], image_url: "https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJi7Mz2F2.jpg", is_locked_content: false },
    { name: "Harleen Quinzel", alias: "Harley Quinn", franchise: "DC", origin_world: "Earth-Prime", powers: ["Gymnastics", "Combat Skills", "Immunity to Toxins"], weaknesses: ["Impulsiveness"], image_url: "https://image.tmdb.org/t/p/w500/5cjaWVcoHl3dB2rL4i1ThV2Nonu.jpg", is_locked_content: false },
    { name: "Rachel Roth", alias: "Raven", franchise: "DC", origin_world: "Azarath", powers: ["Dark Magic", "Empathy", "Soul-Self Projection"], weaknesses: ["Emotional Control"], image_url: "https://image.tmdb.org/t/p/w500/4mSbhNgKIzXPWFVsSkRZKKhPYMC.jpg", is_locked_content: false },
    { name: "Koriand'r", alias: "Starfire", franchise: "DC", origin_world: "Tamaran", powers: ["Starbolts", "Flight", "Super Strength"], weaknesses: ["Emotional Vulnerability"], image_url: "https://image.tmdb.org/t/p/w500/d8K8xNvH2uf3KbhVbBbEj1f2vYE.jpg", is_locked_content: false },
    { name: "Garfield Logan", alias: "Beast Boy", franchise: "DC", origin_world: "Earth-Prime", powers: ["Animal Shapeshifting", "Enhanced Senses"], weaknesses: ["Genetic Instability"], image_url: "https://image.tmdb.org/t/p/w500/3hGLU2HtXMzp8q5vY1GHyqj5nj1.jpg", is_locked_content: false },

    // ========================================
    // ANIME HEROES (18 heroes)
    // ========================================
    { name: "Toshinori Yagi", alias: "All Might", franchise: "Anime", origin_world: "MHA Universe", powers: ["One For All", "Super Strength", "Super Speed"], weaknesses: ["Time Limit", "Injury"], image_url: "https://image.tmdb.org/t/p/w500/7XbPfvMfN6R41wv6YwC0R0pJdpZ.jpg", is_locked_content: false },
    { name: "Izuku Midoriya", alias: "Deku", franchise: "Anime", origin_world: "MHA Universe", powers: ["One For All", "Blackwhip", "Float"], weaknesses: ["Body Strain"], image_url: "https://image.tmdb.org/t/p/w500/8aSFLF5rJlFQ0CJLSv2XB4hLkOD.jpg", is_locked_content: false },
    { name: "Katsuki Bakugo", alias: "Dynamight", franchise: "Anime", origin_world: "MHA Universe", powers: ["Explosion Quirk", "Combat Expertise"], weaknesses: ["Anger Issues"], image_url: "https://image.tmdb.org/t/p/w500/qEU3Lq3evgMbkKAM1R0CprDRVD2.jpg", is_locked_content: false },
    { name: "Shoto Todoroki", alias: "Shoto", franchise: "Anime", origin_world: "MHA Universe", powers: ["Half-Cold Half-Hot", "Ice Creation", "Fire Control"], weaknesses: ["Family Trauma"], image_url: "https://image.tmdb.org/t/p/w500/opbxnZ8zHKMT8EKUBnYwHdKqbX.jpg", is_locked_content: false },
    { name: "Son Goku", alias: "Goku", franchise: "Anime", origin_world: "Planet Vegeta", powers: ["Ultra Instinct", "Kamehameha", "Super Saiyan"], weaknesses: ["Overconfidence"], image_url: "https://image.tmdb.org/t/p/w500/5dYBKVq8Tn3k0L4oLVE9fWjuQT8.jpg", is_locked_content: false },
    { name: "Vegeta", alias: "Prince Vegeta", franchise: "Anime", origin_world: "Planet Vegeta", powers: ["Ultra Ego", "Final Flash", "Super Saiyan Blue"], weaknesses: ["Pride"], image_url: "https://image.tmdb.org/t/p/w500/6IPvlNk5cRnqDmZFQLDmBQxY8PS.jpg", is_locked_content: false },
    { name: "Son Gohan", alias: "Gohan", franchise: "Anime", origin_world: "Earth (DB)", powers: ["Beast Form", "Masenko", "Potential Unleashed"], weaknesses: ["Pacifist Nature"], image_url: "https://image.tmdb.org/t/p/w500/d8mFxCXDq5IMBJsDxLQMjr5uQc8.jpg", is_locked_content: false },
    { name: "Naruto Uzumaki", alias: "Naruto", franchise: "Anime", origin_world: "Hidden Leaf Village", powers: ["Sage Mode", "Rasengan", "Nine-Tails Chakra"], weaknesses: ["Chakra Depletion"], image_url: "https://image.tmdb.org/t/p/w500/vauCEnR7CiyBDzRCD8y8QgVQPB1.jpg", is_locked_content: false },
    { name: "Sasuke Uchiha", alias: "Sasuke", franchise: "Anime", origin_world: "Hidden Leaf Village", powers: ["Sharingan", "Rinnegan", "Chidori"], weaknesses: ["Vengeance"], image_url: "https://image.tmdb.org/t/p/w500/8ZO9uNrMEqsVuqpD3bHGCdDmLqU.jpg", is_locked_content: false },
    { name: "Kakashi Hatake", alias: "Copy Ninja Kakashi", franchise: "Anime", origin_world: "Hidden Leaf Village", powers: ["Sharingan", "Lightning Blade", "1000 Jutsu"], weaknesses: ["Chakra Exhaustion"], image_url: "https://image.tmdb.org/t/p/w500/qfVTqA0ZBjLQnLnXq0V8cMM4TAr.jpg", is_locked_content: false },
    { name: "Saitama", alias: "One Punch Man", franchise: "Anime", origin_world: "OPM Universe", powers: ["Limitless Strength", "Invulnerability", "Super Speed"], weaknesses: ["Boredom"], image_url: "https://image.tmdb.org/t/p/w500/6UB1wnJBXRu2zlS8haK0JgTfMU7.jpg", is_locked_content: false },
    { name: "Genos", alias: "Demon Cyborg", franchise: "Anime", origin_world: "OPM Universe", powers: ["Cybernetic Enhancement", "Incineration Cannons"], weaknesses: ["Core Damage"], image_url: "https://image.tmdb.org/t/p/w500/1CL7u5P9eYk2IzxS7pQjz0SrCmr.jpg", is_locked_content: false },
    { name: "Tanjiro Kamado", alias: "Tanjiro", franchise: "Anime", origin_world: "Demon Slayer Universe", powers: ["Sun Breathing", "Enhanced Smell", "Water Breathing"], weaknesses: ["Human Limits"], image_url: "https://image.tmdb.org/t/p/w500/wrCVHdkBlBWdJUZPvnJWcBRuhhs.jpg", is_locked_content: false },
    { name: "Zenitsu Agatsuma", alias: "Zenitsu", franchise: "Anime", origin_world: "Demon Slayer Universe", powers: ["Thunder Breathing", "Enhanced Hearing", "Godspeed"], weaknesses: ["Cowardice"], image_url: "https://image.tmdb.org/t/p/w500/z6lBsdls6Y0qZ2qb93s0xDAGv2l.jpg", is_locked_content: false },
    { name: "Eren Yeager", alias: "Attack Titan", franchise: "Anime", origin_world: "Paradis Island", powers: ["Titan Shifting", "Founding Titan", "Hardening"], weaknesses: ["Mortality"], image_url: "https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg", is_locked_content: false },
    { name: "Levi Ackerman", alias: "Captain Levi", franchise: "Anime", origin_world: "Underground City", powers: ["Ackerman Power", "ODM Mastery", "Superhuman Speed"], weaknesses: ["Injuries"], image_url: "https://image.tmdb.org/t/p/w500/8UVOeJRIBLqH1GvXDJnOQMrw8U.jpg", is_locked_content: false },
    { name: "Satoru Gojo", alias: "Gojo Sensei", franchise: "Anime", origin_world: "JJK Universe", powers: ["Infinity", "Six Eyes", "Limitless"], weaknesses: ["Sealing"], image_url: "https://image.tmdb.org/t/p/w500/hGN4hvzCAslLzKLdpNxzVvlJfxt.jpg", is_locked_content: false },
    { name: "Yuji Itadori", alias: "Itadori", franchise: "Anime", origin_world: "JJK Universe", powers: ["Superhuman Strength", "Sukuna Vessel", "Divergent Fist"], weaknesses: ["Sukuna Control"], image_url: "https://image.tmdb.org/t/p/w500/jG8DDJ4P3f0q5DWO0xn2uH7KwFj.jpg", is_locked_content: false },
]

async function seed() {
    console.log("🚀 Starting Multiverse Archive database seeding...")
    console.log("📍 Database URL:", supabaseUrl)
    console.log(`📊 Total heroes to seed: ${heroes.length}`)
    console.log("")

    // Clear existing data first
    console.log("🧹 Clearing existing heroes...")
    await supabase.from('canon_events').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('heroes').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Seed Heroes
    console.log("🦸 Seeding heroes...")
    const { data: heroData, error: heroError } = await supabase
        .from('heroes')
        .insert(heroes)
        .select()

    if (heroError) {
        console.error("❌ Error seeding heroes:", heroError.message)
        return
    }

    console.log(`✅ Successfully seeded ${heroData?.length || 0} heroes!`)

    // Count by franchise
    const counts = {
        MCU: heroes.filter(h => h.franchise === 'MCU').length,
        'X-Men': heroes.filter(h => h.franchise === 'X-Men').length,
        'Spider-Verse': heroes.filter(h => h.franchise === 'Spider-Verse').length,
        DC: heroes.filter(h => h.franchise === 'DC').length,
        Anime: heroes.filter(h => h.franchise === 'Anime').length,
    }
    console.log("\n📊 Heroes by franchise:")
    Object.entries(counts).forEach(([franchise, count]) => {
        console.log(`   ${franchise}: ${count}`)
    })

    console.log("\n🎉 Database seeding complete!")
    console.log("🌐 Refresh your browser to see the heroes!")
}

seed().catch(console.error)
