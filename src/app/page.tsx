import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HeroCard from "@/components/HeroCard"
import { HeroGridSkeleton } from "@/components/Skeleton"
import { getAllHeroes, type Hero } from "@/lib/supabase"
import HomeClient from "@/components/HomeClient"
import { Sparkles, Atom, Bug, Shield, Zap, Swords, Star, Skull, CircleDot } from 'lucide-react'

// Extended mock data for all universes
const mockHeroes: Hero[] = [
  // Keeping format but will rely on DB
]

async function getHeroesData() {
  try {
    const allHeroes = await getAllHeroes()
    if (!allHeroes || allHeroes.length === 0) {
      return {
        mcu: [], xmen: [], spider: [], dc: [], anime: [], theBoys: [], peacemaker: []
      }
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
    return {
      mcu: [], xmen: [], spider: [], dc: [], anime: [], theBoys: [], peacemaker: []
    }
  }
}

function HeroGrid({ heroes }: { heroes: Hero[] }) {
  if (heroes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
        <Shield className="w-16 h-16 mb-4 opacity-30" />
        <p className="text-lg font-orbitron">No heroes found in this dimension</p>
        <p className="text-sm mt-2">Check back later or seed the database</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {heroes.map((hero, index) => (
        <HeroCard key={hero.id} hero={hero} index={index} />
      ))}
    </div>
  )
}

export default async function Home() {
  const { mcu, xmen, spider, dc, anime, theBoys, peacemaker } = await getHeroesData()
  const totalHeroes = mcu.length + xmen.length + spider.length + dc.length + anime.length + theBoys.length + peacemaker.length

  return (
    <HomeClient>
      <main className="min-h-screen px-4 sm:px-8 pt-8 pb-32 relative z-10">
        {/* Hero Section */}
        <header className="text-center mb-12 pt-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            <span className="text-sm font-mono text-cyan-400 tracking-widest uppercase">
              Hero Database v2.1
            </span>
            <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-orbitron text-center mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 text-glow">
              MULTIVERSE ARCHIVE
            </span>
          </h1>

          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-inter">
            Your gateway to heroes across all universes. Explore powers, timelines, and canon events
            from Marvel, DC, The Boys, and beyond.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Stat label="Total Heroes" value={totalHeroes} icon={<Star className="w-4 h-4" />} color="purple" />
            <Stat label="Marvel" value={mcu.length + xmen.length + spider.length} icon={<Shield className="w-4 h-4" />} color="cyan" />
            <Stat label="DC" value={dc.length} icon={<Zap className="w-4 h-4" />} color="blue" />
            <Stat label="The Boys" value={theBoys.length} icon={<Skull className="w-4 h-4" />} color="red" />
            <Stat label="Anime" value={anime.length} icon={<Swords className="w-4 h-4" />} color="orange" />
          </div>
        </header>

        {/* Franchise Tabs */}
        <Tabs defaultValue="mcu" className="w-full max-w-7xl mx-auto">
          <div className="flex justify-center mb-8 overflow-x-auto pb-2">
            <TabsList className="glass-panel p-1 rounded-full flex-wrap">
              <TabsTrigger
                value="mcu"
                className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400 transition-all"
              >
                <Shield className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">MCU</span>
              </TabsTrigger>
              <TabsTrigger
                value="xmen"
                className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-yellow-900/50 data-[state=active]:text-yellow-400 transition-all"
              >
                <Atom className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">X-Men</span>
              </TabsTrigger>
              <TabsTrigger
                value="spider"
                className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-red-900/50 data-[state=active]:text-red-400 transition-all"
              >
                <Bug className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Spider-Verse</span>
              </TabsTrigger>
              <TabsTrigger
                value="dc"
                className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-400 transition-all"
              >
                <Zap className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">DC</span>
              </TabsTrigger>

              <TabsTrigger
                value="anime"
                className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-orange-900/50 data-[state=active]:text-orange-400 transition-all"
              >
                <Swords className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Anime</span>
              </TabsTrigger>

              <TabsTrigger
                value="theboys"
                className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-red-900/50 data-[state=active]:text-red-400 transition-all"
              >
                <Skull className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">The Boys</span>
              </TabsTrigger>
              <TabsTrigger
                value="peacemaker"
                className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-blue-900/50 data-[state=active]:text-blue-400 transition-all"
              >
                <CircleDot className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Peacemaker</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <Suspense fallback={<HeroGridSkeleton count={8} />}>
            <TabsContent value="mcu" className="mt-0">
              <HeroGrid heroes={mcu} />
            </TabsContent>

            <TabsContent value="xmen" className="mt-0">
              <HeroGrid heroes={xmen} />
            </TabsContent>

            <TabsContent value="spider" className="mt-0">
              <HeroGrid heroes={spider} />
            </TabsContent>

            <TabsContent value="dc" className="mt-0">
              <HeroGrid heroes={dc} />
            </TabsContent>

            <TabsContent value="anime" className="mt-0">
              <HeroGrid heroes={anime} />
            </TabsContent>

            <TabsContent value="theboys" className="mt-0">
              <HeroGrid heroes={theBoys} />
            </TabsContent>

            <TabsContent value="peacemaker" className="mt-0">
              <HeroGrid heroes={peacemaker} />
            </TabsContent>
          </Suspense>
        </Tabs>
      </main>
    </HomeClient>
  )
}

// Stats component
function Stat({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colorClasses: Record<string, string> = {
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
    yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/30',
    red: 'text-red-400 border-red-500/30 bg-red-950/30',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-950/30',
    orange: 'text-orange-400 border-orange-500/30 bg-orange-950/30',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-950/30',
  }

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${colorClasses[color]}`}>
      {icon}
      <span className="font-mono text-lg font-bold">{value}</span>
      <span className="text-xs text-neutral-500">{label}</span>
    </div>
  )
}
