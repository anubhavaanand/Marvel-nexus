import type { Hero } from '@/lib/supabase'

// #513: the URL policy is shared with scripts/test-image-url.js so a URL the
// script calls safe is also one the admin validator accepts.
import { isAllowedImageUrl } from '../../scripts/lib/image-url-policy'

export { isAllowedImageUrl }

export const FRANCHISE_VALUES = [
  'MCU',
  'X-Men',
  'Spider-Verse',
  'Defenders',
  'DC',
  'Anime',
  'The Boys',
  'Invincible',
  'Peacemaker',
  'Gaming',
  'Other',
] as const

// #515: single source of truth for franchise colours, covering every value in
// FRANCHISE_VALUES (Peacemaker previously fell back, Gaming/Other were missing).
export const FRANCHISE_COLORS: Record<string, { primary: string; glow: string }> = {
  MCU: { primary: 'var(--franchise-mcu)', glow: 'rgba(0, 113, 227, 0.3)' },
  'X-Men': { primary: 'var(--franchise-xmen)', glow: 'rgba(234, 179, 8, 0.3)' },
  'Spider-Verse': { primary: 'var(--franchise-spider)', glow: 'rgba(239, 68, 68, 0.3)' },
  Defenders: { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)' },
  DC: { primary: 'var(--franchise-dc)', glow: 'rgba(59, 130, 246, 0.3)' },
  Anime: { primary: 'var(--franchise-anime)', glow: 'rgba(249, 115, 22, 0.3)' },
  'The Boys': { primary: 'var(--franchise-theboys)', glow: 'rgba(220, 38, 38, 0.3)' },
  Invincible: { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.3)' },
  Peacemaker: { primary: 'var(--franchise-dc)', glow: 'rgba(59, 130, 246, 0.3)' },
  Gaming: { primary: 'var(--franchise-gaming)', glow: 'rgba(168, 85, 247, 0.3)' },
  Other: { primary: 'var(--franchise-other)', glow: 'rgba(148, 163, 184, 0.3)' },
}

export const UPDATEABLE_FIELDS = [
  'alias',
  'name',
  'image_url',
  'franchise',
  'origin_world',
  'is_locked_content',
  'actor_name',
  'powers',
  'weaknesses',
] as const

/**
 * Keep only safe, validated fields from a partial hero payload.
 * Returns null when a supplied value is invalid, so callers can abort.
 */
export function sanitizeHeroUpdate(input: Partial<Hero>): Partial<Hero> | null {
  const update: Record<string, string | boolean | string[] | null> = {}

  for (const field of UPDATEABLE_FIELDS) {
    const value = input[field]
    if (value === undefined) continue

    switch (field) {
      case 'alias':
      case 'name':
      case 'origin_world':
        if (typeof value !== 'string' || value.trim() === '') return null
        update[field] = value.trim()
        break

      case 'image_url': {
        if (typeof value !== 'string') return null
        const trimmed = value.trim()
        if (trimmed && !isAllowedImageUrl(trimmed)) return null
        update[field] = trimmed
        break
      }

      case 'franchise': {
        if (typeof value !== 'string') return null
        if (!(FRANCHISE_VALUES as readonly string[]).includes(value)) return null
        update[field] = value
        break
      }

      case 'is_locked_content': {
        if (typeof value !== 'boolean') return null
        update[field] = value
        break
      }

      case 'actor_name': {
        if (value !== null && typeof value !== 'string') return null
        update[field] = value === null ? null : value.trim()
        break
      }

      case 'powers':
      case 'weaknesses': {
        if (!Array.isArray(value) || !value.every((item) => typeof item === 'string')) return null
        // Trim, drop empties and de-duplicate so duplicate React keys/radar
        // axes cannot come from imported or hand-edited data (#454).
        update[field] = Array.from(
          new Set(value.filter((item) => item.trim() !== '').map((item) => item.trim())),
        )
        break
      }
    }
  }

  return update as Partial<Hero>
}
