import type { Hero } from '@/lib/supabase'

const ALLOWED_IMAGE_HOSTS = new Set([
  'image.tmdb.org',
  'images.unsplash.com',
  'unsplash.com',
  'cdn.myanimelist.net',
  'static.wikia.nocookie.net',
])

function getSupabaseHost(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

function isPrivateOrReservedIp(hostname: string): boolean {
  // IPv4
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(hostname)
  if (ipv4) {
    const octets = ipv4.slice(1).map((n) => Number(n))
    if (octets.some((n) => n > 255)) return true
    const [a, b] = octets
    if (a === 10) return true
    if (a === 127) return true
    if (a === 0) return true
    if (a === 169 && b === 254) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 192 && b === 168) return true
    if (a === 100 && b >= 64 && b <= 127) return true
    if (a >= 224) return true
    return false
  }
  const lower = hostname.toLowerCase()
  if (lower === 'localhost' || lower.endsWith('.localhost')) return true
  if (lower === '::1' || lower === '[::1]') return true
  if (lower.startsWith('fe80:') || lower.startsWith('fc') || lower.startsWith('fd')) return true
  return false
}

export function isAllowedImageUrl(value: string): boolean {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false
  if (url.username || url.password) return false
  const host = url.hostname.toLowerCase()
  if (!host) return false
  if (isPrivateOrReservedIp(host)) return false

  const allowed = new Set(ALLOWED_IMAGE_HOSTS)
  const supabaseHost = getSupabaseHost()
  if (supabaseHost) allowed.add(supabaseHost.toLowerCase())

  for (const allowedHost of allowed) {
    if (host === allowedHost || host.endsWith('.' + allowedHost)) return true
  }
  // Supabase storage hosts are *.supabase.co
  if (host === 'supabase.co' || host.endsWith('.supabase.co')) return true

  return false
}

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
        update[field] = value.filter((item) => item.trim() !== '').map((item) => item.trim())
        break
      }
    }
  }

  return update as Partial<Hero>
}
