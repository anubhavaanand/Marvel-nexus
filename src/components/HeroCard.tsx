'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Lock, Zap, Globe, ArrowRight } from 'lucide-react'
import type { Hero } from '@/lib/supabase'
import HeroImage from './HeroImage'

interface HeroCardProps {
  hero: Hero
  index?: number
}

const franchiseColors: Record<string, { primary: string; glow: string }> = {
  'MCU': { primary: 'var(--franchise-mcu)', glow: 'rgba(0, 113, 227, 0.25)' },
  'X-Men': { primary: 'var(--franchise-xmen)', glow: 'rgba(234, 179, 8, 0.25)' },
  'Spider-Verse': { primary: 'var(--franchise-spider)', glow: 'rgba(239, 68, 68, 0.25)' },
  'Defenders': { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.25)' },
  'DC': { primary: 'var(--franchise-dc)', glow: 'rgba(59, 130, 246, 0.25)' },
  'Anime': { primary: 'var(--franchise-anime)', glow: 'rgba(249, 115, 22, 0.25)' },
  'The Boys': { primary: 'var(--franchise-theboys)', glow: 'rgba(220, 38, 38, 0.25)' },
  'Invincible': { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.25)' },
  'Peacemaker': { primary: 'var(--franchise-dc)', glow: 'rgba(59, 130, 246, 0.25)' },
}

export default function HeroCard({ hero, index = 0 }: HeroCardProps) {
  const colors = franchiseColors[hero.franchise] || franchiseColors['MCU']
  const slug = hero.alias.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsAdmin(sessionStorage.getItem('admin_auth') === 'true')
    })
  }, [])

  return (
    <Link href={hero.is_locked_content && !isAdmin ? '#' : `/hero/${slug}`}>
      <motion.article
        ref={ref}
        className="hero-card group"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.6,
          delay: index * 0.06,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        <div className="hero-image">
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colors.glow} 0%, var(--surface) 100%)`
            }}
          >
            <span
              className="text-6xl font-bold opacity-10 select-none"
              style={{
                fontFamily: 'var(--font-display)',
                color: colors.primary
              }}
            >
              {hero.alias.split(' ').map(w => w[0]).join('').slice(0, 2)}
            </span>
          </div>

          <HeroImage
            imageUrl={hero.image_url}
            alias={hero.alias}
            name={hero.actor_name || hero.name}
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

          {hero.powers && hero.powers.length > 0 && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg)]">
                <Zap className="w-3 h-3 text-[var(--accent)]" />
                {hero.powers.length}
              </span>
            </div>
          )}

          {hero.is_locked_content && !isAdmin && (
            <div className="absolute inset-0 bg-[var(--bg)]/70 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                  <Lock className="w-4 h-4 text-[var(--muted)]" />
                </div>
                <span className="text-xs font-medium text-[var(--muted)]">Premium</span>
              </div>
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
