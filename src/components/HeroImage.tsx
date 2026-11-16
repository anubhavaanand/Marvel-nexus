'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { getTmdbImageUrl } from '@/lib/client-tmdb'

interface HeroImageProps {
  imageUrl: string | null
  alias: string
  name?: string
  className?: string
  sizes?: string
  priority?: boolean
}

export default function HeroImage(props: HeroImageProps) {
  // Remount the inner component whenever the source image changes so its
  // transient state (error flag / TMDB fallback) resets without effect-based
  // prop synchronization.
  return <HeroImageInner key={props.imageUrl ?? ''} {...props} />
}

function HeroImageInner({
  imageUrl,
  alias,
  name = '',
  className = '',
  sizes = '(max-width: 768px) 50vw, 25vw',
  priority = false,
}: HeroImageProps) {
  const [currentSrc, setCurrentSrc] = useState(imageUrl || '')
  const [imageError, setImageError] = useState(false)
  const [tmdbAttempted, setTmdbAttempted] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Proactive client-side TMDB lookups disabled (#155): mock images resolve
  // server-side via enrichMockHeroesWithTmdb, so per-hero client fetches
  // only duplicate that work. Single fallback lookup on image error remains.

  const handleError = async () => {
    if (tmdbAttempted) return
    setImageError(true)

    try {
      const tmdbUrl = await getTmdbImageUrl(name, alias)
      if (mountedRef.current && tmdbUrl) {
        setCurrentSrc(tmdbUrl)
        setImageError(false)
      }
    } catch {
      // fallback remains
    } finally {
      if (mountedRef.current) setTmdbAttempted(true)
    }
  }

  if (!currentSrc || imageError) {
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
    <Image
      src={currentSrc}
      alt={alias}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
      onError={handleError}
    />
  )
}
