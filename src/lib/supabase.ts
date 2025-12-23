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

// Helper Functions
export async function getAllHeroes(): Promise<Hero[]> {
    if (!supabase) return []

    const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching heroes:', error)
        return []
    }
    return data || []
}

export async function getHeroBySlug(slug: string): Promise<HeroWithRelations | null> {
    if (!supabase) return null

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
    if (!supabase) return []

    const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .eq('franchise', franchise)
        .order('name')

    if (error) {
        console.error('Error fetching heroes by franchise:', error)
        return []
    }
    return data || []
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
    if (!supabase) return []

    const { data, error } = await supabase
        .from('heroes')
        .select('*')
        .or(`name.ilike.%${query}%,alias.ilike.%${query}%`)
        .order('name')

    if (error) {
        console.error('Error searching heroes:', error)
        return []
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
