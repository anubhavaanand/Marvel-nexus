/**
 * TMDB Full Sync Script
 * Fetches ALL Marvel Studios movies from TMDB and populates the movies table.
 *
 * Notes:
 * - Does NOT link movies to heroes; the hero_movies table is never touched.
 * - Stores TMDB's own vote_average as the rating (NOT an IMDb rating).
 *
 * Usage: node scripts/sync-tmdb-movies.js
 */

const { createSupabaseClient } = require('./lib/supabase')
const dotenv = require('dotenv')

dotenv.config({ path: '.env.local' })

const tmdbApiKey = process.env.TMDB_API_KEY

if (!tmdbApiKey) {
  console.error('❌ Missing TMDB_API_KEY in .env.local')
  throw new Error('Missing TMDB_API_KEY in .env.local')
}

const supabase = createSupabaseClient({ loadEnv: false })
const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

// ─── MCU Phase Mapping ────────────────────────────────────────────────────────
// Canonical implementation lives in scripts/lib/mcu-phases.js so the app and the
// scripts cannot drift apart (#436).
const { getMCUPhase } = require('./lib/mcu-phases')

// ─── TMDB Fetch Helpers ───────────────────────────────────────────────────────
async function tmdbFetch(path, retries = 3) {
  const url = `${TMDB_BASE}${path}`
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(10000),
        headers: { Authorization: `Bearer ${tmdbApiKey}` },
      })
      if (!res.ok) throw new Error(`TMDB error ${res.status} for ${path}`)
      return res.json()
    } catch (err) {
      if (attempt === retries) throw err
      console.log(`   ⚠️  Retry ${attempt}/${retries - 1} for ${path}...`)
      await sleep(1000 * attempt) // Exponential backoff
    }
  }
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ─── Enrich with TMDB rating via movie details ────────────────────────────────
async function getMovieDetails(tmdbId) {
  try {
    const data = await tmdbFetch(`/movie/${tmdbId}?append_to_response=credits`)
    return { ok: true, data }
  } catch (err) {
    console.error(`  ❌ Failed to fetch details for TMDB ID ${tmdbId}: ${err.message}`)
    return { ok: false, error: err.message, tmdbId }
  }
}

// ─── Fetch all pages of Marvel Studios movies (company_id=420) ───────────────
async function fetchAllMarvelMovies() {
  console.log('\n📡 Fetching Marvel Studios movies from TMDB...')
  let page = 1
  let totalPages = 1
  const movies = []

  while (page <= totalPages) {
    const data = await tmdbFetch(
      `/discover/movie?with_companies=420&sort_by=release_date.asc&page=${page}&include_adult=false`,
    )
    totalPages = data.total_pages
    movies.push(...data.results)
    console.log(`   Page ${page}/${totalPages} — ${data.results.length} movies fetched`)
    page++
    await sleep(250) // Respect rate limits
  }

  console.log(`✅ Total Marvel movies found: ${movies.length}`)
  return movies
}

// ─── Map TMDB movie to our DB schema ─────────────────────────────────────────
function mapToDbMovie(movie, details) {
  const posterUrl = movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : ''
  // vote_average is TMDB's own score, not an IMDb rating; column is `tmdb_rating` per schema.
  // #501: a missing/zero score means "unrated" — store null so the UI can show 0.0
  // ratings without conflating them with absent data.
  const tmdbRating = details?.vote_average ? parseFloat(details.vote_average.toFixed(1)) : null
  return {
    tmdb_id: movie.id,
    title: movie.title,
    release_date: movie.release_date || null,
    phase: getMCUPhase(movie.release_date),
    poster_url: posterUrl,
    tmdb_rating: tmdbRating,
  }
}

// ─── Main sync function ───────────────────────────────────────────────────────
async function syncMovies() {
  console.log('🚀 Starting TMDB Full Movie Sync...\n')

  // 1. Fetch all Marvel movies from TMDB
  const tmdbMovies = await fetchAllMarvelMovies()

  // 2. Get existing movies from DB to avoid re-inserting
  const { data: existingMovies, error: existingError } = await supabase.from('movies').select('tmdb_id')
  if (existingError) {
    console.error('❌ Failed to fetch existing movies:', existingError.message)
    process.exit(1)
  }
  const existingIds = new Set((existingMovies || []).map((m) => m.tmdb_id))
  console.log(`\n📊 Already in database: ${existingIds.size} movies`)

  const toInsert = tmdbMovies.filter((m) => !existingIds.has(m.id))
  console.log(`📥 New movies to insert: ${toInsert.length}\n`)

  if (toInsert.length === 0) {
    console.log('✅ Database is already up to date!')
    return
  }

  // 3. Process and insert each movie
  let inserted = 0
  let failed = 0
  const failedIds = []
  const insertedMovies = []

  for (let i = 0; i < toInsert.length; i++) {
    const movie = toInsert[i]
    try {
      // Fetch movie details for rating
      const detailsResult = await getMovieDetails(movie.id)
      await sleep(200) // Rate limit: ~5 requests/sec

      let details = null
      if (detailsResult && detailsResult.ok) {
        details = detailsResult.data
      } else {
        // Surface TMDB failure: do not persist null rating silently.
        failed++
        failedIds.push(movie.id)
        console.error(`  ⚠️  Skipping ${movie.title} (TMDB ID ${movie.id}) — detail fetch failed`)
        continue
      }

      const dbMovie = mapToDbMovie(movie, details)
      const { data, error } = await supabase
        .from('movies')
        .insert(dbMovie)
        .select('id, title, tmdb_id')
        .single()

      if (error) {
        // Ignore duplicate key violations (already exists)
        if (error.code === '23505') {
          console.log(`  ⏭️  Already exists: ${movie.title}`)
        } else {
          console.error(`  ❌ Failed: ${movie.title} — ${error.message}`)
          failed++
        }
      } else {
        console.log(
          `  ✅ [${i + 1}/${toInsert.length}] ${dbMovie.phase}: ${dbMovie.title} (${dbMovie.release_date?.slice(0, 4) || 'TBA'}) ⭐ TMDB ${dbMovie.tmdb_rating}`,
        )
        inserted++
        insertedMovies.push(data)
      }
    } catch (err) {
      console.error(`  ❌ Error on ${movie.title}: ${err.message}`)
      failed++
    }
  }

  // 4. Summary
  console.log('\n' + '═'.repeat(60))
  console.log(`🎬 Sync Complete!`)
  console.log(`   ✅ Inserted: ${inserted} movies`)
  console.log(`   ❌ Failed:   ${failed} movies`)
  if (failedIds.length) {
    console.log(`   Failed TMDB IDs: ${failedIds.join(', ')}`)
  }

  // 5. Show phase breakdown
  const { data: allMovies } = await supabase.from('movies').select('phase')
  if (allMovies) {
    const phaseCounts = allMovies.reduce((acc, m) => {
      acc[m.phase] = (acc[m.phase] || 0) + 1
      return acc
    }, {})
    console.log('\n📊 Phase Breakdown:')
    Object.entries(phaseCounts)
      .sort()
      .forEach(([phase, count]) => {
        console.log(`   ${phase}: ${count} movies`)
      })
    console.log(`   Total: ${allMovies.length} movies in database`)
  }
  console.log('═'.repeat(60))
}

syncMovies().catch((err) => {
  console.error('Fatal error:', err)
  process.exitCode = 1
})
