'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'
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
  const [canScrollRight, setCanScrollRight] = useState(false)
  const canScrollLeftRef = useRef(canScrollLeft)
  const canScrollRightRef = useRef(canScrollRight)
  const rafRef = useRef<number | null>(null)
  const scrollSettleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current
    if (!container) return
    const nextLeft = container.scrollLeft > 0
    const nextRight = container.scrollLeft < container.scrollWidth - container.clientWidth - 10
    // Only trigger a re-render when the enabled/disabled state actually flips.
    if (nextLeft !== canScrollLeftRef.current) {
      canScrollLeftRef.current = nextLeft
      setCanScrollLeft(nextLeft)
    }
    if (nextRight !== canScrollRightRef.current) {
      canScrollRightRef.current = nextRight
      setCanScrollRight(nextRight)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (container) {
      const scrollAmount = 400
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
      if (scrollSettleTimeoutRef.current) clearTimeout(scrollSettleTimeoutRef.current)
      scrollSettleTimeoutRef.current = setTimeout(updateScrollButtons, 100)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    let idleTimeout: ReturnType<typeof setTimeout> | null = null
    const onScroll = () => {
      // Coalesce scroll events: at most one state update per animation frame,
      // and only when the nav-button enabled state actually changes.
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        updateScrollButtons()
      })
      if (idleTimeout) clearTimeout(idleTimeout)
      idleTimeout = setTimeout(updateScrollButtons, 100)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    // Initial measurement after mount.
    updateScrollButtons()
    // Recompute on resize / content size changes.
    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => updateScrollButtons())
      resizeObserver.observe(container)
    }
    window.addEventListener('resize', updateScrollButtons)
    return () => {
      if (idleTimeout) clearTimeout(idleTimeout)
      if (scrollSettleTimeoutRef.current) clearTimeout(scrollSettleTimeoutRef.current)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      container.removeEventListener('scroll', onScroll)
      if (resizeObserver) resizeObserver.disconnect()
      window.removeEventListener('resize', updateScrollButtons)
    }
  }, [])

  if (!movies || movies.length === 0) {
    return (
      <div className="glass-panel rounded-xl p-6">
        {/* #490: no orphan icon/blank heading when the caller passes no title. */}
        {title ? <h3 className="text-lg font-orbitron text-cyan-400 mb-4">{title}</h3> : null}
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
        {/* #490: omit the heading entirely when there is no title to show. */}
        {title ? (
          <h3 className="text-xl font-orbitron text-cyan-400 flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            {title}
          </h3>
        ) : null}

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-lg glass-panel transition-all ${
              canScrollLeft
                ? 'hover:border-cyan-500/50 cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
            whileHover={
              canScrollLeft
                ? {
                    scale: 1.1,
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }
                : {}
            }
            whileTap={
              canScrollLeft
                ? {
                    scale: 0.9,
                    transition: { type: 'spring', stiffness: 400, damping: 17 },
                  }
                : {}
            }
            aria-label="Scroll timeline left"
          >
            <ChevronLeft className="w-5 h-5 text-cyan-400" />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-lg glass-panel transition-all ${
              canScrollRight
                ? 'hover:border-cyan-500/50 cursor-pointer'
                : 'opacity-30 cursor-not-allowed'
            }`}
            whileHover={
              canScrollRight
                ? {
                    scale: 1.1,
                    transition: { type: 'spring', stiffness: 300, damping: 20 },
                  }
                : {}
            }
            whileTap={
              canScrollRight
                ? {
                    scale: 0.9,
                    transition: { type: 'spring', stiffness: 400, damping: 17 },
                  }
                : {}
            }
            aria-label="Scroll timeline right"
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
              className="glass-panel glass-card-hover holographic-glare rounded-xl overflow-hidden cursor-pointer"
              whileHover={{
                y: -8,
                transition: {
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                },
              }}
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
                    loading="lazy"
                    decoding="async"
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
                    <Badge
                      className={`${phaseColors[movie.phase]} text-white text-xs font-orbitron`}
                    >
                      {movie.phase}
                    </Badge>
                  </div>
                )}

                {/* Rating */}
                {/* #501: a real 0.0 rating must not be swallowed by truthiness */}
                {movie.tmdb_rating != null && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-white font-mono" title="TMDB rating">
                      {movie.tmdb_rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <h4 className="font-orbitron text-sm text-white truncate">{movie.title}</h4>
                <p className="text-xs text-neutral-500 font-mono">
                  {movie.release_date
                    ? new Date(`${movie.release_date}T00:00:00Z`).getUTCFullYear()
                    : 'TBA'}
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
      <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[var(--bg)] to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none" />
    </motion.div>
  )
}
