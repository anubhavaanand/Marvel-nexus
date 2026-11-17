import type { Metadata } from 'next'
import { getSearchHeroes, type SearchHero, isSupabaseConfigured } from '@/lib/supabase'
import SearchClient from '@/components/SearchClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Search | Multiverse Archive',
  description:
    'Search across all dimensions. Find heroes by name, alias, powers, or origin world across Marvel, DC, Anime and more.',
  openGraph: {
    title: 'Search | Multiverse Archive',
    description: 'Search heroes across the multiverse — Marvel, DC, Anime and beyond.',
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary',
    title: 'Search | Multiverse Archive',
    description: 'Search heroes across the multiverse.',
  },
}

export default async function SearchPage() {
  let initialAllHeroes: SearchHero[] = []
  let loadError: string | null = null
  try {
    initialAllHeroes = await getSearchHeroes()
  } catch (error) {
    // Log the raw driver error server-side; never leak it to the UI.
    console.error('Failed to load heroes for search page:', error)
    loadError = 'Live hero database is unreachable.'
  }
  const isDemoMode = !isSupabaseConfigured
  return <SearchClient allHeroes={initialAllHeroes} loadError={loadError} isDemoMode={isDemoMode} />
}
