import type { Metadata } from 'next'
import { getAllHeroes, type Hero } from '@/lib/supabase'
import AdminClient from '@/components/AdminClient'
import { getAdminStatsAction, type AdminStats } from '@/app/actions/seed'

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

  let initialStats: AdminStats | null = null
  try {
    const result = await getAdminStatsAction()
    if (result.ok) initialStats = result.stats
  } catch {
    initialStats = null
  }

  return <AdminClient initialHeroes={initialHeroes} initialStats={initialStats} />
}
