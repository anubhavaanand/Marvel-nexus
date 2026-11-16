'use client'

import { useState } from 'react'
import { Film, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'
import { watchOrderData } from './data'

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

export default function WatchOrderClient() {
  const [activeTab, setActiveTab] = useState<'MCU' | 'DC'>('MCU')
  const [sortBy, setSortBy] = useState<'chronological' | 'release'>('chronological')

  const filteredItems = watchOrderData.filter((item) => item.franchise === activeTab)

  const totalMinutes = filteredItems.reduce((sum, item) => {
    const match = item.runtime?.match(/^(\d+)h (\d+)m$/)
    return match ? sum + parseInt(match[1], 10) * 60 + parseInt(match[2], 10) : sum
  }, 0)
  const totalHours = Math.floor(totalMinutes / 60)

  const accentColor = activeTab === 'MCU' ? 'var(--franchise-mcu)' : 'var(--franchise-dc)'

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
              The complete guide to watching the{' '}
              {activeTab === 'MCU' ? 'Marvel Cinematic Universe' : 'DC Universe'} in perfect order.
            </p>

            <div className="flex justify-center mb-8">
              <div className="tabs-list">
                <button
                  onClick={() => setActiveTab('MCU')}
                  className={`tab-trigger ${activeTab === 'MCU' ? 'active' : ''}`}
                >
                  MCU
                </button>
                <button
                  onClick={() => setActiveTab('DC')}
                  className={`tab-trigger ${activeTab === 'DC' ? 'active' : ''}`}
                >
                  DC
                </button>
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
          <WatchOrderTable
            items={filteredItems}
            sortBy={sortBy}
            activeTab={activeTab}
            accentColor={accentColor}
            onSortChange={setSortBy}
          />
        </div>
      </section>
    </main>
  )
}
