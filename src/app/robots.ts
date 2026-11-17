import type { MetadataRoute } from 'next'

const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'https://multiversearchive.vercel.app'

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
