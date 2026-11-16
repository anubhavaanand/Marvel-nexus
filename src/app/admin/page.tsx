import type { Metadata } from 'next'
import { getAllHeroes, type Hero } from '@/lib/supabase'
import AdminClient from '@/components/AdminClient'

// Admin page — noindex so search engines never surface the control panel.
export const metadata: Metadata = {
  title: 'Admin | Multiverse Archive',
  description: 'Admin panel for the Multiverse Archive hero database.',
  robots: 'noindex, nofollow',
}

export default async function AdminPage() {
  let initialHeroes: Hero[] = []
  try {
    initialHeroes = await getAllHeroes()
  } catch (error) {
    console.error('Failed to load heroes for admin page:', error)
    initialHeroes = []
  }
  return <AdminClient initialHeroes={initialHeroes} />
}
