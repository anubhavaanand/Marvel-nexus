'use server'

import { revalidatePath } from 'next/cache'
import { getServiceSupabase } from '@/lib/service-supabase'
import { SEED_EVENTS, SEED_HEROES, SEED_MOVIES } from '@/lib/seed-data'
import { checkActionRateLimit } from '@/lib/action-rate-limit'
import { checkAdminAuthAction } from './admin'
import { getSafeErrorMessage } from '@/lib/error'

async function requireAdmin(): Promise<void> {
  const authed = await checkAdminAuthAction()
  if (!authed) throw new Error('Unauthorized')
}

function log(message: string) {
  console.log(`[admin-seed] ${message}`)
}

/**
 * Upserts the curated demo hero set into the database.
 */
export async function seedDemoHeroesAction() {
  await requireAdmin()
  const rateLimit = await checkActionRateLimit('SEED_DEMO_HEROES')
  if (!rateLimit.ok) {
    console.warn(`seedDemoHeroesAction rate-limited: ${rateLimit.error}`)
    return { ok: false as const, error: rateLimit.error }
  }
  const supabase = getServiceSupabase()
  const rows = SEED_HEROES.map((hero) => ({
    id: hero.id,
    name: hero.name,
    alias: hero.alias,
    franchise: hero.franchise,
    origin_world: hero.origin_world ?? null,
    powers: hero.powers,
    weaknesses: hero.weaknesses,
    image_url: hero.image_url,
    is_locked_content: hero.is_locked_content,
  }))
  const { error } = await supabase.from('heroes').upsert(rows, { onConflict: 'id' })
  if (error) {
    console.error('seedDemoHeroesAction upsert failed:', error)
    return { ok: false as const, error: getSafeErrorMessage(error, 'Hero seed failed') }
  }
  revalidatePath('/')
  revalidatePath('/admin')
  log(`seeded ${rows.length} heroes`)
  return { ok: true as const, seeded: rows.length }
}

/**
 * Upserts the curated movie list. When TMDB_API_KEY is configured it also
 * enriches each movie with its TMDB id, poster path and release date.
 */
export async function syncMoviesAction() {
  await requireAdmin()
  const rateLimit = await checkActionRateLimit('SYNC_MOVIES')
  if (!rateLimit.ok) {
    console.warn(`syncMoviesAction rate-limited: ${rateLimit.error}`)
    return { ok: false as const, error: rateLimit.error }
  }
  const supabase = getServiceSupabase()
  const rows = SEED_MOVIES.map((movie) => ({
    id: movie.id,
    title: movie.title,
    release_date: movie.release_date,
    phase: movie.phase,
    poster_url: movie.poster_url,
  }))
  const { error } = await supabase.from('movies').upsert(rows, { onConflict: 'id' })
  if (error) {
    console.error('syncMoviesAction upsert failed:', error)
    return { ok: false as const, error: getSafeErrorMessage(error, 'Movie sync failed') }
  }

  const apiKey = process.env.TMDB_API_KEY
  if (!apiKey) {
    return {
      ok: true as const,
      seeded: rows.length,
      enriched: 0,
      note: 'TMDB_API_KEY is not set; posters and TMDB ids were skipped.',
    }
  }

  let enriched = 0
  for (const movie of rows) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(movie.title)}`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          next: { revalidate: 86400 },
        },
      )
      if (!response.ok) continue
      const payload = (await response.json()) as { results?: Array<Record<string, unknown>> }
      const match = payload.results?.[0]
      if (!match) continue
      await supabase
        .from('movies')
        .update({
          tmdb_id: typeof match.id === 'number' ? match.id : null,
          poster_url:
            typeof match.poster_path === 'string' && match.poster_path
              ? `https://image.tmdb.org/t/p/w500/${match.poster_path}`
              : '',
          release_date:
            typeof match.release_date === 'string' && match.release_date
              ? match.release_date
              : movie.release_date,
        })
        .eq('id', movie.id)
      enriched += 1
    } catch {
      // Enrichment is best-effort; a failed lookup must not fail the whole sync.
    }
  }

  revalidatePath('/timeline')
  revalidatePath('/watch-order')
  revalidatePath('/admin')
  log(`synced ${rows.length} movies (${enriched} enriched from TMDB)`)
  return { ok: true as const, seeded: rows.length, enriched }
}

/**
 * Upserts canon events and ensures the corresponding hero_movies links exist.
 */
export async function createCanonEventsAction() {
  await requireAdmin()
  const rateLimit = await checkActionRateLimit('CREATE_CANON_EVENTS')
  if (!rateLimit.ok) {
    console.warn(`createCanonEventsAction rate-limited: ${rateLimit.error}`)
    return { ok: false as const, error: rateLimit.error }
  }
  const supabase = getServiceSupabase()

  const [{ data: heroes }, { data: movies }] = await Promise.all([
    supabase.from('heroes').select('id, name, alias'),
    supabase.from('movies').select('id, title'),
  ])

  const heroKey = new Map<string, string>()
  for (const hero of heroes ?? []) heroKey.set(`${hero.name}|${hero.alias}`, hero.id)
  const movieIds = new Map<string, string>()
  for (const movie of movies ?? []) movieIds.set(movie.title, movie.id)

  const rows: Array<Record<string, unknown>> = []
  const links: Array<Record<string, unknown>> = []
  let skipped = 0

  for (const event of SEED_EVENTS) {
    const hero = heroKey.get(`${event.heroName}|${event.heroAlias}`)
    const movieId = movieIds.get(event.movieTitle)
    if (!hero || !movieId) {
      skipped += 1
      continue
    }
    rows.push({
      id: event.id,
      hero_id: hero,
      movie_id: movieId,
      description: event.description,
      is_fixed_point: event.is_fixed_point,
      glitch_level: event.glitch_level,
    })
    links.push({ hero_id: hero, movie_id: movieId, role: 'main' })
  }

  if (rows.length > 0) {
    const { error } = await supabase.from('canon_events').upsert(rows, { onConflict: 'id' })
    if (error) {
      console.error('createCanonEventsAction upsert failed:', error)
      return {
        ok: false as const,
        error: getSafeErrorMessage(error, 'Canon events creation failed'),
      }
    }
    await supabase
      .from('hero_movies')
      .upsert(links, { onConflict: 'hero_id,movie_id', ignoreDuplicates: true })
  }

  revalidatePath('/timeline')
  revalidatePath('/admin')
  log(`created ${rows.length} canon events (skipped ${skipped})`)
  return { ok: true as const, created: rows.length, skipped }
}

export interface AdminStats {
  heroes: number
  movies: number
  canonEvents: number
  heroMovieLinks: number
  franchises: number
  latencyMs: number
}

/**
 * Live counts for the admin dashboard, replacing the old hardcoded numbers.
 */
export async function getAdminStatsAction(): Promise<
  { ok: true; stats: AdminStats } | { ok: false; error: string }
> {
  await requireAdmin()
  const rateLimit = await checkActionRateLimit('GET_ADMIN_STATS')
  if (!rateLimit.ok) {
    console.warn(`getAdminStatsAction rate-limited: ${rateLimit.error}`)
    return { ok: false, error: rateLimit.error ?? 'Too many requests. Please try again later.' }
  }
  const supabase = getServiceSupabase()
  const startedAt = Date.now()
  const [heroes, movies, canonEvents, heroMovieLinks, franchiseRows] = await Promise.all([
    supabase.from('heroes').select('*', { count: 'exact', head: true }),
    supabase.from('movies').select('*', { count: 'exact', head: true }),
    supabase.from('canon_events').select('*', { count: 'exact', head: true }),
    supabase.from('hero_movies').select('*', { count: 'exact', head: true }),
    supabase.from('heroes').select('franchise'),
  ])
  const error = heroes.error ?? movies.error ?? canonEvents.error ?? heroMovieLinks.error
  if (error) {
    console.error('getAdminStatsAction query failed:', error)
    return { ok: false, error: getSafeErrorMessage(error, 'Failed to load admin stats') }
  }
  const franchises = new Set((franchiseRows.data ?? []).map((row) => row.franchise)).size
  return {
    ok: true,
    stats: {
      heroes: heroes.count ?? 0,
      movies: movies.count ?? 0,
      canonEvents: canonEvents.count ?? 0,
      heroMovieLinks: heroMovieLinks.count ?? 0,
      franchises,
      latencyMs: Date.now() - startedAt,
    },
  }
}
