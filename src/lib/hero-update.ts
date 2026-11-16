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
  'Peacemaker',
  'Gaming',
  'Other',
] as const

const UPDATEABLE_FIELDS = [
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
        update[field] = value.filter((item) => item.trim() !== '').map((item) => item.trim())
        break
      }
    }
  }

  return update as Partial<Hero>
}
