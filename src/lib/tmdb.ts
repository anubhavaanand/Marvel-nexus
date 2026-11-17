const TMDB_API_KEY = process.env.TMDB_API_KEY || ''
const BASE_URL = 'https://api.themoviedb.org/3'

export interface TMDBPerson {
  id: number
  name: string
  profile_path: string
  known_for_department: string
}

// Search for a person/character by name
export async function searchPerson(name: string): Promise<TMDBPerson | null> {
  if (!TMDB_API_KEY) {
    console.warn('TMDB API key not configured')
    return null
  }

  try {
    const res = await fetch(`${BASE_URL}/search/person?query=${encodeURIComponent(name)}`, {
      headers: { Authorization: `Bearer ${TMDB_API_KEY}` },
      next: { revalidate: 86400 }, // Cache for 24 hours
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      throw new Error(`TMDB API error: ${res.status}`)
    }

    const data = await res.json()
    const results = (data.results ?? []) as TMDBPerson[]
    // Prefer performers whose known department is Acting; fall back to the raw
    // order only when TMDB omits the field (#455).
    const actors = results.filter((r) => r?.known_for_department === 'Acting')
    return (actors.length > 0 ? actors : results)[0] || null
  } catch (error) {
    console.error('Error searching person:', error)
    return null
  }
}

// #436: canonical implementation lives in scripts/lib/mcu-phases.js so the Node
// sync script and the app cannot drift apart.
import { getMCUPhase as getSharedMCUPhase } from '../../scripts/lib/mcu-phases'

export function getMCUPhase(releaseDate: string): string | null {
  return getSharedMCUPhase(releaseDate)
}
