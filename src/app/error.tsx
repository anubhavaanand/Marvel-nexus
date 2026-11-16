'use client'

import { AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { getSafeErrorMessage } from '@/lib/error'

interface ErrorPageProps {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: ErrorPageProps) {
  // Never ship raw error text to the UI. Log the full error to the console
  // (server-side in production) and return a fixed, generic message instead.
  const safeMessage = getSafeErrorMessage(error, "We couldn't load this reality. Please try again.")

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-[var(--surface)] border border-[var(--border)]">
            <AlertTriangle className="w-8 h-8 text-[var(--danger)]" />
          </div>
        </div>
        {/* Heading */}
        <h2
          className="text-2xl md:text-3xl font-semibold text-[var(--fg)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Something went wrong
        </h2>
        {/* Message */}
        <p
          className="text-[var(--muted)] max-w-md mx-auto mb-10"
          style={{ fontFamily: 'var(--font-body)', lineHeight: 1.47 }}
        >
          {safeMessage}
        </p>
        {/* Retry action */}
        <button onClick={reset} className="btn btn-primary">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </button>
        {/* Fallback link */}
        <div className="mt-8">
          <Link href="/" className="text-[var(--accent)] hover:underline text-sm transition-colors">
            Return to Archive
          </Link>
        </div>
      </div>
    </main>
  )
}
