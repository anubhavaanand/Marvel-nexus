import type { Metadata } from 'next'
import { checkAdminAuthAction } from '@/app/actions/admin'
import { getAllHeroesForAdmin, type Hero } from '@/lib/supabase'
import AdminClient from '@/components/AdminClient'
import AdminLogin from '@/components/AdminLogin'
import { getAdminStatsAction, type AdminStats } from '@/app/actions/seed'

// Admin page — noindex so search engines never surface the control panel.
// The auth gate runs before any hero data is fetched, so locked content is
// never serialized to unauthenticated visitors.
export const metadata: Metadata = {
  title: 'Admin | Multiverse Archive',
  description: 'Admin panel for the Multiverse Archive hero database.',
  robots: 'noindex, nofollow',
}

export default async function AdminPage() {
  const isAuthenticated = await checkAdminAuthAction()
  if (!isAuthenticated) {
    return <AdminLogin />
  }

  let initialHeroes: Hero[] = []
  try {
    initialHeroes = await getAllHeroesForAdmin()
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
