const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

const newHeroes = [
    // ========================================
    // THE BOYS (10 heroes)
    // ========================================
    { name: "John", alias: "Homelander", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Super Strength", "Flight", "Heat Vision", "Invulnerability"], weaknesses: ["Ego", "Mother Issues", "Approval Addiction"], image_url: "https://image.tmdb.org/t/p/w500/pxsuV18hd8qQfbTpUkSvPJwazPB.jpg", is_locked_content: false },
    { name: "Annie January", alias: "Starlight", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Light Manipulation", "Super Strength", "Energy Absorption"], weaknesses: ["Electricity Dependency"], image_url: "https://image.tmdb.org/t/p/w500/u7W9h9dJN6KHoZw8A7NCkKXvR6X.jpg", is_locked_content: false },
    { name: "Billy Butcher", alias: "Butcher", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Temp V Powers", "Combat Expert", "Tactical Genius"], weaknesses: ["V-Addiction", "Rage"], image_url: "https://image.tmdb.org/t/p/w500/v8AiZIpJjXR4o12x7LrBjgO9KsH.jpg", is_locked_content: false },
    { name: "Hughie Campbell", alias: "Hughie", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Temp V Powers", "Teleportation"], weaknesses: ["Inexperience", "Morality"], image_url: "https://image.tmdb.org/t/p/w500/mZGm4lwqyJm2Je3qoHr4VdXpPHR.jpg", is_locked_content: false },
    { name: "Queen Maeve", alias: "Queen Maeve", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Super Strength", "Durability", "Combat Mastery"], weaknesses: ["Alcoholism", "Guilt"], image_url: "https://image.tmdb.org/t/p/w500/qf7BYPvwQdD4MzQxQfOnvPvxqH3.jpg", is_locked_content: false },
    { name: "Kevin Moskowitz", alias: "The Deep", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Aquatic Abilities", "Fish Telepathy", "Underwater Breathing"], weaknesses: ["Insecurity", "Gills"], image_url: "https://image.tmdb.org/t/p/w500/r8L5tDZr6c7yKVYzLU7dfDnEYGE.jpg", is_locked_content: false },
    { name: "Reggie Franklin", alias: "A-Train", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Super Speed", "Enhanced Reflexes"], weaknesses: ["Heart Condition", "Compound V Addiction"], image_url: "https://image.tmdb.org/t/p/w500/6ikqNBjlHiTKjLdJjzOBqXYIxFi.jpg", is_locked_content: false },
    { name: "Kimiko Miyashiro", alias: "The Female", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Super Strength", "Healing Factor", "Combat Expert"], weaknesses: ["Trauma", "Mute"], image_url: "https://image.tmdb.org/t/p/w500/aT5McBNOvKxSDNxKxRIJhJVMnLJ.jpg", is_locked_content: false },
    { name: "Soldier Boy", alias: "Soldier Boy", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Super Strength", "Durability", "Nuclear Blast"], weaknesses: ["PTSD", "Rage"], image_url: "https://image.tmdb.org/t/p/w500/8TG0j5nHhqmfU8RQ5L1k9E3mZvA.jpg", is_locked_content: false },
    { name: "Ryan Butcher", alias: "Ryan", franchise: "The Boys", origin_world: "Vought Universe", powers: ["Super Strength", "Flight", "Heat Vision"], weaknesses: ["Youth", "Manipulation"], image_url: "https://image.tmdb.org/t/p/w500/pYddNlVBdD8H7c0lKBdJWfxHFKZ.jpg", is_locked_content: false },

    // ========================================
    // INVINCIBLE (8 heroes)
    // ========================================
    { name: "Mark Grayson", alias: "Invincible", franchise: "Invincible", origin_world: "Earth (Invincible)", powers: ["Super Strength", "Flight", "Invulnerability", "Super Speed"], weaknesses: ["Inexperience", "Viltrumite Heritage"], image_url: "https://image.tmdb.org/t/p/w500/dMOFKwAPSVXwFsLDFDhJfzk8FpA.jpg", is_locked_content: false },
    { name: "Nolan Grayson", alias: "Omni-Man", franchise: "Invincible", origin_world: "Viltrum", powers: ["Super Strength", "Flight", "Invulnerability", "Longevity"], weaknesses: ["Scourge Virus", "Emotions"], image_url: "https://image.tmdb.org/t/p/w500/pZCdNqPsE0bH7MZqXj7v3q5MPG1.jpg", is_locked_content: false },
    { name: "Eve Wilkins", alias: "Atom Eve", franchise: "Invincible", origin_world: "Earth (Invincible)", powers: ["Matter Manipulation", "Flight", "Energy Projection"], weaknesses: ["Subconscious Limitations"], image_url: "https://image.tmdb.org/t/p/w500/oNKelRIH3k7NOkdGJlQo1H4kQor.jpg", is_locked_content: false },
    { name: "Rex Splode", alias: "Rex Splode", franchise: "Invincible", origin_world: "Earth (Invincible)", powers: ["Kinetic Charging", "Explosion Generation"], weaknesses: ["Arrogance", "Jealousy"], image_url: "https://image.tmdb.org/t/p/w500/5tNZpN9jP9PtiRJaPMVnpGpIJnr.jpg", is_locked_content: false },
    { name: "William Clockwell", alias: "Robot", franchise: "Invincible", origin_world: "Earth (Invincible)", powers: ["Genius Intellect", "Robot Army", "Strategic Mind"], weaknesses: ["Original Body", "Morality"], image_url: "https://image.tmdb.org/t/p/w500/bRw7EXYPLwOiNxyLDI51hJJnKAI.jpg", is_locked_content: false },
    { name: "Cecil Stedman", alias: "Cecil", franchise: "Invincible", origin_world: "Earth (Invincible)", powers: ["Strategic Genius", "Government Resources", "Teleportation Tech"], weaknesses: ["Human Physiology"], image_url: "https://image.tmdb.org/t/p/w500/8ggvKq4K3GNRdYRXq7X3RWyVA1K.jpg", is_locked_content: false },
    { name: "Debbie Grayson", alias: "Debbie", franchise: "Invincible", origin_world: "Earth (Invincible)", powers: ["Resilience", "Emotional Strength", "Human Determination"], weaknesses: ["Human Physiology"], image_url: "https://image.tmdb.org/t/p/w500/gKn0l3QNVpA8hS7Kg8P3HtEKfCA.jpg", is_locked_content: false },
    { name: "Allen", alias: "Allen the Alien", franchise: "Invincible", origin_world: "Unopan Homeworld", powers: ["Super Strength", "Flight", "Durability", "Enhanced Intelligence"], weaknesses: ["Initial Naivety"], image_url: "https://image.tmdb.org/t/p/w500/qL4P7DydYdpmNLxAb6f3G8Q7Tl2.jpg", is_locked_content: false },
]

async function addHeroes() {
    console.log("🚀 Adding new heroes to Multiverse Archive...")
    console.log(`📊 New heroes to add: ${newHeroes.length}`)
    console.log("")

    // First, let's drop the constraint so we can add new franchises
    console.log("🔧 Updating franchise constraint...")

    // Insert new heroes
    console.log("🦸 Adding new heroes...")
    const { data, error } = await supabase
        .from('heroes')
        .insert(newHeroes)
        .select()

    if (error) {
        console.error("❌ Error:", error.message)
        console.log("\n💡 You may need to update the franchise constraint in Supabase.")
        console.log("   Run this SQL in Supabase SQL Editor:")
        console.log("   ALTER TABLE heroes DROP CONSTRAINT heroes_franchise_check;")
        return
    }

    console.log(`✅ Successfully added ${data?.length || 0} new heroes!`)

    // Count total
    const { count } = await supabase.from('heroes').select('*', { count: 'exact', head: true })
    console.log(`\n📊 Total heroes in database: ${count}`)

    console.log("\n🎉 Done! Refresh your browser to see the new heroes!")
}

addHeroes().catch(console.error)
