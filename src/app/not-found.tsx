import Link from 'next/link'
import { Home, AlertTriangle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
      <div className="text-center">
        {/* 404 Title */}
        <div className="mb-8">
          <h1
            className="text-8xl md:text-9xl font-semibold text-[var(--fg)] tracking-tight"
            style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.015em' }}
          >
            404
          </h1>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-[var(--surface)]">
            <AlertTriangle className="w-8 h-8 text-[var(--meta)]" />
          </div>
        </div>

        {/* Message */}
        <h2
          className="text-2xl md:text-3xl font-semibold text-[var(--fg)] mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Dimension Not Found
        </h2>

        <p
          className="text-[var(--muted)] max-w-md mx-auto mb-10"
          style={{ fontFamily: 'var(--font-body)', lineHeight: 1.47 }}
        >
          This reality appears to have been erased from the multiverse. Perhaps it was a canon event
          that needed to happen.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button
            asChild
            className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium gap-2 px-6 py-3 rounded-full"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Back home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2 px-6 py-3 rounded-full">
            <Link href="/search">
              <Search className="w-4 h-4" />
              Search
            </Link>
          </Button>
        </div>

        {/* Decorative dots */}
        <div className="mt-16 flex justify-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--border)]" />
          ))}
        </div>
      </div>
    </main>
  )
}
