import { Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TimelineSlider from '@/components/TimelineSlider'
import { TimelineSkeleton } from '@/components/Skeleton'
import { getAllMovies, type Movie } from '@/lib/supabase'
import { Calendar, Film, Sparkles } from 'lucide-react'

// Mock movie data for demo
const mockMovies: Movie[] = [
    // Phase 1
    { id: '1', tmdb_id: 1726, title: 'Iron Man', release_date: '2008-05-02', phase: 'Phase 1', poster_url: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', imdb_rating: 7.9 },
    { id: '2', tmdb_id: 1724, title: 'The Incredible Hulk', release_date: '2008-06-13', phase: 'Phase 1', poster_url: 'https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg', imdb_rating: 6.7 },
    { id: '3', tmdb_id: 10138, title: 'Iron Man 2', release_date: '2010-05-07', phase: 'Phase 1', poster_url: 'https://image.tmdb.org/t/p/w500/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg', imdb_rating: 7.0 },
    { id: '4', tmdb_id: 10195, title: 'Thor', release_date: '2011-05-06', phase: 'Phase 1', poster_url: 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg', imdb_rating: 7.0 },
    { id: '5', tmdb_id: 1771, title: 'Captain America: The First Avenger', release_date: '2011-07-22', phase: 'Phase 1', poster_url: 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg', imdb_rating: 6.9 },
    { id: '6', tmdb_id: 24428, title: 'The Avengers', release_date: '2012-05-04', phase: 'Phase 1', poster_url: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', imdb_rating: 8.0 },

    // Phase 2
    { id: '7', tmdb_id: 68721, title: 'Iron Man 3', release_date: '2013-05-03', phase: 'Phase 2', poster_url: 'https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg', imdb_rating: 7.1 },
    { id: '8', tmdb_id: 76338, title: 'Thor: The Dark World', release_date: '2013-11-08', phase: 'Phase 2', poster_url: 'https://image.tmdb.org/t/p/w500/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg', imdb_rating: 6.8 },
    { id: '9', tmdb_id: 100402, title: 'Captain America: The Winter Soldier', release_date: '2014-04-04', phase: 'Phase 2', poster_url: 'https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg', imdb_rating: 7.7 },
    { id: '10', tmdb_id: 118340, title: 'Guardians of the Galaxy', release_date: '2014-08-01', phase: 'Phase 2', poster_url: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg', imdb_rating: 8.0 },
    { id: '11', tmdb_id: 99861, title: 'Avengers: Age of Ultron', release_date: '2015-05-01', phase: 'Phase 2', poster_url: 'https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg', imdb_rating: 7.3 },
    { id: '12', tmdb_id: 102899, title: 'Ant-Man', release_date: '2015-07-17', phase: 'Phase 2', poster_url: 'https://image.tmdb.org/t/p/w500/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg', imdb_rating: 7.3 },

    // Phase 3
    { id: '13', tmdb_id: 271110, title: 'Captain America: Civil War', release_date: '2016-05-06', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg', imdb_rating: 7.8 },
    { id: '14', tmdb_id: 284052, title: 'Doctor Strange', release_date: '2016-11-04', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg', imdb_rating: 7.5 },
    { id: '15', tmdb_id: 283995, title: 'Guardians of the Galaxy Vol. 2', release_date: '2017-05-05', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg', imdb_rating: 7.6 },
    { id: '16', tmdb_id: 315635, title: 'Spider-Man: Homecoming', release_date: '2017-07-07', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg', imdb_rating: 7.4 },
    { id: '17', tmdb_id: 284053, title: 'Thor: Ragnarok', release_date: '2017-11-03', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg', imdb_rating: 7.9 },
    { id: '18', tmdb_id: 284054, title: 'Black Panther', release_date: '2018-02-16', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', imdb_rating: 7.3 },
    { id: '19', tmdb_id: 299536, title: 'Avengers: Infinity War', release_date: '2018-04-27', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', imdb_rating: 8.4 },
    { id: '20', tmdb_id: 363088, title: 'Ant-Man and the Wasp', release_date: '2018-07-06', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/eivQmS3wqzqnQWILHLc4FsGfcXP.jpg', imdb_rating: 7.0 },
    { id: '21', tmdb_id: 299537, title: 'Captain Marvel', release_date: '2019-03-08', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg', imdb_rating: 6.8 },
    { id: '22', tmdb_id: 299534, title: 'Avengers: Endgame', release_date: '2019-04-26', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', imdb_rating: 8.4 },
    { id: '23', tmdb_id: 429617, title: 'Spider-Man: Far From Home', release_date: '2019-07-02', phase: 'Phase 3', poster_url: 'https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg', imdb_rating: 7.4 },

    // Phase 4
    { id: '24', tmdb_id: 497698, title: 'Black Widow', release_date: '2021-07-09', phase: 'Phase 4', poster_url: 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', imdb_rating: 6.7 },
    { id: '25', tmdb_id: 566525, title: 'Shang-Chi and the Legend of the Ten Rings', release_date: '2021-09-03', phase: 'Phase 4', poster_url: 'https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', imdb_rating: 7.4 },
    { id: '26', tmdb_id: 524434, title: 'Eternals', release_date: '2021-11-05', phase: 'Phase 4', poster_url: 'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg', imdb_rating: 6.3 },
    { id: '27', tmdb_id: 634649, title: 'Spider-Man: No Way Home', release_date: '2021-12-17', phase: 'Phase 4', poster_url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', imdb_rating: 8.2 },
    { id: '28', tmdb_id: 453395, title: 'Doctor Strange in the Multiverse of Madness', release_date: '2022-05-06', phase: 'Phase 4', poster_url: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', imdb_rating: 6.9 },
    { id: '29', tmdb_id: 616037, title: 'Thor: Love and Thunder', release_date: '2022-07-08', phase: 'Phase 4', poster_url: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', imdb_rating: 6.2 },
    { id: '30', tmdb_id: 505642, title: 'Black Panther: Wakanda Forever', release_date: '2022-11-11', phase: 'Phase 4', poster_url: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', imdb_rating: 6.7 },

    // Phase 5
    { id: '31', tmdb_id: 640146, title: 'Ant-Man and the Wasp: Quantumania', release_date: '2023-02-17', phase: 'Phase 5', poster_url: 'https://image.tmdb.org/t/p/w500/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg', imdb_rating: 6.0 },
    { id: '32', tmdb_id: 447365, title: 'Guardians of the Galaxy Vol. 3', release_date: '2023-05-05', phase: 'Phase 5', poster_url: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', imdb_rating: 7.9 },
    { id: '33', tmdb_id: 609681, title: 'The Marvels', release_date: '2023-11-10', phase: 'Phase 5', poster_url: 'https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMqps5.jpg', imdb_rating: 5.5 },
    { id: '34', tmdb_id: 533535, title: 'Deadpool & Wolverine', release_date: '2024-07-26', phase: 'Phase 5', poster_url: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', imdb_rating: 7.7 },
]

async function getMoviesData() {
    try {
        const movies = await getAllMovies()
        if (!movies || movies.length === 0) {
            return mockMovies
        }
        return movies
    } catch {
        return mockMovies
    }
}

export const metadata = {
    title: 'MCU Timeline | Multiverse Archive',
    description: 'Explore the complete Marvel Cinematic Universe timeline from Phase 1 to Phase 6. Every movie in chronological order.',
}

export default async function TimelinePage() {
    const movies = await getMoviesData()

    // Group movies by phase
    const phases: Record<string, Movie[]> = {
        'Phase 1': movies.filter(m => m.phase === 'Phase 1'),
        'Phase 2': movies.filter(m => m.phase === 'Phase 2'),
        'Phase 3': movies.filter(m => m.phase === 'Phase 3'),
        'Phase 4': movies.filter(m => m.phase === 'Phase 4'),
        'Phase 5': movies.filter(m => m.phase === 'Phase 5'),
        'Phase 6': movies.filter(m => m.phase === 'Phase 6'),
    }

    return (
        <main className="min-h-screen px-4 sm:px-8 pt-8 pb-32">
            {/* Header */}
            <header className="text-center mb-12 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Calendar className="w-8 h-8 text-cyan-400" />
                    <span className="text-sm font-mono text-cyan-400 tracking-widest uppercase">
                        Chronological Database
                    </span>
                    <Calendar className="w-8 h-8 text-cyan-400" />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-orbitron text-center mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 text-glow">
                        MCU TIMELINE
                    </span>
                </h1>

                <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-inter">
                    Journey through the Infinity Saga and the Multiverse Saga.
                    Every story that shaped the Marvel Cinematic Universe.
                </p>

                {/* Total Movies Counter */}
                <div className="flex justify-center mt-8">
                    <div className="glass-panel rounded-full px-6 py-3 flex items-center gap-3">
                        <Film className="w-5 h-5 text-cyan-400" />
                        <span className="font-mono text-lg text-white">{movies.length}</span>
                        <span className="text-neutral-400 text-sm">Movies in the MCU</span>
                    </div>
                </div>
            </header>

            {/* Phase Tabs */}
            <Tabs defaultValue="all" className="w-full max-w-7xl mx-auto">
                <div className="flex justify-center mb-8 overflow-x-auto pb-2">
                    <TabsList className="glass-panel p-1 rounded-full">
                        <TabsTrigger
                            value="all"
                            className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-400"
                        >
                            <Sparkles className="w-4 h-4 mr-1 sm:mr-2" />
                            All Phases
                        </TabsTrigger>
                        <TabsTrigger
                            value="infinity"
                            className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-400"
                        >
                            Infinity Saga
                        </TabsTrigger>
                        <TabsTrigger
                            value="multiverse"
                            className="rounded-full px-4 py-2 font-orbitron text-xs sm:text-sm data-[state=active]:bg-red-900/50 data-[state=active]:text-red-400"
                        >
                            Multiverse Saga
                        </TabsTrigger>
                    </TabsList>
                </div>

                <Suspense fallback={<TimelineSkeleton />}>
                    {/* All Phases */}
                    <TabsContent value="all" className="space-y-12">
                        {Object.entries(phases).map(([phase, phaseMovies]) => (
                            phaseMovies.length > 0 && (
                                <div key={phase} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getPhaseColor(phase)}`} />
                                        <h2 className="text-2xl font-orbitron text-white">{phase}</h2>
                                        <span className="text-sm text-neutral-500 font-mono">
                                            ({phaseMovies.length} films)
                                        </span>
                                    </div>
                                    <TimelineSlider movies={phaseMovies} title="" />
                                </div>
                            )
                        ))}
                    </TabsContent>

                    {/* Infinity Saga (Phases 1-3) */}
                    <TabsContent value="infinity" className="space-y-12">
                        {['Phase 1', 'Phase 2', 'Phase 3'].map(phase => (
                            phases[phase]?.length > 0 && (
                                <div key={phase} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getPhaseColor(phase)}`} />
                                        <h2 className="text-2xl font-orbitron text-white">{phase}</h2>
                                        <span className="text-sm text-neutral-500 font-mono">
                                            ({phases[phase].length} films)
                                        </span>
                                    </div>
                                    <TimelineSlider movies={phases[phase]} title="" />
                                </div>
                            )
                        ))}
                    </TabsContent>

                    {/* Multiverse Saga (Phases 4-6) */}
                    <TabsContent value="multiverse" className="space-y-12">
                        {['Phase 4', 'Phase 5', 'Phase 6'].map(phase => (
                            phases[phase]?.length > 0 && (
                                <div key={phase} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getPhaseColor(phase)}`} />
                                        <h2 className="text-2xl font-orbitron text-white">{phase}</h2>
                                        <span className="text-sm text-neutral-500 font-mono">
                                            ({phases[phase].length} films)
                                        </span>
                                    </div>
                                    <TimelineSlider movies={phases[phase]} title="" />
                                </div>
                            )
                        ))}
                    </TabsContent>
                </Suspense>
            </Tabs>
        </main>
    )
}

function getPhaseColor(phase: string): string {
    const colors: Record<string, string> = {
        'Phase 1': 'bg-blue-500',
        'Phase 2': 'bg-purple-500',
        'Phase 3': 'bg-red-500',
        'Phase 4': 'bg-green-500',
        'Phase 5': 'bg-orange-500',
        'Phase 6': 'bg-cyan-500',
    }
    return colors[phase] || 'bg-neutral-500'
}
