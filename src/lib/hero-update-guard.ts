import type { Hero } from '@/lib/supabase'
import { UPDATEABLE_FIELDS } from './hero-update'

// Caps chosen to bound admin mutation payloads while staying comfortably
// above legitimate hero edits.
export const HERO_UPDATE_MAX_FIELDS = 16
export const HERO_UPDATE_MAX_STRING_LENGTH = 500
export const HERO_UPDATE_MAX_ARRAY_ITEMS = 50
export const HERO_UPDATE_MAX_ARRAY_ITEM_LENGTH = 200

// Allowlist of keys that may appear in a hero update payload.
// Mirrors the sanitizer's allowlist (defense in depth).
const ALLOWED_KEYS = new Set<string>(UPDATEABLE_FIELDS)

export function isValidHeroUpdatePayload(input: unknown): input is Partial<Hero> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return false

  const record = input as Record<string, unknown>
  const keys = Object.keys(record)
  if (keys.length > HERO_UPDATE_MAX_FIELDS) return false

  for (const [key, value] of Object.entries(record)) {
    if (typeof key !== 'string' || key.length > 64) return false
    if (!ALLOWED_KEYS.has(key)) return false

    if (value === null) continue
    if (typeof value === 'boolean') continue
    if (typeof value === 'string') {
      if (value.length > HERO_UPDATE_MAX_STRING_LENGTH) return false
      continue
    }
    if (Array.isArray(value)) {
      if (value.length > HERO_UPDATE_MAX_ARRAY_ITEMS) return false
      for (const item of value) {
        if (typeof item !== 'string') return false
        if (item.length > HERO_UPDATE_MAX_ARRAY_ITEM_LENGTH) return false
      }
      continue
    }
    // Any other type (number, object, function) is not a valid hero field value.
    return false
  }

  return true
}
