'use client'

import { motion } from 'framer-motion'

interface SkeletonProps {
    className?: string
    variant?: 'card' | 'text' | 'avatar' | 'badge'
}

export function Skeleton({ className = '', variant = 'text' }: SkeletonProps) {
    const baseClasses = 'animate-pulse rounded-md bg-[var(--surface)]'

    const variantClasses = {
        card: 'h-96 w-full rounded-2xl',
        text: 'h-4 w-full',
        avatar: 'h-12 w-12 rounded-full',
        badge: 'h-6 w-20 rounded-full',
    }

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
    )
}

export function HeroCardSkeleton() {
    return (
        <motion.div
            className="hero-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Image skeleton */}
            <div className="hero-image bg-[var(--surface)] animate-pulse" />

            {/* Content skeleton */}
            <div className="hero-content space-y-3">
                <Skeleton variant="badge" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
            </div>
        </motion.div>
    )
}

export function HeroGridSkeleton({ count = 8 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <HeroCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function HeroProfileSkeleton() {
    return (
        <div className="space-y-8">
            {/* Hero Header */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* Image */}
                <div className="w-full md:w-80 aspect-[3/4] skeleton rounded-2xl bg-[var(--surface)]" />

                {/* Info */}
                <div className="flex-1 space-y-4">
                    <Skeleton className="h-4 w-24" variant="badge" />
                    <Skeleton className="h-12 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />

                    <div className="pt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="card p-6 h-80 bg-[var(--surface)] animate-pulse" />

            {/* Canon Events */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="card p-4 h-24 bg-[var(--surface)] animate-pulse" />
                ))}
            </div>
        </div>
    )
}

export function TimelineSkeletonItem() {
    return (
        <div className="flex-shrink-0 w-56 space-y-2">
            <div className="h-80 skeleton rounded-xl bg-[var(--surface)]" />
            <div className="p-2 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    )
}

export function TimelineSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: count }).map((_, i) => (
                <TimelineSkeletonItem key={i} />
            ))}
        </div>
    )
}
