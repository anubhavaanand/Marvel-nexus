import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/site-url'

// #604: shared resolver — no duplicated hardcoded host, no build-time throw.
const SITE_URL: string | null = getSiteUrl()

// Deterministic at build time, matching src/app/sitemap.ts (#434).
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    // #604: omit the Sitemap line when no host is configured instead of
    // throwing during the build.
    ...(SITE_URL ? { sitemap: `${SITE_URL}/sitemap.xml` } : {}),
  }
}
