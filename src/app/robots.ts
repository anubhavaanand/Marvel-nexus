import type { MetadataRoute } from 'next'

function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  throw new Error(
    'NEXT_PUBLIC_SITE_URL or VERCEL_URL must be set — no hardcoded fallback domain allowed',
  )
}

const SITE_URL: string = getSiteUrl()

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, '')
}

// Deterministic at build time, matching src/app/sitemap.ts (#434).
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const base = normalizeSiteUrl(SITE_URL)
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
