import { getAllHeroes } from "@/lib/supabase"
import HomeClient from "@/components/HomeClient"
import FranchiseTabs from "@/components/FranchiseTabs"
import { Shield, Zap, Swords, Star, Skull, ArrowRight, Sparkles, Bug } from 'lucide-react'

async function getHeroesData() {
  try {
    const allHeroes = await getAllHeroes()
    if (!allHeroes || allHeroes.length === 0) {
      return { mcu: [], xmen: [], spider: [], dc: [], anime: [], theBoys: [], peacemaker: [] }
    }
    const pm = ['Peacemaker', 'Vigilante', 'Judomaster', 'Eagly']
    return {
      mcu: allHeroes.filter(h => h.franchise === 'MCU'),
      xmen: allHeroes.filter(h => h.franchise === 'X-Men'),
      spider: allHeroes.filter(h => h.franchise === 'Spider-Verse' || h.alias === 'Spider-Man'),
      dc: allHeroes.filter(h => h.franchise === 'DC' && !pm.includes(h.alias)),
      anime: allHeroes.filter(h => h.franchise === 'Anime'),
      theBoys: allHeroes.filter(h => h.franchise === 'The Boys'),
      peacemaker: allHeroes.filter(h => pm.includes(h.alias)),
    }
  } catch {
    return { mcu: [], xmen: [], spider: [], dc: [], anime: [], theBoys: [], peacemaker: [] }
  }
}


export default async function Home() {
  const { mcu, xmen, spider, dc, anime, theBoys, peacemaker } = await getHeroesData()
  const totalHeroes = mcu.length + xmen.length + spider.length + dc.length + anime.length + theBoys.length + peacemaker.length

  return (
    <HomeClient>
      <main className="min-h-screen">
        {/* Dark Apple editorial hero — pure black canvas */}
        <section className="relative bg-[var(--bg)] overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.15]" />
          <div className="absolute inset-0 gradient-spotlight" />

          <div className="relative container-wide py-28 sm:py-36">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg-2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  Hero Database v2.1
                </span>
              </div>

              <h1 className="text-hero mb-6 leading-[1.05]">
                <span className="text-[var(--fg)]">Multiverse</span>
                <br />
                <span className="text-gradient">Archive</span>
              </h1>

              <p className="text-lg sm:text-xl text-[var(--fg-2)] max-w-2xl mx-auto mb-10 leading-relaxed">
                Your gateway to heroes across all universes. Explore powers, timelines, and canon events
                from Marvel, DC, The Boys, and beyond.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <button className="btn btn-primary btn-lg group">
                  <Sparkles className="w-4 h-4" />
                  Explore Heroes
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <button className="btn btn-secondary btn-lg">
                  View Timeline
                </button>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <div className="stat-pill">
                  <Star className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span className="stat-value">{totalHeroes}</span>
                  <span className="stat-label">Heroes</span>
                </div>
                <div className="stat-pill">
                  <Shield className="w-3.5 h-3.5 text-[var(--franchise-mcu)]" />
                  <span className="stat-value">{mcu.length + xmen.length + spider.length}</span>
                  <span className="stat-label">Marvel</span>
                </div>
                <div className="stat-pill">
                  <Zap className="w-3.5 h-3.5 text-[var(--franchise-dc)]" />
                  <span className="stat-value">{dc.length}</span>
                  <span className="stat-label">DC</span>
                </div>
                <div className="stat-pill">
                  <Skull className="w-3.5 h-3.5 text-[var(--franchise-theboys)]" />
                  <span className="stat-value">{theBoys.length}</span>
                  <span className="stat-label">The Boys</span>
                </div>
                <div className="stat-pill">
                  <Swords className="w-3.5 h-3.5 text-[var(--franchise-anime)]" />
                  <span className="stat-value">{anime.length}</span>
                  <span className="stat-label">Anime</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container-wide">
          <div className="divider" />
        </div>

        {/* Browse by Universe — surface chapter */}
        <section className="section bg-[var(--bg)]">
          <div className="container-wide">
            <div className="text-center mb-12">
              <span className="text-eyebrow mb-4 block">Browse by Universe</span>
              <h2 className="text-title mb-4">Hero Database</h2>
              <p className="text-body max-w-xl mx-auto">
                Explore heroes from your favorite franchises. Each universe has its own unique characters and stories.
              </p>
            </div>

            <FranchiseTabs data={{ mcu, xmen, spider, dc, anime, theBoys, peacemaker }} />
          </div>
        </section>

        {/* Featured section — dark chapter */}
        <section className="section bg-[var(--bg)]">
          <div className="container-wide">
            <div className="text-center mb-12">
              <span className="text-eyebrow mb-4 block">Featured</span>
              <h2 className="text-title mb-4">Most Popular Heroes</h2>
              <p className="text-body max-w-xl mx-auto">
                The most searched and viewed heroes across the multiverse.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="card-glass p-8 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, var(--franchise-mcu), #60a5fa)' }}>
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-heading mb-1">MCU Heroes</h3>
                <p className="text-caption mb-3">Earth-616 and beyond</p>
                <span className="text-2xl font-bold text-[var(--accent)]">{mcu.length}</span>
              </div>

              <div className="card-glass p-8 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, var(--franchise-spider), #f97316)' }}>
                  <Bug className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-heading mb-1">Spider-Verse</h3>
                <p className="text-caption mb-3">Across the spider-verse</p>
                <span className="text-2xl font-bold text-[var(--accent)]">{spider.length}</span>
              </div>

              <div className="card-glass p-8 text-center">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg, var(--franchise-dc), #22d3ee)' }}>
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-heading mb-1">DC Universe</h3>
                <p className="text-caption mb-3">Justice and beyond</p>
                <span className="text-2xl font-bold text-[var(--accent)]">{dc.length}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="section-sm bg-[var(--bg)] border-t border-[var(--border)]">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-[10px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent), #60a5fa)' }}>
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="text-[var(--fg)] font-semibold text-sm">Multiverse Archive</span>
              </div>
              <p className="text-caption">&copy; 2024 Multiverse Archive. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </HomeClient>
  )
}
