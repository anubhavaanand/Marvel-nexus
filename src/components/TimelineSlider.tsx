'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Movie } from '@/lib/supabase'

interface TimelineSliderProps {
    movies: Movie[]
    title?: string
}

const phaseColors: Record<string, string> = {
    'Phase 1': 'bg-blue-500',
    'Phase 2': 'bg-purple-500',
    'Phase 3': 'bg-red-500',
    'Phase 4': 'bg-green-500',
    'Phase 5': 'bg-orange-500',
    'Phase 6': 'bg-cyan-500',
}

export default function TimelineSlider({ movies, title = 'MCU Timeline' }: TimelineSliderProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScrollPosition = () => {
        const container = scrollContainerRef.current
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0)
            setCanScrollRight(
                container.scrollLeft < container.scrollWidth - container.clientWidth - 10
            )
        }
    }

    const scroll = (direction: 'left' | 'right') => {
        const container = scrollContainerRef.current
        if (container) {
            const scrollAmount = 400
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
            setTimeout(checkScrollPosition, 300)
        }
    }

    if (!movies || movies.length === 0) {
        return (
            <div className="glass-panel rounded-xl p-6">
                <h3 className="text-lg font-orbitron text-cyan-400 mb-4">{title}</h3>
                <div className="h-48 flex items-center justify-center text-neutral-500">
                    No movies in timeline
                </div>
            </div>
        )
    }

    return (
        <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-orbitron text-cyan-400 flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    {title}
                </h3>

                {/* Navigation Buttons */}
                <div className="flex gap-2">
                    <motion.button
                        onClick={() => scroll('left')}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded-lg glass-panel transition-all ${canScrollLeft
                                ? 'hover:border-cyan-500/50 cursor-pointer'
                                : 'opacity-30 cursor-not-allowed'
                            }`}
                        whileHover={canScrollLeft ? { scale: 1.1 } : {}}
                        whileTap={canScrollLeft ? { scale: 0.9 } : {}}
                    >
                        <ChevronLeft className="w-5 h-5 text-cyan-400" />
                    </motion.button>
                    <motion.button
                        onClick={() => scroll('right')}
                        disabled={!canScrollRight}
                        className={`p-2 rounded-lg glass-panel transition-all ${canScrollRight
                                ? 'hover:border-cyan-500/50 cursor-pointer'
                                : 'opacity-30 cursor-not-allowed'
                            }`}
                        whileHover={canScrollRight ? { scale: 1.1 } : {}}
                        whileTap={canScrollRight ? { scale: 0.9 } : {}}
                    >
                        <ChevronRight className="w-5 h-5 text-cyan-400" />
                    </motion.button>
                </div>
            </div>

            {/* Timeline Line */}
            <div className="absolute top-[50%] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent pointer-events-none" />

            {/* Scrollable Container */}
            <div
                ref={scrollContainerRef}
                onScroll={checkScrollPosition}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {movies.map((movie, index) => (
                    <motion.div
                        key={movie.id}
                        className="flex-shrink-0 w-56"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        {/* Movie Card */}
                        <motion.div
                            className="glass-panel glass-card-hover rounded-xl overflow-hidden cursor-pointer"
                            whileHover={{ y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Poster */}
                            <div className="relative h-80">
                                {movie.poster_url ? (
                                    <Image
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        fill
                                        className="object-cover"
                                        sizes="224px"
                                    />
                                ) : (
                                    <div className="w-full h-full skeleton flex items-center justify-center">
                                        <span className="text-4xl opacity-30">🎬</span>
                                    </div>
                                )}

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                                {/* Phase Badge */}
                                {movie.phase && (
                                    <div className="absolute top-3 left-3">
                                        <Badge className={`${phaseColors[movie.phase]} text-white text-xs font-orbitron`}>
                                            {movie.phase}
                                        </Badge>
                                    </div>
                                )}

                                {/* Rating */}
                                {movie.imdb_rating && (
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs text-white font-mono">{movie.imdb_rating}</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="p-4 space-y-2">
                                <h4 className="font-orbitron text-sm text-white truncate">
                                    {movie.title}
                                </h4>
                                <p className="text-xs text-neutral-500 font-mono">
                                    {movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Timeline Dot */}
                        <div className="flex justify-center -mt-2">
                            <motion.div
                                className={`w-3 h-3 rounded-full ${movie.phase ? phaseColors[movie.phase] : 'bg-cyan-500'}`}
                                whileHover={{ scale: 1.5 }}
                                style={{ boxShadow: '0 0 10px currentColor' }}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Fade edges */}
            <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </motion.div>
    )
}
