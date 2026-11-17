'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { Film, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { WatchItem } from './meta'
import { FRANCHISE_COLORS } from '@/lib/hero-update'
import { parseRuntimes } from './runtime-parser'

// #516: labels for the tab-derived franchise, with a generic fallback so a new
// franchise in data.ts never gets mislabelled as "DC Universe".
const FRANCHISE_LABELS: Record<string, string> = {
  MCU: 'Marvel Cinematic Universe',
  DC: 'DC Universe',
}

// Lazy-load the table component (contains the bulk of the UI)
const WatchOrderTable = dynamic(() => import('./WatchOrderTable'), {
  ssr: false,
  loading: () => (
    <div className="max-w-4xl mx-auto animate-pulse">
      <div className="flex justify-center mb-10">
        <div className="w-48 h-12 bg-[var(--surface)] rounded-lg" />
      </div>
      <p className="text-center text-[var(--meta)] text-sm mb-10" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-44 bg-[var(--surface)] rounded-lg" />
        ))}
      </div>
    </div>
  ),
})

export default function WatchOrderClient({ items }: { items: WatchItem[] }) {
  const franchises = useMemo(
    () => Array.from(new Set(items.map((item) => item.franchise))),
    [items],
  )
  const [activeTab, setActiveTab] = useState<string>(franchises[0] ?? 'MCU')
  const [sortBy, setSortBy] = useState<'chronological' | 'release'>('chronological')

  const filteredItems = items.filter((item) => item.franchise === activeTab)

  const { totalMinutes, unparseable } = parseRuntimes(filteredItems.map((item) => item.runtime))

  // Report unsupported/unparseable runtimes so they're visible (count + sample)
  if (unparseable.length > 0) {
    console.warn(
      `[watch-order] ${unparseable.length} runtime(s) could not be parsed:`,
      unparseable.slice(0, 5).map((u) => u.original),
    )
  }
  const totalHours = Math.floor(totalMinutes / 60)

  const accentColor = (FRANCHISE_COLORS[activeTab]?.primary ?? 'var(--franchise-mcu)') as string
  const activeLabel = FRANCHISE_LABELS[activeTab] ?? activeTab

  const franchiseTablistRef = useRef<HTMLDivElement>(null)
  const [focusedFranchiseTab, setFocusedFranchiseTab] = useState<string>(activeTab as string)

  // Sync focused tab with activeTab
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFocusedFranchiseTab(activeTab)
  }, [activeTab])

  const handleFranchiseKeyDown = (e: React.KeyboardEvent, franchise: string) => {
    const tabs = franchises as string[]
    const currentIndex = tabs.indexOf(franchise)
    let nextIndex = currentIndex

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault()
        nextIndex = (currentIndex + 1) % tabs.length
        break
      case 'ArrowLeft':
        e.preventDefault()
        nextIndex = (currentIndex - 1 + tabs.length) % tabs.length
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = tabs.length - 1
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        setActiveTab(franchise)
        return
      default:
        return
    }

    const nextFranchise = tabs[nextIndex]
    setFocusedFranchiseTab(nextFranchise)
    const nextElement = franchiseTablistRef.current?.querySelector(
      `[data-franchise-tab="${nextFranchise}"]`,
    )
    ;(nextElement as HTMLElement | null)?.focus()
  }

  return (
    <main className="min-h-screen">
      <section className="relative bg-[var(--bg)] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor}15 0%, transparent 60%)`,
          }}
        />

        <div className="relative container-wide py-28 sm:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg-2)]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                Official Watch Order
              </span>
            </div>

            <h1 className="text-hero mb-6 leading-[1.05]">
              <span className="text-[var(--fg)]">{activeTab}</span>
              <br />
              <span
                className="text-gradient"
                style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #60a5fa)` }}
              >
                Watch Order
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--fg-2)] max-w-2xl mx-auto mb-10 leading-relaxed">
              The complete guide to watching the {activeLabel} in perfect order.
            </p>

            <div className="flex justify-center mb-8">
              <div
                ref={franchiseTablistRef}
                role="tablist"
                aria-label="Franchise"
                className="tabs-list"
              >
                {franchises.map((f) => {
                  const isSelected = activeTab === f
                  return (
                    <button
                      key={f}
                      role="tab"
                      id={`franchise-tab-${f}`}
                      aria-selected={isSelected}
                      aria-controls={`franchise-panel-${f}`}
                      tabIndex={isSelected || focusedFranchiseTab === f ? 0 : -1}
                      data-franchise-tab={f}
                      onClick={() => setActiveTab(f)}
                      onKeyDown={(e) => handleFranchiseKeyDown(e, f)}
                      className={`tab-trigger ${isSelected ? 'active' : ''}`}
                    >
                      {f}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="stat-pill">
                <Film className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="stat-value">{filteredItems.length}</span>
                <span className="stat-label">Movies</span>
              </div>
              <div className="stat-pill">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span className="stat-value">{totalHours}</span>
                <span className="stat-label">Hours</span>
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
          <div
            role="tabpanel"
            id={`franchise-panel-${activeTab}`}
            aria-labelledby={`franchise-tab-${activeTab}`}
          >
            <WatchOrderTable
              items={filteredItems}
              sortBy={sortBy}
              activeTab={activeTab}
              accentColor={accentColor}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
