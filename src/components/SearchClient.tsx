'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react'
import HeroCard from '@/components/HeroCard'
import { Button } from '@/components/ui/button'
import type { Hero, SearchHero } from '@/lib/supabase'
import { FRANCHISE_VALUES } from '@/lib/hero-update'

interface SearchClientProps {
  allHeroes: SearchHero[]
  loadError?: string | null
  isDemoMode?: boolean
}

const franchises = ['All', ...FRANCHISE_VALUES]
const PAGE_SIZE = 24
// Bound the rendered DOM: never render more than this many cards at once,
// even when the result set (or "load more" accumulation) is larger.
const MAX_RENDERED = 96

export default function SearchPage({
  allHeroes,
  loadError = null,
  isDemoMode = false,
}: SearchClientProps) {
  const router = useRouter()
  // #484: seed state from the URL so a search is shareable/bookmarkable and a
  // refresh does not lose it. Read lazily (client-only) to avoid needing a
  // Suspense boundary around useSearchParams.
  const [query, setQuery] = useState(() =>
    typeof window === 'undefined'
      ? ''
      : (new URLSearchParams(window.location.search).get('q') ?? ''),
  )
  const [results, setResults] = useState<SearchHero[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFranchise, setSelectedFranchise] = useState(() =>
    typeof window === 'undefined'
      ? 'All'
      : (new URLSearchParams(window.location.search).get('franchise') ?? 'All'),
  )
  const [hasSearched, setHasSearched] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Keep the query string in sync (replace, not push, so Back isn't spammed).
  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (selectedFranchise !== 'All') params.set('franchise', selectedFranchise)
    const qs = params.toString()
    router.replace(qs ? `/search?${qs}` : '/search', { scroll: false })
  }, [query, selectedFranchise, router])

  // Memoize the full filter pass so re-renders (and rapid keystrokes that
  // revisit the same query/franchise combo) don't re-scan allHeroes.
  const filteredResults = useMemo<SearchHero[]>(() => {
    let filtered = allHeroes
    if (selectedFranchise !== 'All') {
      filtered = filtered.filter((h) => h.franchise === selectedFranchise)
    }
    if (query.trim()) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(
        (h) =>
          h.name.toLowerCase().includes(lowerQuery) ||
          h.alias.toLowerCase().includes(lowerQuery) ||
          h.actor_name?.toLowerCase().includes(lowerQuery) ||
          h.origin_world?.toLowerCase().includes(lowerQuery) ||
          h.powers?.some((p) => p.toLowerCase().includes(lowerQuery)),
      )
    }
    return filtered
  }, [query, selectedFranchise, allHeroes])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsSearching(true)
      setHasSearched(true)
      if (query || selectedFranchise !== 'All') {
        setResults(filteredResults)
        setVisibleCount(PAGE_SIZE)
      } else {
        setResults([])
        setHasSearched(false)
      }
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [query, selectedFranchise, filteredResults])

  const visibleResults = results.slice(0, Math.min(visibleCount, MAX_RENDERED))

  return (
    <main className="min-h-screen">
      {(isDemoMode || loadError) && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300">
          {loadError ?? 'Demo mode: Supabase is not configured, showing sample data.'}
        </div>
      )}
      <section className="relative bg-[var(--bg)] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <div className="absolute inset-0 gradient-spotlight" />

        <div className="relative container-wide py-28 sm:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg-2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                Multiverse Search Engine
              </span>
            </div>

            <h1 className="text-hero mb-6 leading-[1.05]">
              <span className="text-[var(--fg)]">Nexus</span>
              <br />
              <span className="text-gradient">Search</span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--fg-2)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Search across all dimensions. Find heroes by name, alias, powers, or origin world.
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="glass-panel-strong rounded-2xl p-2">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--meta)]" />
                    <input
                      type="text"
                      placeholder="Search heroes, actors, powers, or worlds..."
                      aria-label="Search heroes, actors, powers, or worlds"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-transparent pl-10 pr-10 py-3.5 text-base text-[var(--fg)] placeholder-[var(--meta)]"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 text-[var(--meta)] hover:text-[var(--fg)] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {isSearching && (
                    <Loader2 className="w-5 h-5 text-[var(--accent)] animate-spin mr-3" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                <span className="text-xs text-[var(--muted)] mr-1">Filter:</span>
                {franchises.map((franchise) => (
                  <button
                    key={franchise}
                    onClick={() => setSelectedFranchise(franchise)}
                    aria-pressed={selectedFranchise === franchise}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedFranchise === franchise
                        ? 'bg-[var(--accent)] text-[var(--accent-on)]'
                        : 'glass text-[var(--fg-2)] hover:text-[var(--fg)]'
                    }`}
                  >
                    {franchise}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-wide">
        <div className="divider" />
      </div>

      <section className="section bg-[var(--bg)]">
        <div className="container-wide">
          <AnimatePresence mode="wait">
            {loadError ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4 border border-[var(--danger)]/30">
                  <AlertTriangle className="w-7 h-7 text-[var(--danger)]" />
                </div>
                <p className="text-lg font-medium text-[var(--fg)]">{loadError}</p>
                <p className="text-sm text-[var(--meta)] mt-2 max-w-md">
                  We couldn&rsquo;t reach the hero database. Please try again in a moment, or check
                  your connection.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => router.refresh()}>
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </motion.div>
            ) : isSearching ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
                  <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin" />
                </div>
                <p className="text-[var(--muted)] font-medium">Scanning the multiverse...</p>
              </motion.div>
            ) : hasSearched ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <span
                      role="status"
                      aria-live="polite"
                      aria-atomic="true"
                      className="badge-accent px-3 py-1.5 text-xs font-medium"
                    >
                      <Sparkles className="w-3 h-3" aria-hidden="true" />
                      {results.length} {results.length === 1 ? 'hero' : 'heroes'} found
                    </span>
                    {query && (
                      <span className="text-[var(--muted)] text-sm">for &quot;{query}&quot;</span>
                    )}
                  </div>
                </div>

                {results.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {visibleResults.map((hero, index) => (
                        <HeroCard key={hero.id} hero={hero as Hero} index={index} />
                      ))}
                    </div>

                    {/* #524: the DOM cap is real; say so instead of truncating silently. */}
                    {results.length > MAX_RENDERED && (
                      <p className="text-center text-[var(--meta)] text-sm mt-6">
                        Showing {MAX_RENDERED} of {results.length} — refine your search to see the
                        rest.
                      </p>
                    )}

                    {results.length > visibleCount && visibleCount < MAX_RENDERED && (
                      <div className="flex justify-center mt-10">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setVisibleCount((count) => Math.min(count + PAGE_SIZE, MAX_RENDERED))
                          }
                        >
                          Load more ({Math.min(results.length, MAX_RENDERED) - visibleCount}{' '}
                          remaining)
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
                      <Search className="w-7 h-7 text-[var(--meta)]" />
                    </div>
                    <p className="text-lg font-medium text-[var(--fg)]">
                      No heroes found in this dimension
                    </p>
                    <p className="text-sm text-[var(--meta)] mt-2">
                      Try a different search term or filter
                    </p>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <p className="text-[var(--meta)]">
                  Type a search term or select a franchise to begin
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}
