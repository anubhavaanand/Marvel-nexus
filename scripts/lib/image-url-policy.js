// Shared image-URL policy for the admin validator and the maintenance scripts
// (#513): one source of truth so `scripts/test-image-url.js` cannot call a URL
// "Safe to use!" that the app rejects.
'use strict'

const ALLOWED_IMAGE_HOSTS = new Set([
  'image.tmdb.org',
  'images.unsplash.com',
  'unsplash.com',
  'cdn.myanimelist.net',
  'static.wikia.nocookie.net',
])

function getSupabaseHost() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) return null
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

function isPrivateOrReservedIp(hostname) {
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

function isAllowedImageUrl(value) {
  let url
  try {
    url = new URL(value)
  } catch {
    return false
  }
  // #485: next/image remotePatterns only allow https, so reject http here too.
  if (url.protocol !== 'https:') return false
  if (url.username || url.password) return false
  const host = url.hostname.toLowerCase()
  if (!host) return false
  if (isPrivateOrReservedIp(host)) return false

  const allowed = new Set(ALLOWED_IMAGE_HOSTS)
  const supabaseHost = getSupabaseHost()
  if (supabaseHost) allowed.add(supabaseHost.toLowerCase())

  for (const allowedHost of allowed) {
    // Exact match only (#773): suffix matching allowed evil hosts like
    // unsplash.com.evil.example and notunsplash.com.
    if (host === allowedHost) return true
  }
  // Supabase storage hosts are *.supabase.co (and the bare host), but only
  // /storage/** paths (#773 keeps an explicit wildcard rule here).
  if (host === 'supabase.co' || host.endsWith('.supabase.co')) {
    return url.pathname.startsWith('/storage/')
  }

  return false
}

module.exports = { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS }
