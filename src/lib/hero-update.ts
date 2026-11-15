import type { Hero } from '@/lib/supabase'

export const FRANCHISE_VALUES = [
  'MCU',
  'X-Men',
  'Spider-Verse',
  'Defenders',
  'DC',
  'Anime',
  'The Boys',
  'Invincible',
  'Other',
] as const

const UPDATEABLE_FIELDS = ['alias', 'name', 'image_url', 'franchise', 'origin_world'] as const

/**
 * Keep only safe, validated fields from a partial hero payload.
 * Returns null when a supplied value is invalid, so callers can abort.
 */
export function sanitizeHeroUpdate(input: Partial<Hero>): Partial<Hero> | null {
  const update: Record<string, string> = {}

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
        if (trimmed && !/^https?:\/\//i.test(trimmed)) return null
        update[field] = trimmed
        break
      }

      case 'franchise': {
        if (typeof value !== 'string') return null
        if (!(FRANCHISE_VALUES as readonly string[]).includes(value)) return null
        update[field] = value
        break
      }
    }
  }

  return update as Partial<Hero>
}
