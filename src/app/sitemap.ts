import type { MetadataRoute } from 'next'
import { getAllHeroes, type Hero } from '@/lib/supabase'
import { slugifyAlias } from '@/lib/slugs'
import { getSiteUrl } from '@/lib/site-url'

// #604: shared resolver — no duplicated hardcoded host, no build-time throw.
const SITE_URL: string | null = getSiteUrl()

// #423: paginated, so newly added heroes are included without a rebuild. The
// old force-static version froze the hero list (and the first 100 rows) into
// the build output.
// #798: regenerate at most hourly via ISR instead of on every request.
export const revalidate = 3600
const LAST_MODIFIED: string = new Date().toISOString().split('T')[0]

/** Fetch every hero by following the id cursor past the single-page cap. */
async function fetchAllHeroesPaginated(limitPerRequest = 1000): Promise<Hero[]> {
  const collected: Hero[] = []
  let cursor: string | undefined
  for (;;) {
    const page = await getAllHeroes({ pageSize: limitPerRequest, cursor })
    if (!page || page.length === 0) break
    collected.push(...page)
    if (page.length < limitPerRequest) break
    const last = page[page.length - 1]
    const nextCursor = String(last.id)
    if (!nextCursor || nextCursor === cursor) break
    cursor = nextCursor
    if (collected.length > 20000) break // hard stop against pathological data
  }
  return collected
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!SITE_URL) {
    // No host configured (e.g. CI build without env): emit an empty sitemap
    // rather than crashing the build or inventing a domain.
    return []
  }
  const base = SITE_URL
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
    const heroes = await fetchAllHeroesPaginated()
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
