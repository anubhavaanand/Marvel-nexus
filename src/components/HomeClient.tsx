'use client'

import React from 'react'

interface HomeClientProps {
  children: React.ReactNode
  isDemoMode?: boolean
  loadError?: string | null
}

export default function HomeClient({ children, isDemoMode = false, loadError }: HomeClientProps) {
  return (
    <div className="min-h-screen">
      {(isDemoMode || loadError) && (
        <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-center text-sm text-amber-300">
          {loadError ?? 'Demo mode: Supabase is not configured, showing sample data.'}
        </div>
      )}
      {children}
    </div>
  )
}
