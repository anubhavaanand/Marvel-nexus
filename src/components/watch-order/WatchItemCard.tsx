'use client'

import { motion } from 'framer-motion'
import { Film, Tv, Clock, Star, Calendar } from 'lucide-react'
import HeroImage from '@/components/HeroImage'
import { type WatchItem, phaseColors } from './meta'
import { formatReleaseDate } from './date-utils'

interface WatchItemCardProps {
  item: WatchItem
  index: number
  accentColor: string
}

export default function WatchItemCard({ item, index, accentColor }: WatchItemCardProps) {
  const colors = phaseColors[item.phase] || phaseColors['Phase 1']
  const formattedDate = formatReleaseDate(item.release_date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      className="mb-4"
    >
      <div className="card-glass overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div
            className={`flex sm:flex-col items-center justify-center p-4 sm:p-5 ${colors.bg} sm:w-16`}
          >
            <span className={`text-xl sm:text-2xl font-semibold ${colors.text}`}>{index + 1}</span>
          </div>

          <div className="relative w-full sm:w-28 h-44 sm:h-auto flex-shrink-0 bg-[var(--surface)]">
            <HeroImage
              imageUrl={item.poster_url ?? null}
              alias={item.title}
              name={item.title}
              sizes="(max-width: 640px) 100vw, 112px"
              lookupType="movie"
            />
          </div>

          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text}`}
                >
                  {item.phase}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium glass text-[var(--muted)]">
                  {item.type === 'movie' ? (
                    <Film className="w-3 h-3" />
                  ) : (
                    <Tv className="w-3 h-3" />
                  )}
                  {item.type}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium glass text-[var(--muted)]">
                  {formattedDate ? (
                    <>
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </>
                  ) : (
                    item.year
                  )}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-[var(--fg)] mb-1.5">
                {item.title}
              </h3>

              <p className="text-sm text-[var(--muted)] mb-2 line-clamp-2">{item.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
              {item.runtime && (
                <div className="flex items-center gap-1 text-[var(--meta)]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs">{item.runtime}</span>
                </div>
              )}
              {item.rating && (
                <div className="flex items-center gap-1 text-[#ca8a04]">
                  <Star className="w-3.5 h-3.5 fill-[#ca8a04]" />
                  <span className="text-xs">{item.rating}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs" style={{ color: accentColor }}>
                <Tv className="w-3.5 h-3.5" />
                <span>{item.platform}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
