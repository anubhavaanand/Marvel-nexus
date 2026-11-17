import { Suspense } from 'react'
import TimelineSagaTabs from '@/components/TimelineSagaTabs'
import { TimelineSkeleton } from '@/components/Skeleton'
import { getAllMovies, isSupabaseConfigured, type Movie } from '@/lib/supabase'
import { bucketMoviesByPhase } from '@/lib/movie-phases'
import { Film } from 'lucide-react'
import Link from 'next/link'

// Movie data is public and changes infrequently. Cache at the edge with ISR
// (revalidate = 3600s / 1 hour) instead of force-dynamic so getAllMovies()
// doesn't hit Supabase on every request. Short TTL keeps the empty→seeded
// transition from #132 from being cached forever.
export const revalidate = 3600

async function getMoviesData(options?: { allowEmpty?: boolean }) {
  // #479: no page-local movie list — demo mode uses the same SEED_MOVIES-derived
  // fallback as every other view, so counts/ordering cannot disagree.
  const movies = await getAllMovies(options)
  return movies || []
}

export const metadata = {
  title: 'MCU Timeline | Multiverse Archive',
  description:
    'Explore the complete Marvel Cinematic Universe timeline from Phase 1 to Phase 6. Every movie in chronological order.',
}

export default async function TimelinePage() {
  const movies = await getMoviesData({
    allowEmpty: process.env.NEXT_PHASE === 'phase-production-build',
  })
  const isEmpty = isSupabaseConfigured && movies.length === 0

  // #529: bucket through the shared helper so tests cover production logic.
  const phases = bucketMoviesByPhase(movies)

  return (
    <main className="min-h-screen">
      <section className="relative bg-[var(--bg)] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <div className="absolute inset-0 gradient-spotlight" />

        <div className="relative container-wide py-28 sm:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg-2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                Chronological Database
              </span>
            </div>

            <h1 className="text-hero mb-6 leading-[1.05]">
              <span className="text-[var(--fg)]">MCU</span>
              <br />
              <span className="text-gradient">Timeline</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--fg-2)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Journey through the Infinity Saga and the Multiverse Saga. Every story that shaped the
              Marvel Cinematic Universe.
            </p>

            <div className="stat-pill">
              <Film className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="stat-value">{movies.length}</span>
              <span className="stat-label">Movies in the MCU</span>
            </div>

            {isEmpty && (
              <div className="mt-12 flex flex-col items-center justify-center gap-3 py-12">
                <Film className="w-10 h-10 rounded-2xl glass flex items-center justify-center text-[var(--meta)]" />
                <p className="text-lg font-medium text-[var(--fg)]">
                  No movies yet — database not seeded
                </p>
                <p className="text-sm text-[var(--meta)] max-w-xs text-center">
                  Supabase is configured but the movies table is empty. Run the seed script to
                  populate the timeline.
                </p>
                <Link
                  href="/admin"
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90 transition"
                >
                  Seed database in Admin
                </Link>
                <p className="text-xs text-[var(--meta)]">
                  Or run <code>npm run seed</code> locally — see docs for details.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-wide">
        <div className="divider" />
      </div>

      {isEmpty ? null : (
        <section className="section bg-[var(--bg)]">
          <div className="container-wide">
            <div className="text-center mb-12">
              <span className="text-eyebrow mb-4 block">Explore by Phase</span>
              <h2 className="text-title mb-4">Saga Timeline</h2>
              <p className="text-body max-w-xl mx-auto">
                From the Infinity Stones to the Multiverse, explore every chapter of the MCU.
              </p>
            </div>

            <Suspense fallback={<TimelineSkeleton />}>
              <TimelineSagaTabs phases={phases} />
            </Suspense>
          </div>
        </section>
      )}
    </main>
  )
}
