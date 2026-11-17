import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import PowerRadarChart from '@/components/PowerRadarChartDynamic'
import CanonEventAlert from '@/components/CanonEventAlert'
import RestrictedAccess from '@/components/RestrictedAccess'
import HeroImage from '@/components/HeroImage'
import {
  getHeroBySlug,
  getHeroBySlugForAdmin,
  getHeroVisibility,
  type HeroWithRelations,
} from '@/lib/supabase'
import { checkAdminAuthAction } from '@/app/actions/admin'
import { FRANCHISE_COLORS } from '@/lib/hero-update'
import { ArrowLeft, Globe, Zap, AlertTriangle, Shield, Film, Lock, Sparkles } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Load failures propagate to the route's error boundary instead of being
// reported as a 404; only a genuinely missing slug uses notFound().
// Memoized per request so render and generateMetadata share a single hero
// fetch instead of fetching twice per hero page view.
const getHeroData = cache(async function getHeroData(
  slug: string,
): Promise<HeroWithRelations | null> {
  return getHeroBySlug(slug)
})

const getHeroDataForAdmin = cache(async function getHeroDataForAdmin(
  slug: string,
): Promise<HeroWithRelations | null> {
  return getHeroBySlugForAdmin(slug)
})

export default async function HeroPage({ params }: PageProps) {
  const { slug } = await params

  const isAdmin = await checkAdminAuthAction()

  // #464: admins already receive the full row (including is_locked_content), so
  // skip the redundant service-role visibility query for them.
  const [hero, visibility] = await Promise.all([
    isAdmin ? getHeroDataForAdmin(slug) : getHeroData(slug),
    isAdmin ? Promise.resolve(null) : getHeroVisibility(slug),
  ])

  if (isAdmin) {
    if (!hero) {
      notFound()
    }
  } else {
    if (!visibility) {
      notFound()
    }

    if (visibility.is_locked_content) {
      return <RestrictedAccess />
    }

    if (!hero) {
      notFound()
    }
  }

  const colors = FRANCHISE_COLORS[hero.franchise] ?? FRANCHISE_COLORS.MCU

  return (
    <>
      <main className="min-h-screen">
        {/* Cinematic hero detail — pure black canvas */}
        <section className="relative bg-[var(--bg)] overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.15]" />
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${colors.glow} 0%, transparent 60%)`,
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
                  sizes="(max-width: 1024px) 100vw, 380px"
                  priority
                  className="absolute inset-0 w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/60 via-transparent to-transparent" />

                {hero.is_locked_content && (
                  <div className="absolute inset-0 bg-[var(--bg)]/70 backdrop-blur-sm flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-full glass flex items-center justify-center">
                        <Lock className="w-5 h-5 text-[var(--muted)]" />
                      </div>
                      <span className="text-sm font-medium text-[var(--muted)]">
                        Locked Content
                      </span>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20 hover:bg-[var(--accent)]/20 transition-colors"
                        >
                          Edit Hero
                        </Link>
                      )}
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
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20"
                      >
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
    </>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params

  // Resolve visibility with the same source the page uses so a locked hero is
  // described as restricted instead of "not found" (#424).
  const visibility = await getHeroVisibility(slug)
  if (!visibility) {
    return { title: 'Hero Not Found | Multiverse Archive' }
  }
  if (visibility.is_locked_content) {
    return {
      title: 'Restricted Hero | Multiverse Archive',
      description: 'This hero profile is available to registered members only.',
      robots: { index: false },
    }
  }

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
