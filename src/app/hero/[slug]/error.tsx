'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

function makeReferenceId(): string {
  try {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID().slice(0, 8).toUpperCase()
    }
  } catch {
    // fall through
  }
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

export default function Error({ error, reset }: ErrorPageProps) {
  const [refId] = useState<string>(() => makeReferenceId())

  useEffect(() => {
    // Log the full error details for operators; never render them to users.
    console.error(`[error-boundary] reference=${refId}`, error)
  }, [error, refId])

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
        <h1
          className="text-2xl md:text-3xl font-semibold text-[var(--fg)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Something went wrong
        </h1>
        {/* Message */}
        <p
          className="text-[var(--muted)] max-w-md mx-auto mb-4"
          style={{ fontFamily: 'var(--font-body)', lineHeight: 1.47 }}
        >
          We couldn&apos;t load this hero profile. Please try again.
        </p>
        <p className="text-xs text-[var(--muted)] mb-10 font-mono">Reference: {refId}</p>
        {/* Retry action */}
        <button onClick={reset} className="btn btn-primary">
          <RefreshCw className="w-4 h-4 mr-2" /> Retry
        </button>
        {/* Recovery links */}
        <div className="mt-8 flex items-center justify-center gap-4 text-sm">
          <Link href="/" className="text-[var(--accent)] hover:underline transition-colors">
            Back home
          </Link>
          <span className="text-[var(--muted)]" aria-hidden>
            &middot;
          </span>
          <Link href="/search" className="text-[var(--accent)] hover:underline transition-colors">
            Search
          </Link>
        </div>
      </div>
    </main>
  )
}
