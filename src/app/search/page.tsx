'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Sparkles } from 'lucide-react'
import HeroCard from '@/components/HeroCard'
import { getAllHeroes, type Hero } from '@/lib/supabase'

const franchises = ['All', 'MCU', 'X-Men', 'Spider-Verse', 'DC', 'Anime', 'The Boys']

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Hero[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFranchise, setSelectedFranchise] = useState('All')
  const [hasSearched, setHasSearched] = useState(false)
  const [allHeroes, setAllHeroes] = useState<Hero[]>([])

  useEffect(() => {
    async function loadHeroes() {
      try {
        const heroes = await getAllHeroes()
        setAllHeroes(heroes || [])
      } catch (error) {
        console.error('Failed to load heroes:', error)
        setAllHeroes([])
      }
    }
    loadHeroes()
  }, [])

  const performSearch = useCallback((searchQuery: string, franchise: string) => {
    setIsSearching(true)
    setHasSearched(true)

    setTimeout(() => {
      let filtered = allHeroes
      if (franchise !== 'All') {
        filtered = filtered.filter(h => h.franchise === franchise)
      }
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase()
        filtered = filtered.filter(h =>
          h.name.toLowerCase().includes(lowerQuery) ||
          h.alias.toLowerCase().includes(lowerQuery) ||
          h.origin_world.toLowerCase().includes(lowerQuery) ||
          h.powers?.some(p => p.toLowerCase().includes(lowerQuery))
        )
      }
      setResults(filtered)
      setIsSearching(false)
    }, 150)
  }, [allHeroes])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query || selectedFranchise !== 'All') {
        performSearch(query, selectedFranchise)
      } else {
        setResults([])
        setHasSearched(false)
      }
    }, 300)
    return () => clearTimeout(timeoutId)
  }, [query, selectedFranchise, performSearch])

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
                      placeholder="Search heroes, powers, or worlds..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="w-full bg-transparent pl-10 pr-10 py-3.5 text-base text-[var(--fg)] placeholder-[var(--meta)] focus:outline-none"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--meta)] hover:text-[var(--fg)] transition-colors"
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
            {isSearching ? (
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
                    <span className="badge-accent px-3 py-1.5 text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      {results.length} {results.length === 1 ? 'hero' : 'heroes'} found
                    </span>
                    {query && (
                      <span className="text-[var(--muted)] text-sm">
                        for &quot;{query}&quot;
                      </span>
                    )}
                  </div>
                </div>

                {results.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {results.map((hero, index) => (
                      <HeroCard key={hero.id} hero={hero} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
                      <Search className="w-7 h-7 text-[var(--meta)]" />
                    </div>
                    <p className="text-lg font-medium text-[var(--fg)]">No heroes found in this dimension</p>
                    <p className="text-sm text-[var(--meta)] mt-2">Try a different search term or filter</p>
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
                <p className="text-[var(--meta)]">Type a search term or select a franchise to begin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}
