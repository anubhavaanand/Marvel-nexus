// Shared site-URL resolution for route handlers that must produce absolute URLs
// (sitemap.xml, robots.txt). #604: previously each route duplicated a hardcoded
// vercel.app fallback; #605 made the layout tolerate a bad value.
export function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, '')
}

/**
 * Absolute origin for generated URLs. Returns null when neither
 * NEXT_PUBLIC_SITE_URL nor VERCEL_URL is set, so callers can degrade
 * gracefully instead of crashing the build or emitting a wrong host.
 */
export function getSiteUrl(): string | null {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')
  if (!raw) return null
  try {
    return normalizeSiteUrl(new URL(raw.trim()).origin)
  } catch {
    console.warn(`Ignoring invalid NEXT_PUBLIC_SITE_URL: ${JSON.stringify(raw)}`)
    return null
  }
}
