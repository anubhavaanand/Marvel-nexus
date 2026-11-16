import type { Metadata } from 'next'
import { getAllHeroes, type Hero } from '@/lib/supabase'
import SearchClient from '@/components/SearchClient'

export const metadata: Metadata = {
  title: 'Search | Multiverse Archive',
  description:
    'Search across all dimensions. Find heroes by name, alias, powers, or origin world across Marvel, DC, Anime and more.',
  openGraph: {
    title: 'Search | Multiverse Archive',
    description: 'Search heroes across the multiverse — Marvel, DC, Anime and beyond.',
  },
  twitter: {
    card: 'summary',
    title: 'Search | Multiverse Archive',
    description: 'Search heroes across the multiverse.',
  },
}

export default async function SearchPage() {
  let initialAllHeroes: Hero[] = []
  let loadError: string | null = null
  try {
    initialAllHeroes = await getAllHeroes()
  } catch (error) {
    // Log the raw driver error server-side; never leak it to the UI.
    console.error('Failed to load heroes for search page:', error)
    loadError = 'Live hero database is unreachable.'
  }
  return <SearchClient initialAllHeroes={initialAllHeroes} loadError={loadError} />
}
