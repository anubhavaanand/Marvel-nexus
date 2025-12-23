'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Loader2, Sparkles, Filter } from 'lucide-react'
import HeroCard from '@/components/HeroCard'
import { Badge } from '@/components/ui/badge'
import type { Hero } from '@/lib/supabase'

// Mock heroes for client-side search
const allMockHeroes: Hero[] = [
    { id: '1', name: 'Tony Stark', alias: 'Iron Man', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Powered Armor', 'Genius Intellect'], weaknesses: ['Arc Reactor Dependency'], image_url: 'https://image.tmdb.org/t/p/w500/eIqJpr4e48LNiI5vhz9gLIB8S7a.jpg', is_locked_content: false },
    { id: '2', name: 'Steve Rogers', alias: 'Captain America', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Super Soldier Serum', 'Vibranium Shield'], weaknesses: ['Idealism'], image_url: 'https://image.tmdb.org/t/p/w500/5VJ3P2yyBzEy7uQwBWlVBNlc4A7.jpg', is_locked_content: false },
    { id: '3', name: 'Thor Odinson', alias: 'Thor', franchise: 'MCU', origin_world: 'Asgard', powers: ['Lightning Manipulation', 'Mjolnir'], weaknesses: ['Arrogance'], image_url: 'https://image.tmdb.org/t/p/w500/qrTpXWuJsJsHQCaWiG0C8pRpFqB.jpg', is_locked_content: false },
    { id: '4', name: 'Bruce Banner', alias: 'Hulk', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Superhuman Strength', 'Healing Factor'], weaknesses: ['Anger Control'], image_url: 'https://image.tmdb.org/t/p/w500/5dPHlXC5mE5skzpABDa3RJSF7L6.jpg', is_locked_content: false },
    { id: '5', name: 'Natasha Romanoff', alias: 'Black Widow', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Master Spy', 'Combat Expert'], weaknesses: ['Human Physiology'], image_url: 'https://image.tmdb.org/t/p/w500/qLPRvIBgTqTNkzk3vBMkQPT1qvV.jpg', is_locked_content: false },
    { id: '6', name: 'Wanda Maximoff', alias: 'Scarlet Witch', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Reality Warping', 'Chaos Magic'], weaknesses: ['Mental Instability'], image_url: 'https://image.tmdb.org/t/p/w500/9IkTRvdXDe7IXuuH4rYDBQdaT0x.jpg', is_locked_content: false },
    { id: '7', name: "T'Challa", alias: 'Black Panther', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Vibranium Suit', 'Enhanced Strength'], weaknesses: ['Sonic Attacks'], image_url: 'https://image.tmdb.org/t/p/w500/kfLqxkDmBLvqJfVpVDvj7mR4RZj.jpg', is_locked_content: false },
    { id: '8', name: 'Peter Parker', alias: 'Spider-Man', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Spider-Sense', 'Wall-Crawling'], weaknesses: ['Ethyl Chloride'], image_url: 'https://image.tmdb.org/t/p/w500/1bH7kAoUDc9BNvaVbMSPo9dKdNm.jpg', is_locked_content: false },
    { id: '9', name: 'Logan', alias: 'Wolverine', franchise: 'X-Men', origin_world: 'Earth-10005', powers: ['Adamantium Claws', 'Healing Factor'], weaknesses: ['Muramasa Blade'], image_url: 'https://image.tmdb.org/t/p/w500/cZk2w6gVfLj7NeQrcKwBFVQdg1m.jpg', is_locked_content: false },
    { id: '10', name: 'Charles Xavier', alias: 'Professor X', franchise: 'X-Men', origin_world: 'Earth-10005', powers: ['Telepathy', 'Mind Control'], weaknesses: ['Paralysis'], image_url: 'https://image.tmdb.org/t/p/w500/p0v1jtXxMXn3DexHnJz8LXUhMDd.jpg', is_locked_content: false },
    { id: '11', name: 'Erik Lehnsherr', alias: 'Magneto', franchise: 'X-Men', origin_world: 'Earth-10005', powers: ['Magnetism Control'], weaknesses: ['Non-Metallic Materials'], image_url: 'https://image.tmdb.org/t/p/w500/qW0UJlw4wZH5IHkPjRfN9l5KIZd.jpg', is_locked_content: false },
    { id: '12', name: 'Wade Wilson', alias: 'Deadpool', franchise: 'X-Men', origin_world: 'Earth-TRN414', powers: ['Healing Factor', '4th Wall Awareness'], weaknesses: ['Carbonadium'], image_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', is_locked_content: false },
    { id: '13', name: 'Miles Morales', alias: 'Spider-Man (Miles)', franchise: 'Spider-Verse', origin_world: 'Earth-1610', powers: ['Venom Strike', 'Invisibility'], weaknesses: ['Inexperience'], image_url: 'https://image.tmdb.org/t/p/w500/iiZZdoQBEYhV2r9XBqf4dD4sdQn.jpg', is_locked_content: false },
    { id: '14', name: 'Gwen Stacy', alias: 'Spider-Woman', franchise: 'Spider-Verse', origin_world: 'Earth-65', powers: ['Spider-Sense', 'Acrobatics'], weaknesses: ['Emotional Burden'], image_url: 'https://image.tmdb.org/t/p/w500/eBNFByPNXVBi9cCrCZPDdMRzEEm.jpg', is_locked_content: false },
    { id: '15', name: "Miguel O'Hara", alias: 'Spider-Man 2099', franchise: 'Spider-Verse', origin_world: 'Earth-928', powers: ['Talons', 'Accelerated Vision'], weaknesses: ['Light Sensitivity'], image_url: 'https://image.tmdb.org/t/p/w500/bLMYU3aEXBWI4HvVhwPi6lxGDgL.jpg', is_locked_content: false },
    { id: '16', name: 'Stephen Strange', alias: 'Doctor Strange', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Mystic Arts', 'Time Stone'], weaknesses: ['Arrogance'], image_url: 'https://image.tmdb.org/t/p/w500/4D4qMxS8AjrbcVqcR5y2ubuU7oP.jpg', is_locked_content: false },
    { id: '17', name: 'Scott Lang', alias: 'Ant-Man', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Size Manipulation', 'Ant Communication'], weaknesses: ['Pym Particles Dependency'], image_url: 'https://image.tmdb.org/t/p/w500/lXMyvUz2MqVumVMIMpvNXjSJhXe.jpg', is_locked_content: false },
    { id: '18', name: 'Carol Danvers', alias: 'Captain Marvel', franchise: 'MCU', origin_world: 'Earth-616', powers: ['Energy Absorption', 'Flight', 'Superhuman Strength'], weaknesses: ['Power Overload'], image_url: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg', is_locked_content: false },
]

const franchises = ['All', 'MCU', 'X-Men', 'Spider-Verse']

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<Hero[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [selectedFranchise, setSelectedFranchise] = useState('All')
    const [hasSearched, setHasSearched] = useState(false)

    const performSearch = useCallback((searchQuery: string, franchise: string) => {
        setIsSearching(true)
        setHasSearched(true)

        // Simulate API delay
        setTimeout(() => {
            let filtered = allMockHeroes

            // Filter by franchise
            if (franchise !== 'All') {
                filtered = filtered.filter(h => h.franchise === franchise)
            }

            // Filter by search query
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
        }, 300)
    }, [])

    // Debounced search
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
        <main className="min-h-screen px-4 sm:px-8 pt-8 pb-32">
            {/* Header */}
            <header className="text-center mb-12 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Search className="w-8 h-8 text-cyan-400" />
                    <span className="text-sm font-mono text-cyan-400 tracking-widest uppercase">
                        Multiverse Search Engine
                    </span>
                    <Search className="w-8 h-8 text-cyan-400" />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-orbitron text-center mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 text-glow">
                        NEXUS SEARCH
                    </span>
                </h1>

                <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-inter">
                    Search across all dimensions. Find heroes by name, alias, powers, or origin world.
                </p>
            </header>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="relative">
                    <div className="glass-panel rounded-2xl p-2 flex items-center gap-3">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                            <input
                                type="text"
                                placeholder="Search heroes, powers, or worlds..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full bg-transparent pl-12 pr-10 py-4 text-lg text-white placeholder-neutral-500 focus:outline-none font-inter"
                            />
                            {query && (
                                <button
                                    onClick={() => setQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {isSearching && (
                            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mr-4" />
                        )}
                    </div>

                    {/* Glow effect */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-transparent to-cyan-500/20 blur-xl" />
                </div>

                {/* Franchise Filters */}
                <div className="flex items-center justify-center gap-3 mt-6">
                    <Filter className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-400">Filter:</span>
                    <div className="flex gap-2">
                        {franchises.map((franchise) => (
                            <button
                                key={franchise}
                                onClick={() => setSelectedFranchise(franchise)}
                                className={`px-4 py-2 rounded-full text-sm font-orbitron transition-all ${selectedFranchise === franchise
                                        ? 'bg-cyan-900/50 text-cyan-400 border border-cyan-500/50'
                                        : 'glass-panel text-neutral-400 hover:text-white'
                                    }`}
                            >
                                {franchise}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Suggestions (when no search) */}
            {!hasSearched && (
                <motion.div
                    className="max-w-3xl mx-auto mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 className="text-sm font-orbitron text-neutral-400 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Popular Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {['Iron Man', 'Spider-Man', 'Wolverine', 'Scarlet Witch', 'Deadpool', 'Thor'].map((suggestion) => (
                            <button
                                key={suggestion}
                                onClick={() => setQuery(suggestion)}
                                className="px-4 py-2 text-sm glass-panel rounded-full text-neutral-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Results */}
            <div className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {isSearching ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-20"
                        >
                            <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
                            <p className="text-neutral-400 font-mono">Scanning the multiverse...</p>
                        </motion.div>
                    ) : hasSearched ? (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* Results Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <Badge className="bg-cyan-950/50 border-cyan-500/50 text-cyan-400 font-mono">
                                        {results.length} {results.length === 1 ? 'hero' : 'heroes'} found
                                    </Badge>
                                    {query && (
                                        <span className="text-neutral-400 text-sm">
                                            for &quot;{query}&quot;
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Results Grid */}
                            {results.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {results.map((hero, index) => (
                                        <HeroCard key={hero.id} hero={hero} index={index} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                                    <Search className="w-16 h-16 mb-4 opacity-30" />
                                    <p className="text-lg font-orbitron">No heroes found in this dimension</p>
                                    <p className="text-sm mt-2">Try a different search term or filter</p>
                                </div>
                            )}
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </div>
        </main>
    )
}
