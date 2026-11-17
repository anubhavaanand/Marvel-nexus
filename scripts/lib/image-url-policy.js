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

function isCanonicalIpv4(hostname) {
  // Exactly four decimal octets 0-255, no leading zeros (except '0' itself)
  const match =
    /^(?:(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-5]|0)\.){3}(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-5]|0)$/.exec(
      hostname,
    )
  if (!match) return null
  return hostname.split('.').map((n) => Number(n))
}

function isPrivateOrReservedIp(hostname) {
  // Check for canonical IPv4 first
  const octets = isCanonicalIpv4(hostname)
  if (octets) {
    const [a, b] = octets
    if (a === 10) return true // 10.0.0.0/8
    if (a === 127) return true // 127.0.0.0/8
    if (a === 0) return true // 0.0.0.0/8
    if (a === 169 && b === 254) return true // 169.254.0.0/16
    if (a === 172 && b >= 16 && b <= 31) return true // 172.16.0.0/12
    if (a === 192 && b === 168) return true // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true // 100.64.0.0/10
    if (a >= 224) return true // multicast (224.0.0.0/4) and reserved (240.0.0.0/4)
    return false
  }

  // Decimal integer form (e.g., 2130706433 = 127.0.0.1)
  const asNumber = Number(hostname)
  if (Number.isInteger(asNumber) && asNumber >= 0 && asNumber <= 0xffffffff) {
    const a = (asNumber >>> 24) & 0xff
    const b = (asNumber >>> 16) & 0xff
    const c = (asNumber >>> 8) & 0xff
    const d = asNumber & 0xff
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

  // IPv6 forms
  const lower = hostname.toLowerCase()
  if (lower === 'localhost' || lower.endsWith('.localhost')) return true
  if (lower === '::1' || lower === '[::1]') return true

  // IPv4-mapped IPv6: ::ffff:127.0.0.1 or ::ffff:7f00:1 (compressed)
  const mappedMatch = /^\[?::ffff:([0-9a-f.:]+)\]?$/i.exec(lower)
  if (mappedMatch) {
    const inner = mappedMatch[1]
    // Check if inner is an IPv4 address
    const ipv4Octets = isCanonicalIpv4(inner)
    if (ipv4Octets) {
      const [a, b] = ipv4Octets
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
    // Check if inner is a compressed IPv4 (e.g., 7f00:1)
    const compressedMatch = /^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(inner)
    if (compressedMatch) {
      const high = parseInt(compressedMatch[1], 16)
      const low = parseInt(compressedMatch[2], 16)
      const a = (high >>> 8) & 0xff
      const b = high & 0xff
      const c = (low >>> 8) & 0xff
      const d = low & 0xff
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
  }

  // Link-local (fe80::/10) and ULA (fc00::/7)
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

module.exports = { isAllowedImageUrl, ALLOWED_IMAGE_HOSTS, isPrivateOrReservedIp }
