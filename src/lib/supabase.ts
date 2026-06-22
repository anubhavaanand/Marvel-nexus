import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Only create client if credentials are available
let supabase: SupabaseClient | null = null
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
}

// Check if Supabase is configured
export const isSupabaseConfigured = !!supabase

// Types
export interface Movie {
    id: string
    tmdb_id: number
    title: string
    release_date: string
    phase: 'Phase 1' | 'Phase 2' | 'Phase 3' | 'Phase 4' | 'Phase 5' | 'Phase 6'
    poster_url: string
    imdb_rating: number
}

export interface Hero {
    id: string
    name: string
    alias: string
    franchise: 'MCU' | 'X-Men' | 'Spider-Verse' | 'Defenders' | 'DC' | 'Anime' | string
    origin_world: string
    powers: string[]
    weaknesses: string[]
    image_url: string
    is_locked_content: boolean
    first_appearance_movie_id?: string
}

export interface CanonEvent {
    id: string
    hero_id: string
    movie_id?: string
    description: string
    is_fixed_point: boolean
    glitch_level: number
    movies?: Movie
}

export interface HeroWithRelations extends Hero {
    canon_events?: CanonEvent[]
    hero_movies?: { movies: Movie }[]
}

// Mock data fallback when Supabase is not configured
const mockHeroes: Hero[] = [
    // MCU Heroes
    { id: '1', name: 'Tony Stark', alias: 'Iron Man', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Genius-level intellect', 'Powered armor suit', 'Flight', 'Energy repulsors'], weaknesses: ['Arc reactor dependency', 'Alcoholism'], image_url: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400', is_locked_content: false },
    { id: '2', name: 'Steve Rogers', alias: 'Captain America', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Super soldier serum', 'Vibranium shield', 'Enhanced strength', 'Enhanced agility'], weaknesses: ['Man out of time', 'Honor bound'], image_url: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=400', is_locked_content: false },
    { id: '3', name: 'Thor Odinson', alias: 'Thor', franchise: 'MCU', origin_world: 'Asgard', powers: ['God of Thunder', 'Mjolnir/Stormbreaker', 'Super strength', 'Flight'], weaknesses: ['Arrogance', 'Love for Jane Foster'], image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', is_locked_content: false },
    { id: '4', name: 'Bruce Banner', alias: 'Hulk', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Super strength', 'Regeneration', 'Gamma radiation', 'Near-invulnerability'], weaknesses: ['Anger management', 'Transforms under stress'], image_url: 'https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400', is_locked_content: false },
    { id: '5', name: 'Natasha Romanoff', alias: 'Black Widow', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Expert martial artist', 'Spy tactics', 'Widow bites', 'Enhanced reflexes'], weaknesses: ['No superpowers', 'Red ledger'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    { id: '6', name: 'Clint Barton', alias: 'Hawkeye', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Master archer', 'Expert marksman', 'Tactical genius', 'Enhanced aim'], weaknesses: ['Family vulnerable', 'No superpowers'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '7', name: 'Peter Parker', alias: 'Spider-Man', franchise: 'MCU', origin_world: 'Earth-199999', powers: ['Spider-sense', 'Wall-crawling', 'Super strength', 'Web shooters'], weaknesses: ['Guilt over Uncle Ben', 'Identity protection'], image_url: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400', is_locked_content: false },
    { id: '8', name: 'T\'Challa', alias: 'Black Panther', franchise: 'MCU', origin_world: 'Wakanda', powers: ['Heart-shaped herb', 'Vibranium suit', 'Enhanced strength', 'Enhanced agility'], weaknesses: ['King\'s responsibility', 'Killmonger challenge'], image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', is_locked_content: false },
    { id: '9', name: 'Stephen Strange', alias: 'Doctor Strange', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Sorcery', 'Time Stone', 'Astral projection', 'Dimensional travel'], weaknesses: ['Arrogance', 'Ego'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '10', name: 'Carol Danvers', alias: 'Captain Marvel', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Photon blasts', 'Flight', 'Super strength', 'Energy absorption'], weaknesses: ['Memory loss', 'Kree heritage'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    
    // X-Men Heroes
    { id: '11', name: 'Logan', alias: 'Wolverine', franchise: 'X-Men', origin_world: 'Earth-616', powers: ['Adamantium skeleton', 'Healing factor', 'Enhanced senses', 'Retractable claws'], weaknesses: ['Adamantium poisoning', 'Memory loss'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '12', name: 'Charles Xavier', alias: 'Professor X', franchise: 'X-Men', origin_world: 'Earth-616', powers: ['Telepathy', 'Mind control', 'Psionic shields', 'Genius intellect'], weaknesses: ['Paraplegic', 'Magneto rivalry'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '13', name: 'Erik Lehnsherr', alias: 'Magneto', franchise: 'X-Men', origin_world: 'Earth-616', powers: ['Magnetism manipulation', 'Metal control', 'Flight', 'Force fields'], weaknesses: ['Holocaust trauma', 'Xavier friendship'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '14', name: 'Jean Grey', alias: 'Phoenix', franchise: 'X-Men', origin_world: 'Earth-616', powers: ['Telepathy', 'Telekinesis', 'Phoenix Force', 'Cosmic power'], weaknesses: ['Phoenix corruption', 'Emotional instability'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    { id: '15', name: 'Scott Summers', alias: 'Cyclops', franchise: 'X-Men', origin_world: 'Earth-616', powers: ['Optic blasts', 'Tactical genius', 'Leadership', 'Visor control'], weaknesses: ['No eye control', 'Jean Grey relationship'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '16', name: 'Ororo Munroe', alias: 'Storm', franchise: 'X-Men', origin_world: 'Earth-616', powers: ['Weather manipulation', 'Flight', 'Elemental control', 'Goddess worship'], weaknesses: ['Claustrophobia', 'African heritage'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    
    // Spider-Verse Heroes
    { id: '17', name: 'Miles Morales', alias: 'Spider-Man', franchise: 'Spider-Verse', origin_world: 'Earth-1610', powers: ['Venom strike', 'Camouflage', 'Spider-sense', 'Web wings'], weaknesses: ['Guilt over Uncle Aaron', 'Multiverse responsibility'], image_url: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=400', is_locked_content: false },
    { id: '18', name: 'Gwen Stacy', alias: 'Spider-Gwen', franchise: 'Spider-Verse', origin_world: 'Earth-65', powers: ['Spider-sense', 'Wall-crawling', 'Acrobatics', 'Web shooters'], weaknesses: ['Peter Parker death guilt', 'Multiverse travel'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    { id: '19', name: 'Peter B. Parker', alias: 'Spider-Man', franchise: 'Spider-Verse', origin_world: 'Earth-616B', powers: ['Spider-sense', 'Wall-crawling', 'Experience', 'Wisdom'], weaknesses: ['Midlife crisis', 'Divorce'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    
    // DC Heroes
    { id: '20', name: 'Clark Kent', alias: 'Superman', franchise: 'DC', origin_world: 'Krypton', powers: ['Super strength', 'Flight', 'Heat vision', 'Invulnerability'], weaknesses: ['Kryptonite', 'Magic', 'Lois Lane'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '21', name: 'Bruce Wayne', alias: 'Batman', franchise: 'DC', origin_world: 'Earth-0', powers: ['Genius intellect', 'Martial arts', 'Bat-suit', 'Batmobile'], weaknesses: ['No superpowers', 'Parents death', 'Joker obsession'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '22', name: 'Diana Prince', alias: 'Wonder Woman', franchise: 'DC', origin_world: 'Themyscira', powers: ['Super strength', 'Lasso of Truth', 'Bracelets of Victory', 'Flight'], weaknesses: ['Honesty bound', 'Ares connection'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    { id: '23', name: 'Barry Allen', alias: 'The Flash', franchise: 'DC', origin_world: 'Earth-0', powers: ['Super speed', 'Speed Force', 'Time travel', 'Phasing'], weaknesses: ['Mother murder', 'Speed Force dependency'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '24', name: 'Arthur Curry', alias: 'Aquaman', franchise: 'DC', origin_world: 'Atlantis', powers: ['Super strength', 'Telepathy', 'Underwater breathing', 'Trident'], weaknesses: ['Surface world rejection', 'Atlantis politics'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    
    // The Boys Heroes
    { id: '25', name: 'Billy Butcher', alias: 'Butcher', franchise: 'The Boys', origin_world: 'Earth', powers: ['Tactical genius', 'V-24 powers', 'Super strength', 'Heat vision'], weaknesses: ['V-24 addiction', 'Revenge obsession'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '26', name: 'Homelander', alias: 'Homelander', franchise: 'The Boys', origin_world: 'Earth', powers: ['Super strength', 'Flight', 'Heat vision', 'Invulnerability'], weaknesses: ['Narcissism', 'Mother issues', 'Compound V'], image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', is_locked_content: false },
    { id: '27', name: 'Starlight', alias: 'Starlight', franchise: 'The Boys', origin_world: 'Earth', powers: ['Light manipulation', 'Energy blasts', 'Flight', 'Super strength'], weaknesses: ['Homelander manipulation', 'Public image'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    { id: '28', name: 'Queen Maeve', alias: 'Queen Maeve', franchise: 'The Boys', origin_world: 'Earth', powers: ['Super strength', 'Flight', 'Invulnerability', 'Combat skills'], weaknesses: ['Alcoholism', 'Homelander fear'], image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400', is_locked_content: false },
    
    // Anime Heroes
    { id: '29', name: 'Goku', alias: 'Goku', franchise: 'Anime', origin_world: 'Universe 7', powers: ['Super Saiyan', 'Kamehameha', 'Instant transmission', 'Ultra Instinct'], weaknesses: ['Naive', 'Food obsession', 'Saiyan pride'], image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', is_locked_content: false },
    { id: '30', name: 'Naruto Uzumaki', alias: 'Naruto', franchise: 'Anime', origin_world: 'Shinobi World', powers: ['Rasengan', 'Shadow clones', 'Nine-tails chakra', 'Sage mode'], weaknesses: ['Childhood trauma', 'Village rejection'], image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', is_locked_content: false },
    { id: '31', name: 'Monkey D. Luffy', alias: 'Luffy', franchise: 'Anime', origin_world: 'Grand Line', powers: ['Rubber body', 'Gum-Gum attacks', 'Haki', 'Gear transformations'], weaknesses: ['Water weakness', 'Naive nature'], image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', is_locked_content: false },
    { id: '32', name: 'Saitama', alias: 'One Punch Man', franchise: 'Anime', origin_world: 'Earth', powers: ['Limitless strength', 'Speed', 'Invulnerability', 'Serious punch'], weaknesses: ['Boredom', 'No real challenge'], image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', is_locked_content: false },
]

// Helper Functions
export async function getAllHeroes(): Promise<Hero[]> {
    if (!supabase) return mockHeroes

    const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching heroes:', error)
        return mockHeroes  // Fallback to mock data on error
    }
    return data || mockHeroes
}

export async function getHeroBySlug(slug: string): Promise<HeroWithRelations | null> {
    if (!supabase) {
        // Convert slug back to alias (e.g., "iron-man" -> "Iron Man")
        const aliasFromSlug = slug.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
        const hero = mockHeroes.find(h => h.alias.toLowerCase() === aliasFromSlug.toLowerCase())
        return hero || null
    }

    // Convert slug back to alias (e.g., "iron-man" -> "Iron Man")
    const aliasFromSlug = slug.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')

    const { data, error } = await supabase
        .from('heroes')
        .select(`
      *,
      canon_events (
        *,
        movies (*)
      ),
      hero_movies (
        movies (*)
      )
    `)
        .ilike('alias', aliasFromSlug)
        .single()

    if (error) {
        console.error('Error fetching hero:', error)
        return null
    }
    return data
}

export async function getHeroesByFranchise(franchise: string): Promise<Hero[]> {
    if (!supabase) {
        return mockHeroes.filter(h => h.franchise === franchise)
    }

    const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .eq('franchise', franchise)
        .order('name')

    if (error) {
        console.error('Error fetching heroes by franchise:', error)
        return mockHeroes.filter(h => h.franchise === franchise)
    }
    return data || mockHeroes.filter(h => h.franchise === franchise)
}

export async function getAllMovies(): Promise<Movie[]> {
    if (!supabase) return []

    const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('release_date', { ascending: true })

    if (error) {
        console.error('Error fetching movies:', error)
        return []
    }
    return data || []
}

export async function getMoviesByPhase(phase: string): Promise<Movie[]> {
    if (!supabase) return []

    const { data, error } = await supabase
        .from('movies')
        .select('*')
        .eq('phase', phase)
        .order('release_date', { ascending: true })

    if (error) {
        console.error('Error fetching movies by phase:', error)
        return []
    }
    return data || []
}

export async function searchHeroes(query: string): Promise<Hero[]> {
    if (!supabase) {
        const q = query.toLowerCase()
        return mockHeroes.filter(h => 
            h.name.toLowerCase().includes(q) || 
            h.alias.toLowerCase().includes(q) ||
            h.powers.some(p => p.toLowerCase().includes(q))
        )
    }

    const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .or(`name.ilike.%${query}%,alias.ilike.%${query}%`)
        .order('name')

    if (error) {
        console.error('Error searching heroes:', error)
        const q = query.toLowerCase()
        return mockHeroes.filter(h => 
            h.name.toLowerCase().includes(q) || 
            h.alias.toLowerCase().includes(q) ||
            h.powers.some(p => p.toLowerCase().includes(q))
        )
    }
    return data || []
}

export async function getCanonEventsByHero(heroId: string): Promise<CanonEvent[]> {
    if (!supabase) return []

    const { data, error } = await supabase
        .from('canon_events')
        .select(`
      *,
      movies (*)
    `)
        .eq('hero_id', heroId)
        .order('glitch_level', { ascending: false })

    if (error) {
        console.error('Error fetching canon events:', error)
        return []
    }
    return data || []
}

// Admin functions for seeding data
export async function insertHero(hero: Omit<Hero, 'id'>) {
    if (!supabase) return null

    const { data, error } = await supabase
        .from('heroes')
        .insert(hero)
        .select()
        .single()

    if (error) {
        console.error('Error inserting hero:', error)
        return null
    }
    return data
}

export async function insertMovie(movie: Omit<Movie, 'id'>) {
    if (!supabase) return null

    const { data, error } = await supabase
        .from('movies')
        .insert(movie)
        .select()
        .single()

    if (error) {
        console.error('Error inserting movie:', error)
        return null
    }
    return data
}
// Update a hero
export async function updateHero(id: string, updates: Partial<Hero>) {
    if (!supabase) return null

    const { data, error } = await supabase
        .from('heroes')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating hero:', error)
        return null
    }
    return data
}

// Delete a hero
export async function deleteHero(id: string) {
    if (!supabase) return false

    const { error } = await supabase
        .from('heroes')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting hero:', error)
        return false
    }
    return true
}
