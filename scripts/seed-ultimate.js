const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const guard = require('./seed-guard')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

// THE ULTIMATE MASTER LIST
const heroes = [
  // ==========================================
  // MARVEL - MCU
  // ==========================================
  {
    alias: 'Iron Man',
    name: 'Tony Stark',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg',
    powers: ['Powered Armor', 'Genius', 'Flight'],
    weaknesses: ['Ego', 'Arc Reactor'],
    is_locked_content: false,
  },
  {
    alias: 'Captain America',
    name: 'Steve Rogers',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg',
    powers: ['Super Soldier', 'Shield', 'Tactician'],
    weaknesses: ['Time Displacement'],
    is_locked_content: false,
  },
  {
    alias: 'Thor',
    name: 'Thor Odinson',
    franchise: 'MCU',
    origin_world: 'Asgard',
    image_url: 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg',
    powers: ['God of Thunder', 'Mjolnir'],
    weaknesses: ['Pride'],
    is_locked_content: false,
  },
  {
    alias: 'Hulk',
    name: 'Bruce Banner',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg',
    powers: ['Super Strength', 'Regen'],
    weaknesses: ['Rage'],
    is_locked_content: false,
  },
  {
    alias: 'Black Widow',
    name: 'Natasha Romanoff',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg',
    powers: ['Master Spy', 'Martial Arts'],
    weaknesses: ['Human'],
    is_locked_content: false,
  },
  {
    alias: 'Hawkeye',
    name: 'Clint Barton',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/eYguDsGeqB4jKLnbdDqKpQQW88K.jpg',
    powers: ['Master Archer', 'Accuracy'],
    weaknesses: ['Hearing Loss'],
    is_locked_content: false,
  },
  {
    alias: 'Doctor Strange',
    name: 'Stephen Strange',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg',
    powers: ['Sorcery', 'Time Stone'],
    weaknesses: ['Arrogance'],
    is_locked_content: true,
  },
  {
    alias: 'Scarlet Witch',
    name: 'Wanda Maximoff',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    powers: ['Chaos Magic', 'Reality Warping'],
    weaknesses: ['Trauma'],
    is_locked_content: true,
  },
  {
    alias: 'Spider-Man',
    name: 'Peter Parker',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
    powers: ['Spider-Sense', 'Webs'],
    weaknesses: ['Responsibility'],
    is_locked_content: false,
  },
  {
    alias: 'Black Panther',
    name: "T'Challa",
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg',
    powers: ['Vibranium Suit', 'Super Strength'],
    weaknesses: ['Tradition'],
    is_locked_content: false,
  },
  {
    alias: 'Ant-Man',
    name: 'Scott Lang',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/8Y4rCZLRkjQbY1fOQ1hLyeGs12e.jpg',
    powers: ['Shrinking', 'Growing'],
    weaknesses: ['Suit Damage'],
    is_locked_content: false,
  },
  {
    alias: 'Star-Lord',
    name: 'Peter Quill',
    franchise: 'MCU',
    origin_world: 'Earth-616',
    image_url: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhvd.jpg',
    powers: ['Pilot', 'Gadgets', 'Celestial DNA'],
    weaknesses: ['Music', 'Emotional'],
    is_locked_content: false,
  },
  {
    alias: 'Loki',
    name: 'Loki Laufeyson',
    franchise: 'MCU',
    origin_world: 'Asgard',
    image_url: 'https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg',
    powers: ['Illusions', 'Trickery'],
    weaknesses: ['Trust'],
    is_locked_content: false,
  },
  {
    alias: 'Thanos',
    name: 'Thanos',
    franchise: 'MCU',
    origin_world: 'Titan',
    image_url: 'https://image.tmdb.org/t/p/w500/wgQ7APnFpf1TuviKHXeEe3KnsTV.jpg',
    powers: ['Power', 'Will'],
    weaknesses: ['Arrogance'],
    is_locked_content: true,
  },

  // ==========================================
  // MARVEL - X-MEN & SPIDER-VERSE
  // ==========================================
  {
    alias: 'Wolverine',
    name: 'Logan',
    franchise: 'X-Men',
    origin_world: 'Earth-10005',
    image_url: 'https://image.tmdb.org/t/p/w500/fnbjcRDYn6YviCcePDnGdyAkYsB.jpg',
    powers: ['Healing', 'Claws'],
    weaknesses: ['Magnets'],
    is_locked_content: false,
  },
  {
    alias: 'Deadpool',
    name: 'Wade Wilson',
    franchise: 'X-Men',
    origin_world: 'Earth-TRN414',
    image_url: 'https://image.tmdb.org/t/p/w500/fSRb7vyIP8rQpL0I47P3qUsEKX3.jpg',
    powers: ['Immortal', '4th Wall Break'],
    weaknesses: ['Insane'],
    is_locked_content: false,
  },
  {
    alias: 'Professor X',
    name: 'Charles Xavier',
    franchise: 'X-Men',
    origin_world: 'Earth-10005',
    image_url: 'https://image.tmdb.org/t/p/w500/dq8HeeAT9sthM6zhOq3LPq3ETMI.jpg',
    powers: ['Telepathy'],
    weaknesses: ['Spine'],
    is_locked_content: false,
  },
  {
    alias: 'Magneto',
    name: 'Erik Lehnsherr',
    franchise: 'X-Men',
    origin_world: 'Earth-10005',
    image_url: 'https://image.tmdb.org/t/p/w500/fII5lOAbXylCmQ95xG1w14n7mEA.jpg',
    powers: ['Magnetism'],
    weaknesses: ['Wood'],
    is_locked_content: false,
  },
  {
    alias: 'Miles Morales',
    name: 'Miles Morales',
    franchise: 'Spider-Verse',
    origin_world: 'Earth-1610',
    image_url: 'https://image.tmdb.org/t/p/w500/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    powers: ['Venom Strike', 'Invisibility'],
    weaknesses: ['Inexperience'],
    is_locked_content: false,
  },
  {
    alias: 'Spider-Woman',
    name: 'Gwen Stacy',
    franchise: 'Spider-Verse',
    origin_world: 'Earth-65',
    image_url: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ber9.jpg',
    powers: ['Grace', 'Webs'],
    weaknesses: ['Police'],
    is_locked_content: false,
  },
  {
    alias: 'Spider-Man 2099',
    name: "Miguel O'Hara",
    franchise: 'Spider-Verse',
    origin_world: 'Earth-928',
    image_url: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    powers: ['Talons', 'Tech'],
    weaknesses: ['Canon'],
    is_locked_content: false,
  },

  // ==========================================
  // DC UNIVERSE
  // ==========================================
  {
    alias: 'Batman',
    name: 'Bruce Wayne',
    franchise: 'DC',
    origin_world: 'Gotham',
    image_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    powers: ['Wealth', 'Genius', 'Fear'],
    weaknesses: ['Trauma'],
    is_locked_content: false,
  },
  {
    alias: 'Superman',
    name: 'Clark Kent',
    franchise: 'DC',
    origin_world: 'Krypton',
    image_url: 'https://image.tmdb.org/t/p/w500/d7px1FQxW4tngaeCCk4CUPVjtHJ.jpg',
    powers: ['God-like'],
    weaknesses: ['Kryptonite'],
    is_locked_content: false,
  },
  {
    alias: 'Wonder Woman',
    name: 'Diana Prince',
    franchise: 'DC',
    origin_world: 'Themyscira',
    image_url: 'https://image.tmdb.org/t/p/w500/imekS7f1OuHyUP2LAiMH0Nz81h.jpg',
    powers: ['Warrior', 'Lasso'],
    weaknesses: ['Binding'],
    is_locked_content: false,
  },
  {
    alias: 'The Flash',
    name: 'Barry Allen',
    franchise: 'DC',
    origin_world: 'Central City',
    image_url: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg',
    powers: ['Speed Force'],
    weaknesses: ['Cold'],
    is_locked_content: false,
  },
  {
    alias: 'Aquaman',
    name: 'Arthur Curry',
    franchise: 'DC',
    origin_world: 'Atlantis',
    image_url: 'https://image.tmdb.org/t/p/w500/xLPffWMhMj1l50ND3KchMjYoKmE.jpg',
    powers: ['Ocean King'],
    weaknesses: ['Dry Land'],
    is_locked_content: false,
  },
  {
    alias: 'Cyborg',
    name: 'Victor Stone',
    franchise: 'DC',
    origin_world: 'Detroit',
    image_url: 'https://image.tmdb.org/t/p/w500/iLgMMQqTfxfLAbVHjpK6Qf1dQKn.jpg',
    powers: ['Technopathy'],
    weaknesses: ['EMP'],
    is_locked_content: false,
  },
  {
    alias: 'Green Lantern',
    name: 'Hal Jordan',
    franchise: 'DC',
    origin_world: 'Coast City',
    image_url: 'https://image.tmdb.org/t/p/w500/fj21HwUprqyeeQKiYPBS3F3BBJG.jpg',
    powers: ['Willpower'],
    weaknesses: ['Fear'],
    is_locked_content: false,
  },
  {
    alias: 'Nightwing',
    name: 'Dick Grayson',
    franchise: 'DC',
    origin_world: 'Blüdhaven',
    image_url: 'https://image.tmdb.org/t/p/w500/3NTEMlGjq0Fv0qVj5uY23O7qE7r.jpg',
    powers: ['Acrobatics'],
    weaknesses: ['Human'],
    is_locked_content: false,
  },
  {
    alias: 'Joker',
    name: 'Unknown',
    franchise: 'DC',
    origin_world: 'Gotham',
    image_url: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8EkGsdr7ZVqe1jy.jpg',
    powers: ['Chaos'],
    weaknesses: ['Bats'],
    is_locked_content: true,
  },
  {
    alias: 'Harley Quinn',
    name: 'Harleen Quinzel',
    franchise: 'DC',
    origin_world: 'Gotham',
    image_url: 'https://image.tmdb.org/t/p/w500/5cjaWVcoHl3dB2rL4i1ThV2Nonu.jpg',
    powers: ['Unpredictable'],
    weaknesses: ['Joker'],
    is_locked_content: false,
  },
  {
    alias: 'Shazam',
    name: 'Billy Batson',
    franchise: 'DC',
    origin_world: 'Philly',
    image_url: 'https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg',
    powers: ['Magic Word'],
    weaknesses: ['Child Form'],
    is_locked_content: false,
  },
  {
    alias: 'Black Adam',
    name: 'Teth-Adam',
    franchise: 'DC',
    origin_world: 'Kahndaq',
    image_url: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJi7Mz2F2.jpg',
    powers: ['Anti-Hero'],
    weaknesses: ['Rage'],
    is_locked_content: false,
  },

  // ==========================================
  // THE BOYS (Character Portraits)
  // ==========================================
  {
    alias: 'Homelander',
    name: 'John',
    franchise: 'The Boys',
    origin_world: 'Vought',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/d/d4/Homelander_S3_promotional_photo.jpg/revision/latest?cb=20220603184941',
    powers: ['God Complex'],
    weaknesses: ['Ego'],
    is_locked_content: false,
  },
  {
    alias: 'Butcher',
    name: 'Billy Butcher',
    franchise: 'The Boys',
    origin_world: 'London',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/3/36/Billy_Butcher_S3_promo.jpg/revision/latest?cb=20220603185348',
    powers: ['Brutality'],
    weaknesses: ['Ryan'],
    is_locked_content: false,
  },
  {
    alias: 'Starlight',
    name: 'Annie January',
    franchise: 'The Boys',
    origin_world: 'Vought',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/c/c5/Starlight_S3_promo.jpg/revision/latest?cb=20220603185526',
    powers: ['Light'],
    weaknesses: ['Power Source'],
    is_locked_content: false,
  },
  {
    alias: 'Soldier Boy',
    name: 'Ben',
    franchise: 'The Boys',
    origin_world: 'Vought',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/0/0c/Soldier_Boy_S3.jpg/revision/latest?cb=20220610141630',
    powers: ['Radiation'],
    weaknesses: ['PTSD'],
    is_locked_content: true,
  },
  {
    alias: 'A-Train',
    name: 'Reggie Franklin',
    franchise: 'The Boys',
    origin_world: 'Vought',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/9/9d/A-Train_S3_promo.jpg/revision/latest?cb=20220603185635',
    powers: ['Speed'],
    weaknesses: ['Heart'],
    is_locked_content: false,
  },
  {
    alias: 'Queen Maeve',
    name: 'Maggie Shaw',
    franchise: 'The Boys',
    origin_world: 'Vought',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/a/a3/Queen_Maeve_S3_promo.jpg/revision/latest?cb=20220603185442',
    powers: ['Strength'],
    weaknesses: ['Burnout'],
    is_locked_content: false,
  },
  {
    alias: 'Black Noir',
    name: 'Earving',
    franchise: 'The Boys',
    origin_world: 'Vought',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/7/76/Black_Noir_S3_promo.jpg/revision/latest?cb=20220603185734',
    powers: ['Stealth'],
    weaknesses: ['Nuts'],
    is_locked_content: false,
  },
  {
    alias: 'The Deep',
    name: 'Kevin',
    franchise: 'The Boys',
    origin_world: 'Vought',
    image_url:
      'https://static.wikia.nocookie.net/the-boys/images/4/4e/The_Deep_S3_promo.jpg/revision/latest?cb=20220603185824',
    powers: ['Fish Talk'],
    weaknesses: ['Gills'],
    is_locked_content: false,
  },

  // ==========================================
  // PEACEMAKER
  // ==========================================
  {
    alias: 'Peacemaker',
    name: 'Chris Smith',
    franchise: 'Peacemaker',
    origin_world: 'DCEU',
    image_url: 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
    powers: ['Guns', 'Dance'],
    weaknesses: ['Daddy Issues'],
    is_locked_content: false,
  },
  {
    alias: 'Vigilante',
    name: 'Adrian Chase',
    franchise: 'Peacemaker',
    origin_world: 'DCEU',
    image_url: 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
    powers: ['Regen', 'Sniper'],
    weaknesses: ['Awsward'],
    is_locked_content: false,
  },
  {
    alias: 'Judomaster',
    name: 'Judomaster',
    franchise: 'Peacemaker',
    origin_world: 'DCEU',
    image_url: 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
    powers: ['Martial Arts'],
    weaknesses: ['Snacks'],
    is_locked_content: false,
  },
  {
    alias: 'Eagly',
    name: 'Eagly',
    franchise: 'Peacemaker',
    origin_world: 'DCEU',
    image_url: 'https://image.tmdb.org/t/p/w500/hE3LRIbFuzJA45kuf5BaEwooY5I.jpg',
    powers: ['Flight', 'Claws'],
    weaknesses: ['Bird'],
    is_locked_content: false,
  },

  // ==========================================
  // ANIME
  // ==========================================
  {
    alias: 'Luffy',
    name: 'Monkey D. Luffy',
    franchise: 'Anime',
    origin_world: 'One Piece',
    image_url: 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
    powers: ['Rubber'],
    weaknesses: ['Water'],
    is_locked_content: false,
  },
  {
    alias: 'Zoro',
    name: 'Roronoa Zoro',
    franchise: 'Anime',
    origin_world: 'One Piece',
    image_url: 'https://image.tmdb.org/t/p/w500/fcXdJlbSdUEeMSJFsXKSznpjOVy.jpg',
    powers: ['Swords'],
    weaknesses: ['Directions'],
    is_locked_content: false,
  },
  {
    alias: 'Goku',
    name: 'Kakarot',
    franchise: 'Anime',
    origin_world: 'Dragon Ball',
    image_url: 'https://image.tmdb.org/t/p/w500/5dYBKVq8Tn3k0L4oLVE9fWjuQT8.jpg',
    powers: ['Saiyan'],
    weaknesses: ['Hunger'],
    is_locked_content: false,
  },
  {
    alias: 'Naruto',
    name: 'Naruto Uzumaki',
    franchise: 'Anime',
    origin_world: 'Naruto',
    image_url: 'https://image.tmdb.org/t/p/w500/2DZ0yqa0a8uSfbzM48t22nZqK0j.jpg',
    powers: ['Hokage'],
    weaknesses: ['Ramen'],
    is_locked_content: false,
  },
  {
    alias: 'Saitama',
    name: 'One Punch Man',
    franchise: 'Anime',
    origin_world: 'OPM',
    image_url: 'https://image.tmdb.org/t/p/w500/iE3s0lG5QVdEHOEZnoAxjmMtvnc.jpg',
    powers: ['Punch'],
    weaknesses: ['Bored'],
    is_locked_content: false,
  },
  {
    alias: 'Eren Yeager',
    name: 'Eren Yeager',
    franchise: 'Anime',
    origin_world: 'AOT',
    image_url: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    powers: ['Titan'],
    weaknesses: ['Freedom'],
    is_locked_content: true,
  },
]

async function seedUltimate() {
  console.log('🚀 Starting ULTIMATE MASTER SEED process...')

  const flags = guard.parseArgs(process.argv.slice(2))

  // 1. WIPE EVERYTHING — destructive, requires explicit opt-in
  if (!flags.confirm) {
    console.log('')
    console.log('⚠️  seed-ultimate.js — full database reseed (DESTRUCTIVE)')
    console.log('')
    console.log('This script will:')
    console.log('   🗑️  DELETE all existing rows from heroes')
    console.log('   ✅  Insert heroes from the ultimate list')
    console.log('')
    console.log('To proceed, re-run with --confirm:')
    console.log('   node scripts/seed-ultimate.js --confirm')
    console.log('   OR set SEED_CONFIRM=1 in your environment')
    process.exit(1)
  }

  console.log('🗑️  Clearing existing heroes...')
  const { error: deleteError } = await supabase
    .from('heroes')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) {
    console.error('❌ Error wiping DB:', deleteError.message)
    return
  }

  // 2. INSERT EVERYONE
  console.log(`🌱 Seeding ${heroes.length} heroes...`)
  let count = 0
  for (const hero of heroes) {
    const { error } = await supabase.from('heroes').insert(hero)
    if (error) {
      console.error(`❌ Failed: ${hero.alias} - ${error.message}`)
    } else {
      console.log(`✅ ${hero.alias}`)
      count++
    }
  }

  console.log(`\n🎉 ULTIMATE SEED COMPLETE! Restored ${count}/${heroes.length} heroes.`)
}

seedUltimate()
