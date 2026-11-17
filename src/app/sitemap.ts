import type { MetadataRoute } from 'next'
import { getAllHeroes } from '@/lib/supabase'
import { slugifyAlias } from '@/lib/slugs'

const SITE_URL: string =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'https://multiversearchive.vercel.app'

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, '')
}

// Deterministic: captured once at module load (build time under force-static)
// rather than per request/render.
export const dynamic = 'force-static'
const LAST_MODIFIED: string = new Date().toISOString().split('T')[0]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = normalizeSiteUrl(SITE_URL)
  const today = LAST_MODIFIED

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${base}/search`,
      lastModified: today,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${base}/watch-order`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${base}/timeline`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ]

  try {
    const heroes = await getAllHeroes()
    const heroEntries: MetadataRoute.Sitemap = (heroes || [])
      .filter((hero) => hero.alias && hero.alias.trim().length > 0)
      .map((hero) => {
        const slug = hero.slug || slugifyAlias(hero.alias)
        return {
          url: `${base}/hero/${encodeURIComponent(slug)}`,
          lastModified: today,
          changeFrequency: 'weekly',
          priority: 0.6,
        }
      })

    return [...staticEntries, ...heroEntries]
  } catch (error) {
    console.error('Sitemap: falling back to static routes only:', error)
    return staticEntries
  }
}
