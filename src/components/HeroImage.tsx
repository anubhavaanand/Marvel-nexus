'use client'

import { useState, useEffect, useRef } from 'react'
import { getTmdbImageUrl } from '@/lib/client-tmdb'

interface HeroImageProps {
    imageUrl: string | null
    alias: string
    name?: string
    className?: string
}

const placeholderPattern = /unsplash|placeholder|picsum/i

function isPlaceholder(url: string): boolean {
    return placeholderPattern.test(url) || url.includes('utm_')
}

export default function HeroImage({ imageUrl, alias, name = '', className = '' }: HeroImageProps) {
    const [currentSrc, setCurrentSrc] = useState(imageUrl || '')
    const [imageError, setImageError] = useState(false)
    const [tmdbAttempted, setTmdbAttempted] = useState(false)
    const mountedRef = useRef(true)

    useEffect(() => {
        return () => { mountedRef.current = false }
    }, [])

    useEffect(() => {
        setCurrentSrc(imageUrl || '')
        setImageError(false)
        setTmdbAttempted(false)
    }, [imageUrl])

        // Proactive TMDB lookup on mount — for empty URLs or random placeholder images
    useEffect(() => {
        if (tmdbAttempted || imageError) return
        if (currentSrc && !isPlaceholder(currentSrc) && !imageError) return

        // Only trigger once — either currentSrc is empty or it's a placeholder
        setTmdbAttempted(true)
        getTmdbImageUrl(name, alias).then((tmdbUrl) => {
            if (mountedRef.current && tmdbUrl) {
                setCurrentSrc(tmdbUrl)
                setImageError(false)
            }
        }).catch(() => {
            // silently keep current source
        })
    }, [currentSrc, name, alias, tmdbAttempted, imageError])

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
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-black ${className}`}>
                <span className="text-6xl font-bold opacity-[0.06] select-none" style={{ fontFamily: 'var(--font-display)' }}>
                    {alias.split(' ').map(w => w[0]).join('').slice(0, 2)}
                </span>
            </div>
        )
    }

    return (
        <img
            src={currentSrc}
            alt={alias}
            className={className}
            onError={handleError}
        />
    )
}
