'use client'

import { useState, Children, isValidElement, cloneElement } from 'react'
import Image from 'next/image'
import { getTmdbImageUrl } from '@/lib/client-tmdb'

interface HeroImageErrorHandlerProps {
  children: React.ReactNode
  name: string
  alias: string
  className?: string
  sizes?: string
  priority?: boolean
  /** #419: film titles must fall back to the movie search, not people. */
  lookupType?: 'person' | 'movie'
}

export default function HeroImageErrorHandler({
  children,
  name = '',
  alias,
  className = '',
  sizes = '(max-width: 768px) 50vw, 25vw',
  priority = false,
  lookupType = 'person',
}: HeroImageErrorHandlerProps) {
  const [imageError, setImageError] = useState(false)
  const [tmdbAttempted, setTmdbAttempted] = useState(false)
  const [tmdbSrc, setTmdbSrc] = useState<string | null>(null)

  const handleError = async () => {
    if (tmdbAttempted || tmdbSrc) return
    setImageError(true)

    try {
      const tmdbUrl = await getTmdbImageUrl(name, alias, lookupType)
      if (tmdbUrl) {
        setTmdbSrc(tmdbUrl)
        setImageError(false)
      }
    } catch {
      // fallback remains
    } finally {
      setTmdbAttempted(true)
    }
  }

  // #504: a dead/blocked TMDB URL must fall through to the placeholder instead
  // of leaving next/image's broken-image icon on screen.
  const handleTmdbError = () => {
    setTmdbSrc(null)
    setImageError(true)
  }

  // If we have a TMDB fallback source, render the image with that source
  if (tmdbSrc) {
    return (
      <Image
        src={tmdbSrc}
        alt={alias}
        fill
        sizes={sizes}
        priority={priority}
        onError={handleTmdbError}
        className={`object-cover ${className}`}
      />
    )
  }

  // If error and no TMDB fallback, show placeholder
  if (imageError) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-black ${className}`}
      >
        <span
          className="text-6xl font-bold opacity-[0.06] select-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {alias
            .split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)}
        </span>
      </div>
    )
  }

  return (
    <>
      {Children.map(children, (child) =>
        isValidElement(child) && typeof child.type !== 'string'
          ? cloneElement(child, { onError: handleError } as React.HTMLAttributes<HTMLImageElement>)
          : child,
      )}
    </>
  )
}
