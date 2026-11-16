import type { Metadata } from 'next'
import AdminClient from '@/components/AdminClient'

// Admin page — noindex so search engines never surface the control panel.
export const metadata: Metadata = {
  title: 'Admin | Multiverse Archive',
  description: 'Admin panel for the Multiverse Archive hero database.',
  robots: 'noindex, nofollow',
}

export default function AdminPage() {
  return <AdminClient />
}
