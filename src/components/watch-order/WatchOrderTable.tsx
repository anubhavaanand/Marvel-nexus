'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpDown, Calendar } from 'lucide-react'
import { WatchItem } from './data'
import WatchItemCard from './WatchItemCard'

interface WatchOrderTableProps {
  items: WatchItem[]
  sortBy: 'chronological' | 'release'
  activeTab: string
  accentColor: string
  onSortChange: (sortBy: 'chronological' | 'release') => void
}

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-center mb-10">
        <div className="tabs-list">
          <button
            onClick={() => onSortChange('chronological')}
            className={`tab-trigger ${sortBy === 'chronological' ? 'active' : ''}`}
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Chronological</span>
            <span className="sm:hidden">Story</span>
          </button>
          <button
            onClick={() => onSortChange('release')}
            className={`tab-trigger ${sortBy === 'release' ? 'active' : ''}`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Release Date</span>
            <span className="sm:hidden">Release</span>
          </button>
        </div>
      </div>

      <p className="text-center text-[var(--meta)] text-sm mb-10">
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
        >
          {sortedItems.map((item, index) => (
            <WatchItemCard key={item.id} item={item} index={index} accentColor={accentColor} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
