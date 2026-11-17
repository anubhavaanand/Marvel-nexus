'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { useSharedInView } from '@/hooks/useSharedInView'
import Link from 'next/link'
import { Zap, Globe, ArrowRight, Lock } from 'lucide-react'
import type { Hero } from '@/lib/supabase'
import { slugifyAlias } from '@/lib/slugs'
import HeroImage from './HeroImage'

interface HeroCardProps {
  hero: Hero
  index?: number
}

const franchiseColors: Record<string, { primary: string; glow: string }> = {
  MCU: { primary: 'var(--franchise-mcu)', glow: 'rgba(0, 113, 227, 0.25)' },
  'X-Men': { primary: 'var(--franchise-xmen)', glow: 'rgba(234, 179, 8, 0.25)' },
  'Spider-Verse': { primary: 'var(--franchise-spider)', glow: 'rgba(239, 68, 68, 0.25)' },
  Defenders: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)' },
  DC: { primary: 'var(--franchise-dc)', glow: 'rgba(59, 130, 246, 0.25)' },
  Anime: { primary: 'var(--franchise-anime)', glow: 'rgba(249, 115, 22, 0.25)' },
  'The Boys': { primary: 'var(--franchise-theboys)', glow: 'rgba(220, 38, 38, 0.25)' },
  Invincible: { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.25)' },
  Peacemaker: { primary: 'var(--franchise-dc)', glow: 'rgba(59, 130, 246, 0.25)' },
}

export default function HeroCard({ hero, index = 0 }: HeroCardProps) {
  const colors = franchiseColors[hero.franchise] || franchiseColors['MCU']
  const slug = slugifyAlias(hero.alias)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useSharedInView(ref, { once: true, rootMargin: '-50px' })
  const reducedMotion = useReducedMotion()

  return (
    <Link href={`/hero/${slug}`}>
      <motion.article
        ref={ref}
        className="hero-card group"
        initial={reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: reducedMotion ? 0 : 0.6,
          delay: reducedMotion ? 0 : Math.min(index, 6) * 0.06,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="hero-image">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.glow} 0%, var(--surface) 100%)`,
            }}
          >
            <span
              className="text-6xl font-bold opacity-10 select-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: colors.primary,
              }}
            >
              {hero.alias
                .split(' ')
                .map((w) => w[0])
                .join('')
                .slice(0, 2)}
            </span>
          </div>

          <HeroImage
            imageUrl={hero.image_url}
            alias={hero.alias}
            name={hero.actor_name || hero.name}
            priority={index < 6}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />

          <div className="hero-overlay" />

          <div className="absolute top-3 left-3">
            <span
              className="franchise-badge px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm"
              style={{ '--franchise-color': colors.primary } as React.CSSProperties}
            >
              {hero.franchise}
            </span>
          </div>

          {hero.is_locked_content && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg)]">
                <Lock className="w-3 h-3" />
                Premium
              </span>
            </div>
          )}

          {hero.powers && hero.powers.length > 0 && (
            <div className="absolute top-12 left-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg)]">
                <Zap className="w-3 h-3 text-[var(--accent)]" />
                {hero.powers.length}
              </span>
            </div>
          )}
        </div>

        <div className="hero-content">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-[var(--fg)] mb-0.5 leading-tight truncate">
                {hero.alias}
              </h3>
              <p className="text-xs text-[var(--muted)] truncate">{hero.name}</p>
            </div>
            <div className="flex-shrink-0 w-7 h-7 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-3.5 h-3.5 text-[var(--fg)]" />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[var(--meta)] mt-2">
            <Globe className="w-3 h-3" />
            <span>{hero.origin_world}</span>
          </div>

          {hero.powers && hero.powers.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {hero.powers.slice(0, 3).map((power, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--fg-2)] border border-[var(--border-subtle)]"
                >
                  {power}
                </span>
              ))}
              {hero.powers.length > 3 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--meta)] border border-[var(--border-subtle)]">
                  +{hero.powers.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  )
}
