import type { Metadata } from 'next'
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

export default function SearchPage() {
  return <SearchClient />
}
