'use client'

import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import TimelineSlider from '@/components/TimelineSlider'
import type { Movie } from '@/lib/supabase'

type Saga = 'all' | 'infinity' | 'multiverse'

const INFINITY = ['Phase 1', 'Phase 2', 'Phase 3']
const MULTIVERSE = ['Phase 4', 'Phase 5', 'Phase 6']

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

  const entries = Object.entries(phases).filter(([phase, movies]) => {
    if (movies.length === 0) return false
    if (saga === 'infinity') return INFINITY.includes(phase)
    if (saga === 'multiverse') return MULTIVERSE.includes(phase)
    // 'all' shows everything including Unphased
    return true
  })

  const tabs: { key: Saga; label: string }[] = [
    { key: 'all', label: 'All Phases' },
    { key: 'infinity', label: 'Infinity Saga' },
    { key: 'multiverse', label: 'Multiverse Saga' },
  ]

  return (
    <>
      <div className="flex flex-wrap justify-center gap-2 mb-12" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-pressed={saga === t.key}
            onClick={() => setSaga(t.key)}
            className={`tab-trigger ${saga === t.key ? 'active' : ''}`}
          >
            {t.key === 'all' && <Sparkles className="w-4 h-4" />}
            {t.key === 'infinity' && <span className="w-2 h-2 rounded-full bg-purple-500" />}
            {t.key === 'multiverse' && <span className="w-2 h-2 rounded-full bg-red-500" />}
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-16">
        {entries.map(([phase, phaseMovies]) => (
          <div key={phase} className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`w-2.5 h-2.5 rounded-full ${getPhaseColor(phase)}`} />
              <div>
                <h2 className="text-xl font-semibold text-[var(--fg)]">{phase}</h2>
                <p className="text-sm text-[var(--meta)]">{phaseMovies.length} films</p>
              </div>
            </div>
            <TimelineSlider movies={phaseMovies} title="" />
          </div>
        ))}
      </div>
    </>
  )
}
