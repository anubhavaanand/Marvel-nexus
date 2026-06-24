import { Suspense } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PowerRadarChart from '@/components/PowerRadarChart'
import CanonEventAlert from '@/components/CanonEventAlert'
import { HeroProfileSkeleton } from '@/components/Skeleton'
import LockedContentGuard from '@/components/LockedContentGuard'
import HeroImage from '@/components/HeroImage'
import { getHeroBySlug, type HeroWithRelations } from '@/lib/supabase'
import {
  ArrowLeft,
  Globe,
  Zap,
  AlertTriangle,
  Shield,
  Film,
  Lock,
  Sparkles
} from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getHeroData(slug: string): Promise<HeroWithRelations | null> {
  try {
    const hero = await getHeroBySlug(slug)
    return hero
  } catch (e) {
    console.error("Error fetching hero:", e)
    return null
  }
}

const franchiseColors: Record<string, { primary: string; glow: string }> = {
  'MCU': { primary: 'var(--franchise-mcu)', glow: 'rgba(0, 113, 227, 0.3)' },
  'X-Men': { primary: 'var(--franchise-xmen)', glow: 'rgba(234, 179, 8, 0.3)' },
  'Spider-Verse': { primary: 'var(--franchise-spider)', glow: 'rgba(239, 68, 68, 0.3)' },
  'Defenders': { primary: '#a855f7', glow: 'rgba(168, 85, 247, 0.3)' },
  'DC': { primary: 'var(--franchise-dc)', glow: 'rgba(59, 130, 246, 0.3)' },
  'Anime': { primary: 'var(--franchise-anime)', glow: 'rgba(249, 115, 22, 0.3)' },
  'The Boys': { primary: 'var(--franchise-theboys)', glow: 'rgba(220, 38, 38, 0.3)' },
  'Invincible': { primary: '#eab308', glow: 'rgba(234, 179, 8, 0.3)' },
}

export default async function HeroPage({ params }: PageProps) {
  const { slug } = await params
  const hero = await getHeroData(slug)

  if (!hero) {
    notFound()
  }

  const colors = franchiseColors[hero.franchise] || franchiseColors['MCU']

  return (
    <LockedContentGuard isLocked={hero.is_locked_content}>
      <main className="min-h-screen">
        {/* Cinematic hero detail — pure black canvas */}
        <section className="relative bg-[var(--bg)] overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.15]" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${colors.glow} 0%, transparent 60%)`
            }}
          />

          <div className="relative container-wide py-20 sm:py-28">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[var(--fg-2)] hover:text-[var(--fg)] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Back to Archive</span>
            </Link>

            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Hero image — glass-framed */}
              <div className="relative w-full lg:w-[380px] aspect-[3/4] rounded-2xl overflow-hidden flex-shrink-0 glass-strong">
                <HeroImage
                  imageUrl={hero.image_url}
                  alias={hero.alias}
                  name={hero.actor_name || hero.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/60 via-transparent to-transparent" />

                {hero.is_locked_content && (
                  <div className="absolute inset-0 bg-[var(--bg)]/70 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full glass flex items-center justify-center mb-3">
                        <Lock className="w-5 h-5 text-[var(--muted)]" />
                      </div>
                      <span className="text-sm font-medium text-[var(--muted)]">Premium Unlocked</span>
                    </div>
                  </div>
                )}

                <div className="absolute top-3 left-3">
                  <span
                    className="franchise-badge px-2.5 py-1 text-xs font-semibold backdrop-blur-sm"
                    style={{ '--franchise-color': colors.primary } as React.CSSProperties}
                  >
                    {hero.franchise}
                  </span>
                </div>
              </div>

              <div className="flex-1 space-y-8">
                <div>
                  <p className="text-sm text-[var(--muted)] mb-2 font-medium">{hero.name}</p>
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-none"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    {hero.alias}
                  </h1>
                </div>

                <div className="flex items-center gap-2.5 text-[var(--accent)]">
                  <Globe className="w-4 h-4" />
                  <span className="font-medium">{hero.origin_world}</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-[var(--muted)] flex items-center gap-2 uppercase tracking-wider">
                    <Zap className="w-3.5 h-3.5" />
                    Powers
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hero.powers?.map((power, i) => (
                      <span key={i} className="badge-accent px-3 py-1.5 text-xs font-medium">
                        <Sparkles className="w-3 h-3" />
                        {power}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-[var(--muted)] flex items-center gap-2 uppercase tracking-wider">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Weaknesses
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {hero.weaknesses?.map((weakness, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20">
                        {weakness}
                      </span>
                    ))}
                  </div>
                </div>

                {hero.hero_movies && hero.hero_movies.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-[var(--muted)] flex items-center gap-2 uppercase tracking-wider">
                      <Film className="w-3.5 h-3.5" />
                      Appears In
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {hero.hero_movies.map((hm, i) => (
                        <span key={i} className="badge-surface px-3 py-1.5 text-xs font-medium">
                          {hm.movies?.title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content section — surface chapter */}
        <section className="section bg-[var(--bg)]">
          <div className="container-wide">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <PowerRadarChart powers={hero.powers || []} />

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[var(--fg)] flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[var(--accent)]" />
                  Canon Events
                  <span className="text-sm text-[var(--meta)] font-normal">
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
                  <div className="card-glass p-10 text-center">
                    <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-7 h-7 text-[var(--meta)]" />
                    </div>
                    <p className="text-[var(--muted)]">No canon events recorded for this hero</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </LockedContentGuard>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const hero = await getHeroData(slug)

  if (!hero) {
    return { title: 'Hero Not Found | Multiverse Archive' }
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
