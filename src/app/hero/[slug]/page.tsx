import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import PowerRadarChart from '@/components/PowerRadarChart'
import CanonEventAlert from '@/components/CanonEventAlert'
import { HeroProfileSkeleton } from '@/components/Skeleton'
import LockedContentGuard from '@/components/LockedContentGuard'
import { getHeroBySlug, type HeroWithRelations } from '@/lib/supabase'
import {
    ArrowLeft,
    Globe,
    Zap,
    AlertTriangle,
    Shield,
    Film,
    Lock
} from 'lucide-react'

interface PageProps {
    params: Promise<{ slug: string }>
}

// Fetch data strictly from Supabase now
async function getHeroData(slug: string): Promise<HeroWithRelations | null> {
    try {
        const hero = await getHeroBySlug(slug)
        return hero
    } catch (e) {
        console.error("Error fetching hero:", e)
        return null
    }
}

export default async function HeroPage({ params }: PageProps) {
    const { slug } = await params
    const hero = await getHeroData(slug)

    if (!hero) {
        notFound()
    }

    const franchiseColors: Record<string, { bg: string; border: string; text: string }> = {
        'MCU': { bg: 'bg-cyan-950/50', border: 'border-cyan-500/50', text: 'text-cyan-400' },
        'X-Men': { bg: 'bg-yellow-950/50', border: 'border-yellow-500/50', text: 'text-yellow-400' },
        'Spider-Verse': { bg: 'bg-red-950/50', border: 'border-red-500/50', text: 'text-red-400' },
        'Defenders': { bg: 'bg-purple-950/50', border: 'border-purple-500/50', text: 'text-purple-400' },
        'DC': { bg: 'bg-blue-950/50', border: 'border-blue-500/50', text: 'text-blue-400' },
        'Anime': { bg: 'bg-orange-950/50', border: 'border-orange-500/50', text: 'text-orange-400' },
        'The Boys': { bg: 'bg-red-950/50', border: 'border-red-500/50', text: 'text-red-400' },
        'Invincible': { bg: 'bg-yellow-950/50', border: 'border-yellow-500/50', text: 'text-yellow-400' },
    }

    const colors = franchiseColors[hero.franchise] || franchiseColors['MCU']

    return (
        <LockedContentGuard isLocked={hero.is_locked_content}>
            <main className="min-h-screen px-4 sm:px-8 pt-8 pb-32">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-neutral-400 hover:text-cyan-400 transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-mono text-sm">Back to Archive</span>
                </Link>

                <Suspense fallback={<HeroProfileSkeleton />}>
                    <div className="max-w-6xl mx-auto">
                        {/* Hero Header */}
                        <div className="flex flex-col lg:flex-row gap-8 mb-12">
                            {/* Hero Image */}
                            <div className="relative w-full lg:w-96 aspect-[3/4] rounded-2xl overflow-hidden glass-panel flex-shrink-0">
                                {hero.image_url ? (
                                    <img
                                        src={hero.image_url}
                                        alt={hero.alias}
                                        className="absolute inset-0 w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full skeleton flex items-center justify-center">
                                        <span className="text-8xl opacity-30">🦸</span>
                                    </div>
                                )}

                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                                {/* Locked overlay */}
                                {hero.is_locked_content && (
                                    <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
                                        <div className="flex flex-col items-center animate-pulse">
                                            <Lock className="w-16 h-16 text-cyan-400 mb-4" />
                                            <span className="text-cyan-400 font-orbitron">PREMIUM UNLOCKED</span>
                                        </div>
                                    </div>
                                )}

                                {/* Franchise badge */}
                                <div className="absolute top-4 left-4">
                                    <Badge className={`${colors.bg} ${colors.border} ${colors.text} font-orbitron`}>
                                        {hero.franchise}
                                    </Badge>
                                </div>
                            </div>

                            {/* Hero Info */}
                            <div className="flex-1 space-y-6">
                                {/* Name */}
                                <div>
                                    <p className="text-neutral-500 text-sm font-mono mb-1">{hero.name}</p>
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-orbitron text-glow leading-tight">
                                        {hero.alias}
                                    </h1>
                                </div>

                                {/* Origin World */}
                                <div className="flex items-center gap-2 text-cyan-400">
                                    <Globe className="w-5 h-5" />
                                    <span className="font-mono">{hero.origin_world}</span>
                                </div>

                                {/* Powers */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-orbitron text-neutral-400 flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        POWERS
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hero.powers?.map((power, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className="bg-cyan-950/30 border-cyan-500/30 text-cyan-400 font-mono text-xs"
                                            >
                                                {power}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Weaknesses */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-orbitron text-neutral-400 flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                        WEAKNESSES
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {hero.weaknesses?.map((weakness, i) => (
                                            <Badge
                                                key={i}
                                                variant="outline"
                                                className="bg-red-950/30 border-red-500/30 text-red-400 font-mono text-xs"
                                            >
                                                {weakness}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Movie Appearances */}
                                {hero.hero_movies && hero.hero_movies.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-sm font-orbitron text-neutral-400 flex items-center gap-2">
                                            <Film className="w-4 h-4" />
                                            APPEARS IN
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {hero.hero_movies.map((hm, i) => (
                                                <Badge
                                                    key={i}
                                                    variant="outline"
                                                    className="bg-neutral-800/50 border-neutral-600/50 text-neutral-300 font-mono text-xs"
                                                >
                                                    {hm.movies?.title}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Two Column Layout for Stats and Events */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Power Chart */}
                            <PowerRadarChart powers={hero.powers || []} />

                            {/* Canon Events */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-orbitron text-red-400 flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    Canon Events
                                    <span className="text-xs text-neutral-500 font-mono ml-2">
                                        ({hero.canon_events?.length || 0} recorded)
                                    </span>
                                </h3>

                                {hero.canon_events && hero.canon_events.length > 0 ? (
                                    <div className="space-y-4">
                                        {hero.canon_events.map((event, index) => (
                                            <CanonEventAlert
                                                key={event.id}
                                                description={event.description}
                                                isFixedPoint={event.is_fixed_point}
                                                glitchLevel={event.glitch_level}
                                                movieTitle={event.movies?.title}
                                                index={index}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="glass-panel rounded-xl p-8 text-center text-neutral-500">
                                        <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
                                        <p>No canon events recorded for this hero</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Suspense>
            </main>
        </LockedContentGuard>
    )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const hero = await getHeroData(slug)

    if (!hero) {
        return {
            title: 'Hero Not Found | Multiverse Archive',
        }
    }

    return {
        title: `${hero.alias} (${hero.name}) | Multiverse Archive`,
        description: `Explore ${hero.alias}'s powers, weaknesses, and canon events. Origin: ${hero.origin_world}. Franchise: ${hero.franchise}.`,
        openGraph: {
            title: `${hero.alias} | Multiverse Archive`,
            description: `${hero.name} from ${hero.origin_world}`,
            images: hero.image_url ? [hero.image_url] : [],
        },
    }
}
