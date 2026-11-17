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

// MCU Phase mapping based on release date.
// Invalid/missing dates return null so they land in the timeline's "Unphased"
// bucket instead of silently becoming Phase 6 (#461).
export function getMCUPhase(releaseDate: string): string | null {
  if (!releaseDate) return null
  const date = new Date(releaseDate)
  if (Number.isNaN(date.getTime())) return null
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
