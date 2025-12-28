'use client'

import { useState } from 'react'

interface HeroImageProps {
    imageUrl: string | null
    alias: string
    className?: string
}

export default function HeroImage({ imageUrl, alias, className = '' }: HeroImageProps) {
    const [imageError, setImageError] = useState(false)

    if (!imageUrl || imageError) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-black ${className}`}>
                <span className="text-8xl opacity-30">🦸</span>
            </div>
        )
    }

    return (
        <img
            src={imageUrl}
            alt={alias}
            className={className}
            onError={() => setImageError(true)}
        />
    )
}
