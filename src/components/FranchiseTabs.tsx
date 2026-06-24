'use client'

import { useState, Suspense } from 'react'
import { Shield, Atom, Bug, Zap, Swords, Skull, CircleDot } from 'lucide-react'
import type { Hero } from '@/lib/supabase'
import HeroCard from '@/components/HeroCard'
import { HeroGridSkeleton } from '@/components/Skeleton'

interface FranchiseTabsProps {
  data: {
    mcu: Hero[]
    xmen: Hero[]
    spider: Hero[]
    dc: Hero[]
    anime: Hero[]
    theBoys: Hero[]
    peacemaker: Hero[]
  }
}

export default function FranchiseTabs({ data }: FranchiseTabsProps) {
  const [activeTab, setActiveTab] = useState<'mcu' | 'xmen' | 'spider' | 'dc' | 'anime' | 'theBoys' | 'peacemaker'>('mcu')

  const franchises = [
    { id: 'mcu', label: 'MCU', icon: Shield, color: 'var(--franchise-mcu)', count: data.mcu?.length || 0 },
    { id: 'xmen', label: 'X-Men', icon: Atom, color: 'var(--franchise-xmen)', count: data.xmen?.length || 0 },
    { id: 'spider', label: 'Spider-Verse', icon: Bug, color: 'var(--franchise-spider)', count: data.spider?.length || 0 },
    { id: 'dc', label: 'DC', icon: Zap, color: 'var(--franchise-dc)', count: data.dc?.length || 0 },
    { id: 'anime', label: 'Anime', icon: Swords, color: 'var(--franchise-anime)', count: data.anime?.length || 0 },
    { id: 'theBoys', label: 'The Boys', icon: Skull, color: 'var(--franchise-theboys)', count: data.theBoys?.length || 0 },
    { id: 'peacemaker', label: 'Peacemaker', icon: CircleDot, color: 'var(--franchise-dc)', count: data.peacemaker?.length || 0 },
  ] as const

  const activeHeroes = data[activeTab] || []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-center gap-2">
        {franchises.map((franchise) => (
          <button
            key={franchise.id}
            onClick={() => setActiveTab(franchise.id)}
            className={`tab-trigger group ${activeTab === franchise.id ? 'active' : ''}`}
          >
            <franchise.icon className="w-4 h-4" style={{ color: activeTab === franchise.id ? undefined : franchise.color }} />
            <span>{franchise.label}</span>
            <span className="text-xs opacity-60">({franchise.count})</span>
          </button>
        ))}
      </div>

      <Suspense fallback={<HeroGridSkeleton count={8} />}>
        <div className="mt-8">
          {activeHeroes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[var(--meta)]" />
              </div>
              <p className="text-lg font-medium text-[var(--fg)]">No heroes found in this dimension</p>
              <p className="text-sm text-[var(--meta)] mt-2">Check back later or seed the database</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {activeHeroes.map((hero, index) => (
                <HeroCard key={hero.id} hero={hero} index={index} />
              ))}
            </div>
          )}
        </div>
      </Suspense>
    </div>
  )
}
