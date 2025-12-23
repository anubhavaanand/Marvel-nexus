const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || ''
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export interface TMDBMovie {
    id: number
    title: string
    overview: string
    poster_path: string
    backdrop_path: string
    release_date: string
    vote_average: number
    vote_count: number
    popularity: number
}

export interface TMDBPerson {
    id: number
    name: string
    profile_path: string
    known_for_department: string
}

// Get image URL with size
export function getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder-hero.jpg'
    return `${IMAGE_BASE_URL}/${size}${path}`
}

// Fetch all Marvel Studios movies
export async function fetchMarvelMovies(): Promise<TMDBMovie[]> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB API key not configured')
        return []
    }

    try {
        const res = await fetch(
            `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_companies=420&sort_by=release_date.desc&page=1`,
            { next: { revalidate: 3600 } } // Cache for 1 hour
        )

        if (!res.ok) {
            throw new Error(`TMDB API error: ${res.status}`)
        }

        const data = await res.json()
        return data.results || []
    } catch (error) {
        console.error('Error fetching Marvel movies:', error)
        return []
    }
}

// Fetch all Marvel movies (multiple pages)
export async function fetchAllMarvelMovies(pages: number = 3): Promise<TMDBMovie[]> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB API key not configured')
        return []
    }

    const allMovies: TMDBMovie[] = []

    for (let page = 1; page <= pages; page++) {
        try {
            const res = await fetch(
                `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_companies=420&sort_by=release_date.desc&page=${page}`,
                { next: { revalidate: 3600 } }
            )

            if (!res.ok) continue

            const data = await res.json()
            allMovies.push(...(data.results || []))
        } catch (error) {
            console.error(`Error fetching page ${page}:`, error)
        }
    }

    return allMovies
}

// Search for a specific movie
export async function searchMovie(title: string): Promise<TMDBMovie | null> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB API key not configured')
        return null
    }

    try {
        const res = await fetch(
            `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`,
            { next: { revalidate: 3600 } }
        )

        if (!res.ok) {
            throw new Error(`TMDB API error: ${res.status}`)
        }

        const data = await res.json()
        return data.results?.[0] || null
    } catch (error) {
        console.error('Error searching movie:', error)
        return null
    }
}

// Get movie details
export async function getMovieDetails(movieId: number): Promise<TMDBMovie | null> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB API key not configured')
        return null
    }

    try {
        const res = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
            { next: { revalidate: 3600 } }
        )

        if (!res.ok) {
            throw new Error(`TMDB API error: ${res.status}`)
        }

        return await res.json()
    } catch (error) {
        console.error('Error fetching movie details:', error)
        return null
    }
}

// Get movie credits (cast)
export async function getMovieCredits(movieId: number): Promise<TMDBPerson[]> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB API key not configured')
        return []
    }

    try {
        const res = await fetch(
            `${BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`,
            { next: { revalidate: 3600 } }
        )

        if (!res.ok) {
            throw new Error(`TMDB API error: ${res.status}`)
        }

        const data = await res.json()
        return data.cast || []
    } catch (error) {
        console.error('Error fetching movie credits:', error)
        return []
    }
}

// MCU Phase mapping based on release date
export function getMCUPhase(releaseDate: string): string {
    const date = new Date(releaseDate)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    // Phase 1: May 2008 - May 2012
    if (year < 2012 || (year === 2012 && month <= 5)) return 'Phase 1'

    // Phase 2: May 2013 - July 2015
    if (year <= 2015 && (year < 2015 || month <= 7)) return 'Phase 2'

    // Phase 3: May 2016 - July 2019
    if (year <= 2019 && (year < 2019 || month <= 7)) return 'Phase 3'

    // Phase 4: July 2021 - November 2022
    if (year <= 2022) return 'Phase 4'

    // Phase 5: February 2023 - November 2024
    if (year <= 2024) return 'Phase 5'

    // Phase 6: 2025+
    return 'Phase 6'
}

// Get trending Marvel content
export async function getTrendingMarvel(): Promise<TMDBMovie[]> {
    if (!TMDB_API_KEY) {
        console.warn('TMDB API key not configured')
        return []
    }

    try {
        const res = await fetch(
            `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`,
            { next: { revalidate: 1800 } } // Cache for 30 minutes
        )

        if (!res.ok) {
            throw new Error(`TMDB API error: ${res.status}`)
        }

        const data = await res.json()
        // Filter for Marvel movies (company ID 420 is Marvel Studios)
        // Note: This is a simplified filter, in production you'd want to check the production companies
        return (data.results || []).filter((movie: TMDBMovie) =>
            movie.title?.toLowerCase().includes('marvel') ||
            movie.title?.toLowerCase().includes('avengers') ||
            movie.title?.toLowerCase().includes('spider-man') ||
            movie.title?.toLowerCase().includes('deadpool')
        )
    } catch (error) {
        console.error('Error fetching trending Marvel:', error)
        return []
    }
}
