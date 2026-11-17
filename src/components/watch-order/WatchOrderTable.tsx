'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, Calendar } from 'lucide-react'
import type { WatchItem } from './meta'
import WatchItemCard from './WatchItemCard'

interface WatchOrderTableProps {
  items: WatchItem[]
  sortBy: 'chronological' | 'release'
  activeTab: string
  accentColor: string
  onSortChange: (sortBy: 'chronological' | 'release') => void
}

const sortTabs = [
  { id: 'chronological', label: 'Chronological', shortLabel: 'Story', icon: ArrowUpDown },
  { id: 'release', label: 'Release Date', shortLabel: 'Release', icon: Calendar },
] as const

type SortTabId = (typeof sortTabs)[number]['id']

export default function WatchOrderTable({
  items,
  sortBy,
  activeTab,
  accentColor,
  onSortChange,
}: WatchOrderTableProps) {
  const sortedItems = [...items].sort((a, b) => {
    if (sortBy === 'chronological') {
      // #530: Elseworlds titles share chronologicalOrder 0, so fall back to the
      // curated release order instead of relying on array insertion order.
      const byChronological = a.chronologicalOrder - b.chronologicalOrder
      if (byChronological !== 0) return byChronological
      return a.releaseOrder - b.releaseOrder
    }
    return a.releaseOrder - b.releaseOrder
  })

  const tablistRef = useRef<HTMLDivElement>(null)
  const [focusedTabId, setFocusedTabId] = useState<SortTabId>(sortBy)

  const handleKeyDown = (e: React.KeyboardEvent, tabId: SortTabId) => {
    const tabs = sortTabs.map((t) => t.id)
    const currentIndex = tabs.indexOf(tabId)
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
        onSortChange(tabId)
        return
      default:
        return
    }

    const nextTabId = tabs[nextIndex]
    setFocusedTabId(nextTabId)
    const nextElement = tablistRef.current?.querySelector(`[data-tab-id="${nextTabId}"]`)
    ;(nextElement as HTMLElement | null)?.focus()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-center mb-10">
        <div ref={tablistRef} role="tablist" aria-label="Sort order" className="tabs-list">
          {sortTabs.map((tab) => {
            const isSelected = sortBy === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                role="tab"
                id={`sort-tab-${tab.id}`}
                aria-selected={isSelected}
                aria-controls={`sort-panel-${tab.id}`}
                tabIndex={isSelected || focusedTabId === tab.id ? 0 : -1}
                data-tab-id={tab.id}
                onClick={() => onSortChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, tab.id)}
                className={`tab-trigger ${isSelected ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            )
          })}
        </div>
      </div>

      <p className="text-center text-[var(--meta)] text-sm mb-10" id="sort-description">
        {sortBy === 'chronological'
          ? 'Watch in story timeline order (recommended for rewatches)'
          : 'Watch in the order movies were released (recommended for first-timers)'}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + sortBy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          role="tabpanel"
          id={`sort-panel-${sortBy}`}
          aria-labelledby={`sort-tab-${sortBy}`}
          tabIndex={0}
        >
          {sortedItems.map((item, index) => (
            <WatchItemCard key={item.id} item={item} index={index} accentColor={accentColor} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
