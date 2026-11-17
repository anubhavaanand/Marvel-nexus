'use client'

import { useState, useRef, useCallback, useMemo } from 'react'
import { Sparkles } from 'lucide-react'
import TimelineSlider from '@/components/TimelineSlider'
import type { Movie } from '@/lib/supabase'

type Saga = 'all' | 'infinity' | 'multiverse'

const INFINITY = ['Phase 1', 'Phase 2', 'Phase 3']
const MULTIVERSE = ['Phase 4', 'Phase 5', 'Phase 6']

const PAGE_SIZE = 12

function getPhaseColor(phase: string): string {
  const colors: Record<string, string> = {
    'Phase 1': 'bg-[var(--franchise-mcu)]',
    'Phase 2': 'bg-purple-500',
    'Phase 3': 'bg-[var(--franchise-spider)]',
    'Phase 4': 'bg-[var(--success)]',
    'Phase 5': 'bg-[var(--franchise-anime)]',
    'Phase 6': 'bg-[var(--accent)]',
    Unphased: 'bg-[var(--meta)]',
  }
  return colors[phase] || 'bg-[var(--meta)]'
}

export default function TimelineSagaTabs({ phases }: { phases: Record<string, Movie[]> }) {
  const [saga, setSaga] = useState<Saga>('all')
  const [visible, setVisible] = useState<Record<string, number>>({})
  const tabRefs = useRef<Record<Saga, HTMLButtonElement | null>>({
    all: null,
    infinity: null,
    multiverse: null,
  })

  const entries = Object.entries(phases).filter(([phase, movies]) => {
    if (movies.length === 0) return false
    if (saga === 'infinity') return INFINITY.includes(phase)
    if (saga === 'multiverse') return MULTIVERSE.includes(phase)
    // 'all' shows everything including Unphased
    return true
  })

  const tabs = useMemo<{ key: Saga; label: string }[]>(
    () => [
      { key: 'all', label: 'All Phases' },
      { key: 'infinity', label: 'Infinity Saga' },
      { key: 'multiverse', label: 'Multiverse Saga' },
    ],
    [],
  )

  const focusTab = useCallback((key: Saga) => {
    tabRefs.current[key]?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, key: Saga) => {
      const idx = tabs.findIndex((t) => t.key === key)
      if (idx < 0) return
      let next: Saga | null = null
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          next = tabs[(idx + 1) % tabs.length].key
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          next = tabs[(idx - 1 + tabs.length) % tabs.length].key
          break
        case 'Home':
          next = tabs[0].key
          break
        case 'End':
          next = tabs[tabs.length - 1].key
          break
        default:
          return
      }
      e.preventDefault()
      setSaga(next)
      focusTab(next)
    },
    [tabs, focusTab],
  )

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            ref={(el) => {
              tabRefs.current[t.key] = el
            }}
            type="button"
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={saga === t.key}
            aria-controls={`tabpanel-${t.key}`}
            tabIndex={saga === t.key ? 0 : -1}
            onClick={() => setSaga(t.key)}
            onKeyDown={(e) => handleKeyDown(e, t.key)}
            className={`tab-trigger ${saga === t.key ? 'active' : ''}`}
          >
            {t.key === 'all' && <Sparkles className="w-4 h-4" />}
            {t.key === 'infinity' && <span className="w-2 h-2 rounded-full bg-purple-500" />}
            {t.key === 'multiverse' && <span className="w-2 h-2 rounded-full bg-red-500" />}
            {t.label}
          </button>
        ))}
      </div>

      <div
        id={`tabpanel-${saga}`}
        role="tabpanel"
        aria-labelledby={`tab-${saga}`}
        tabIndex={0}
        className="space-y-16"
      >
        {entries.map(([phase, phaseMovies]) => {
          const visibleCount = Math.min(visible[phase] ?? PAGE_SIZE, phaseMovies.length)
          const shown = phaseMovies.slice(0, visibleCount)
          const hasMore = visibleCount < phaseMovies.length
          return (
            <div key={phase} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className={`w-2.5 h-2.5 rounded-full ${getPhaseColor(phase)}`} />
                <div>
                  <h2 className="text-xl font-semibold text-[var(--fg)]">{phase}</h2>
                  <p className="text-sm text-[var(--meta)]">{phaseMovies.length} films</p>
                </div>
              </div>
              <TimelineSlider movies={shown} title="" />
              {hasMore && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisible((v) => ({
                        ...v,
                        [phase]: Math.min((v[phase] ?? PAGE_SIZE) + PAGE_SIZE, phaseMovies.length),
                      }))
                    }
                    className="px-4 py-2 rounded-md border border-[var(--border)] text-sm text-[var(--fg-2)] hover:text-[var(--fg)]"
                  >
                    Show more
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
