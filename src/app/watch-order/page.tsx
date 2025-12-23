'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
    Play,
    Calendar,
    Clock,
    Star,
    ChevronRight,
    Tv,
    Film,
    Sparkles,
    ArrowUpDown,
    Zap
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WatchItem {
    id: number
    title: string
    franchise: 'MCU' | 'DC'
    type: 'movie' | 'series'
    year: string
    phase: string
    chronologicalOrder: number
    releaseOrder: number
    poster: string
    runtime?: string
    rating?: number
    platform: 'Disney+' | 'Netflix' | 'Theater' | 'HBO Max'
    description: string
}

// Complete Watch Order Data (MCU + DC)
const watchOrderData: WatchItem[] = [
    // ========================================
    // MARVEL CINEMATIC UNIVERSE
    // ========================================
    // Phase 1
    { id: 1, franchise: 'MCU', title: 'Captain America: The First Avenger', type: 'movie', year: '2011', phase: 'Phase 1', chronologicalOrder: 1, releaseOrder: 5, poster: 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg', runtime: '2h 4m', rating: 6.9, platform: 'Disney+', description: 'During WWII, Steve Rogers becomes Captain America' },
    { id: 2, franchise: 'MCU', title: 'Captain Marvel', type: 'movie', year: '2019', phase: 'Phase 3', chronologicalOrder: 2, releaseOrder: 21, poster: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg', runtime: '2h 3m', rating: 6.8, platform: 'Disney+', description: 'Carol Danvers becomes Captain Marvel in the 1990s' },
    { id: 3, franchise: 'MCU', title: 'Iron Man', type: 'movie', year: '2008', phase: 'Phase 1', chronologicalOrder: 3, releaseOrder: 1, poster: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', runtime: '2h 6m', rating: 7.9, platform: 'Disney+', description: 'Tony Stark builds the Iron Man suit' },
    { id: 4, franchise: 'MCU', title: 'Iron Man 2', type: 'movie', year: '2010', phase: 'Phase 1', chronologicalOrder: 4, releaseOrder: 3, poster: 'https://image.tmdb.org/t/p/w500/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg', runtime: '2h 4m', rating: 7.0, platform: 'Disney+', description: 'Tony faces new enemies and his own mortality' },
    { id: 5, franchise: 'MCU', title: 'The Incredible Hulk', type: 'movie', year: '2008', phase: 'Phase 1', chronologicalOrder: 5, releaseOrder: 2, poster: 'https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg', runtime: '1h 52m', rating: 6.7, platform: 'Disney+', description: 'Bruce Banner hides from the military' },
    { id: 6, franchise: 'MCU', title: 'Thor', type: 'movie', year: '2011', phase: 'Phase 1', chronologicalOrder: 6, releaseOrder: 4, poster: 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg', runtime: '1h 55m', rating: 7.0, platform: 'Disney+', description: 'Thor is banished from Asgard to Earth' },
    { id: 7, franchise: 'MCU', title: 'The Avengers', type: 'movie', year: '2012', phase: 'Phase 1', chronologicalOrder: 7, releaseOrder: 6, poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', runtime: '2h 23m', rating: 8.0, platform: 'Disney+', description: 'Earth\'s Mightiest Heroes assemble' },

    // Phase 2
    { id: 8, franchise: 'MCU', title: 'Iron Man 3', type: 'movie', year: '2013', phase: 'Phase 2', chronologicalOrder: 8, releaseOrder: 7, poster: 'https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg', runtime: '2h 10m', rating: 7.1, platform: 'Disney+', description: 'Tony faces the Mandarin' },
    { id: 9, franchise: 'MCU', title: 'Thor: The Dark World', type: 'movie', year: '2013', phase: 'Phase 2', chronologicalOrder: 9, releaseOrder: 8, poster: 'https://image.tmdb.org/t/p/w500/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg', runtime: '1h 52m', rating: 6.8, platform: 'Disney+', description: 'Thor battles the Dark Elves' },
    { id: 10, franchise: 'MCU', title: 'Captain America: The Winter Soldier', type: 'movie', year: '2014', phase: 'Phase 2', chronologicalOrder: 10, releaseOrder: 9, poster: 'https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg', runtime: '2h 16m', rating: 7.7, platform: 'Disney+', description: 'Steve faces a ghost from the past' },
    { id: 11, franchise: 'MCU', title: 'Guardians of the Galaxy', type: 'movie', year: '2014', phase: 'Phase 2', chronologicalOrder: 11, releaseOrder: 10, poster: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg', runtime: '2h 1m', rating: 8.0, platform: 'Disney+', description: 'A group of misfits save the galaxy' },
    { id: 12, franchise: 'MCU', title: 'Guardians of the Galaxy Vol. 2', type: 'movie', year: '2017', phase: 'Phase 3', chronologicalOrder: 12, releaseOrder: 15, poster: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg', runtime: '2h 16m', rating: 7.6, platform: 'Disney+', description: 'Peter Quill learns about his father' },
    { id: 13, franchise: 'MCU', title: 'Avengers: Age of Ultron', type: 'movie', year: '2015', phase: 'Phase 2', chronologicalOrder: 13, releaseOrder: 11, poster: 'https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg', runtime: '2h 21m', rating: 7.3, platform: 'Disney+', description: 'The Avengers face Ultron' },
    { id: 14, franchise: 'MCU', title: 'Ant-Man', type: 'movie', year: '2015', phase: 'Phase 2', chronologicalOrder: 14, releaseOrder: 12, poster: 'https://image.tmdb.org/t/p/w500/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg', runtime: '1h 57m', rating: 7.3, platform: 'Disney+', description: 'Scott Lang becomes Ant-Man' },

    // Phase 3
    { id: 15, franchise: 'MCU', title: 'Captain America: Civil War', type: 'movie', year: '2016', phase: 'Phase 3', chronologicalOrder: 15, releaseOrder: 13, poster: 'https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg', runtime: '2h 27m', rating: 7.8, platform: 'Disney+', description: 'The Avengers fight each other' },
    { id: 16, franchise: 'MCU', title: 'Black Widow', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 16, releaseOrder: 24, poster: 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', runtime: '2h 14m', rating: 6.7, platform: 'Disney+', description: 'Natasha confronts her past' },
    { id: 17, franchise: 'MCU', title: 'Black Panther', type: 'movie', year: '2018', phase: 'Phase 3', chronologicalOrder: 17, releaseOrder: 18, poster: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', runtime: '2h 14m', rating: 7.3, platform: 'Disney+', description: 'T\'Challa becomes king of Wakanda' },
    { id: 18, franchise: 'MCU', title: 'Spider-Man: Homecoming', type: 'movie', year: '2017', phase: 'Phase 3', chronologicalOrder: 18, releaseOrder: 16, poster: 'https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg', runtime: '2h 13m', rating: 7.4, platform: 'Disney+', description: 'Peter Parker\'s MCU debut' },
    { id: 19, franchise: 'MCU', title: 'Doctor Strange', type: 'movie', year: '2016', phase: 'Phase 3', chronologicalOrder: 19, releaseOrder: 14, poster: 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg', runtime: '1h 55m', rating: 7.5, platform: 'Disney+', description: 'Stephen Strange learns the mystic arts' },
    { id: 20, franchise: 'MCU', title: 'Thor: Ragnarok', type: 'movie', year: '2017', phase: 'Phase 3', chronologicalOrder: 20, releaseOrder: 17, poster: 'https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg', runtime: '2h 10m', rating: 7.9, platform: 'Disney+', description: 'Thor faces Hela and Ragnarok' },
    { id: 21, franchise: 'MCU', title: 'Ant-Man and the Wasp', type: 'movie', year: '2018', phase: 'Phase 3', chronologicalOrder: 21, releaseOrder: 20, poster: 'https://image.tmdb.org/t/p/w500/eivQmS3wqzqnQWILHLc4FsGfcXP.jpg', runtime: '1h 58m', rating: 7.0, platform: 'Disney+', description: 'Scott teams up with Hope' },
    { id: 22, franchise: 'MCU', title: 'Avengers: Infinity War', type: 'movie', year: '2018', phase: 'Phase 3', chronologicalOrder: 22, releaseOrder: 19, poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', runtime: '2h 29m', rating: 8.4, platform: 'Disney+', description: 'Thanos collects the Infinity Stones' },
    { id: 23, franchise: 'MCU', title: 'Avengers: Endgame', type: 'movie', year: '2019', phase: 'Phase 3', chronologicalOrder: 23, releaseOrder: 22, poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', runtime: '3h 1m', rating: 8.4, platform: 'Disney+', description: 'The Avengers undo the Snap' },
    { id: 24, franchise: 'MCU', title: 'Spider-Man: Far From Home', type: 'movie', year: '2019', phase: 'Phase 3', chronologicalOrder: 24, releaseOrder: 23, poster: 'https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg', runtime: '2h 9m', rating: 7.4, platform: 'Disney+', description: 'Peter faces Mysterio in Europe' },

    // Phase 4
    { id: 25, franchise: 'MCU', title: 'Shang-Chi and the Legend of the Ten Rings', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 25, releaseOrder: 25, poster: 'https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', runtime: '2h 12m', rating: 7.4, platform: 'Disney+', description: 'Shang-Chi faces his father' },
    { id: 26, franchise: 'MCU', title: 'Eternals', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 26, releaseOrder: 26, poster: 'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg', runtime: '2h 37m', rating: 6.3, platform: 'Disney+', description: 'Ancient beings protect Earth' },
    { id: 27, franchise: 'MCU', title: 'Spider-Man: No Way Home', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 27, releaseOrder: 27, poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', runtime: '2h 28m', rating: 8.2, platform: 'Disney+', description: 'The multiverse breaks open' },
    { id: 28, franchise: 'MCU', title: 'Doctor Strange in the Multiverse of Madness', type: 'movie', year: '2022', phase: 'Phase 4', chronologicalOrder: 28, releaseOrder: 28, poster: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', runtime: '2h 6m', rating: 6.9, platform: 'Disney+', description: 'Strange explores the multiverse' },
    { id: 29, franchise: 'MCU', title: 'Thor: Love and Thunder', type: 'movie', year: '2022', phase: 'Phase 4', chronologicalOrder: 29, releaseOrder: 29, poster: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', runtime: '1h 59m', rating: 6.2, platform: 'Disney+', description: 'Thor faces Gorr the God Butcher' },
    { id: 30, franchise: 'MCU', title: 'Black Panther: Wakanda Forever', type: 'movie', year: '2022', phase: 'Phase 4', chronologicalOrder: 30, releaseOrder: 30, poster: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', runtime: '2h 41m', rating: 6.7, platform: 'Disney+', description: 'Wakanda mourns and rises' },

    // Phase 5
    { id: 31, franchise: 'MCU', title: 'Ant-Man and the Wasp: Quantumania', type: 'movie', year: '2023', phase: 'Phase 5', chronologicalOrder: 31, releaseOrder: 31, poster: 'https://image.tmdb.org/t/p/w500/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg', runtime: '2h 5m', rating: 6.0, platform: 'Disney+', description: 'Scott enters the Quantum Realm' },
    { id: 32, franchise: 'MCU', title: 'Guardians of the Galaxy Vol. 3', type: 'movie', year: '2023', phase: 'Phase 5', chronologicalOrder: 32, releaseOrder: 32, poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', runtime: '2h 30m', rating: 7.9, platform: 'Disney+', description: 'The Guardians\' final mission' },
    { id: 33, franchise: 'MCU', title: 'The Marvels', type: 'movie', year: '2023', phase: 'Phase 5', chronologicalOrder: 33, releaseOrder: 33, poster: 'https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMqps5.jpg', runtime: '1h 45m', rating: 5.5, platform: 'Disney+', description: 'Carol, Monica, and Kamala team up' },
    { id: 34, franchise: 'MCU', title: 'Deadpool & Wolverine', type: 'movie', year: '2024', phase: 'Phase 5', chronologicalOrder: 34, releaseOrder: 34, poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', runtime: '2h 8m', rating: 7.7, platform: 'Disney+', description: 'Wade and Logan save the TVA' },

    // ========================================
    // DC CINEMATIC UNIVERSE / LEGACY (Mixed Timeline)
    // ========================================
    { id: 101, franchise: 'DC', title: 'Wonder Woman', type: 'movie', year: '2017', phase: 'DCEU', chronologicalOrder: 1, releaseOrder: 4, poster: 'https://image.tmdb.org/t/p/w500/imekS7f1OuHyUP2LAiMH0Nz81h.jpg', runtime: '2h 21m', rating: 7.2, platform: 'HBO Max', description: 'Diana fights in WWI' },
    { id: 102, franchise: 'DC', title: 'Wonder Woman 1984', type: 'movie', year: '2020', phase: 'DCEU', chronologicalOrder: 2, releaseOrder: 9, poster: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', runtime: '2h 31m', rating: 5.4, platform: 'HBO Max', description: 'Diana in the 80s' },
    { id: 103, franchise: 'DC', title: 'Man of Steel', type: 'movie', year: '2013', phase: 'DCEU', chronologicalOrder: 3, releaseOrder: 1, poster: 'https://image.tmdb.org/t/p/w500/7rIPjn5TUK04O25ZkMyHrGNPgKL.jpg', runtime: '2h 23m', rating: 7.1, platform: 'HBO Max', description: 'Superman reveals himself to the world' },
    { id: 104, franchise: 'DC', title: 'Batman v Superman: Dawn of Justice', type: 'movie', year: '2016', phase: 'DCEU', chronologicalOrder: 4, releaseOrder: 2, poster: 'https://image.tmdb.org/t/p/w500/5UsK3grJvtQrtzEgqNlDljJW96w.jpg', runtime: '2h 32m', rating: 5.9, platform: 'HBO Max', description: 'The Bat and the Son of Krypton clash' },
    { id: 105, franchise: 'DC', title: 'Suicide Squad', type: 'movie', year: '2016', phase: 'DCEU', chronologicalOrder: 5, releaseOrder: 3, poster: 'https://image.tmdb.org/t/p/w500/xFw9RXKZDvev23RAwdh0TfOmmQI.jpg', runtime: '2h 3m', rating: 5.9, platform: 'HBO Max', description: 'A task force of villains is assembled' },
    { id: 106, franchise: 'DC', title: 'Justice League', type: 'movie', year: '2017', phase: 'DCEU', chronologicalOrder: 6, releaseOrder: 5, poster: 'https://image.tmdb.org/t/p/w500/eifGNCSDuxJeS1loAXil5bIGgvC.jpg', runtime: '2h 0m', rating: 6.1, platform: 'HBO Max', description: 'Available via Snyder Cut (2021)' },
    { id: 107, franchise: 'DC', title: 'Aquaman', type: 'movie', year: '2018', phase: 'DCEU', chronologicalOrder: 7, releaseOrder: 6, poster: 'https://image.tmdb.org/t/p/w500/xLPffWMhMj1l50ND3KchMjYoKmE.jpg', runtime: '2h 23m', rating: 6.9, platform: 'HBO Max', description: 'Arthur Curry claims the throne' },
    { id: 108, franchise: 'DC', title: 'Shazam!', type: 'movie', year: '2019', phase: 'DCEU', chronologicalOrder: 8, releaseOrder: 7, poster: 'https://image.tmdb.org/t/p/w500/xnopI5Xtky18MPhK40cZAGAOVeV.jpg', runtime: '2h 12m', rating: 7.0, platform: 'HBO Max', description: 'Billy Batson becomes a hero' },
    { id: 109, franchise: 'DC', title: 'Birds of Prey', type: 'movie', year: '2020', phase: 'DCEU', chronologicalOrder: 9, releaseOrder: 8, poster: 'https://image.tmdb.org/t/p/w500/h4VB6m0RWCicVEZvzftYZyKXs6K.jpg', runtime: '1h 49m', rating: 7.0, platform: 'HBO Max', description: 'Harley Quinn after the breakup' },
    { id: 110, franchise: 'DC', title: 'The Suicide Squad', type: 'movie', year: '2021', phase: 'DCEU', chronologicalOrder: 10, releaseOrder: 10, poster: 'https://image.tmdb.org/t/p/w500/kb4s0ML0iWZlG6w8a7vY3T7sJyZ.jpg', runtime: '2h 12m', rating: 7.5, platform: 'HBO Max', description: 'A new mission for Task Force X' },
    { id: 111, franchise: 'DC', title: 'Black Adam', type: 'movie', year: '2022', phase: 'DCEU', chronologicalOrder: 11, releaseOrder: 11, poster: 'https://image.tmdb.org/t/p/w500/pFlaoHTZeyNkG83vxsAJiGzfSsa.jpg', runtime: '2h 5m', rating: 6.4, platform: 'HBO Max', description: 'Teth-Adam awakens' },
    { id: 112, franchise: 'DC', title: 'Shazam! Fury of the Gods', type: 'movie', year: '2023', phase: 'DCEU', chronologicalOrder: 12, releaseOrder: 12, poster: 'https://image.tmdb.org/t/p/w500/A3ZbZsmsvNGdprRi2lKgGEeVnGF.jpg', runtime: '2h 10m', rating: 6.6, platform: 'HBO Max', description: 'The Shazam family fights gods' },
    { id: 113, franchise: 'DC', title: 'The Flash', type: 'movie', year: '2023', phase: 'DCEU', chronologicalOrder: 13, releaseOrder: 13, poster: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', runtime: '2h 24m', rating: 6.7, platform: 'HBO Max', description: 'Barry changes the timeline' },
    { id: 114, franchise: 'DC', title: 'Blue Beetle', type: 'movie', year: '2023', phase: 'DCEU', chronologicalOrder: 14, releaseOrder: 14, poster: 'https://image.tmdb.org/t/p/w500/3WhR8OE6u41961J7X652k5f9Yy.jpg', runtime: '2h 7m', rating: 6.8, platform: 'HBO Max', description: 'Jaime Reyes finds the Scarab' },
    { id: 115, franchise: 'DC', title: 'Aquaman and the Lost Kingdom', type: 'movie', year: '2023', phase: 'DCEU', chronologicalOrder: 15, releaseOrder: 15, poster: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg', runtime: '2h 4m', rating: 6.5, platform: 'HBO Max', description: 'Arthur protects Atlantis' },
    { id: 116, franchise: 'DC', title: 'Joker', type: 'movie', year: '2019', phase: 'Elseworlds', chronologicalOrder: 0, releaseOrder: 100, poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8EkGsdr7ZVqe1jy.jpg', runtime: '2h 2m', rating: 8.1, platform: 'HBO Max', description: 'Arthur Fleck\'s descent into madness' },
    { id: 117, franchise: 'DC', title: 'The Batman', type: 'movie', year: '2022', phase: 'Elseworlds', chronologicalOrder: 0, releaseOrder: 101, poster: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50x9T2Zum8z.jpg', runtime: '2h 56m', rating: 7.7, platform: 'HBO Max', description: 'Bruce Wayne uncovers corruption' },
]

const phaseColors: Record<string, { bg: string; border: string; text: string }> = {
    // MCU Phases
    'Phase 1': { bg: 'bg-blue-950/50', border: 'border-blue-500/50', text: 'text-blue-400' },
    'Phase 2': { bg: 'bg-purple-950/50', border: 'border-purple-500/50', text: 'text-purple-400' },
    'Phase 3': { bg: 'bg-red-950/50', border: 'border-red-500/50', text: 'text-red-400' },
    'Phase 4': { bg: 'bg-green-950/50', border: 'border-green-500/50', text: 'text-green-400' },
    'Phase 5': { bg: 'bg-orange-950/50', border: 'border-orange-500/50', text: 'text-orange-400' },
    'Phase 6': { bg: 'bg-cyan-950/50', border: 'border-cyan-500/50', text: 'text-cyan-400' },
    // DC Phases
    'DCEU': { bg: 'bg-indigo-950/50', border: 'border-indigo-500/50', text: 'text-indigo-400' },
    'Elseworlds': { bg: 'bg-neutral-950/50', border: 'border-neutral-500/50', text: 'text-neutral-400' },
}

export default function WatchOrderPage() {
    const [activeTab, setActiveTab] = useState<'MCU' | 'DC'>('MCU')
    const [sortBy, setSortBy] = useState<'chronological' | 'release'>('chronological')

    const filteredItems = watchOrderData.filter(item => item.franchise === activeTab)

    const sortedItems = [...filteredItems].sort((a, b) => {
        if (sortBy === 'chronological') {
            return a.chronologicalOrder - b.chronologicalOrder
        }
        return a.releaseOrder - b.releaseOrder
    })

    const bgGradient = activeTab === 'MCU'
        ? 'from-cyan-400 via-blue-500 to-cyan-400'
        : 'from-blue-400 via-indigo-500 to-blue-400'

    return (
        <main className="min-h-screen px-4 sm:px-8 pt-8 pb-32">
            {/* Header */}
            <header className="text-center mb-8 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Play className={`w-8 h-8 ${activeTab === 'MCU' ? 'text-cyan-400' : 'text-blue-400'}`} />
                    <span className={`text-sm font-mono tracking-widest uppercase ${activeTab === 'MCU' ? 'text-cyan-400' : 'text-blue-400'}`}>
                        Official Watch Order
                    </span>
                    <Play className={`w-8 h-8 ${activeTab === 'MCU' ? 'text-cyan-400' : 'text-blue-400'}`} />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-orbitron text-center mb-4">
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${bgGradient} text-glow`}>
                        {activeTab} WATCH ORDER
                    </span>
                </h1>

                <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-inter mb-6">
                    The complete guide to watching the {activeTab === 'MCU' ? 'Marvel Cinematic Universe' : 'DC Universe'} in perfect order.
                </p>

                {/* Franchise Selector */}
                <div className="flex justify-center mb-8">
                    <Tabs defaultValue="MCU" className="w-[300px]" onValueChange={(v) => setActiveTab(v as 'MCU' | 'DC')}>
                        <TabsList className="grid w-full grid-cols-2 bg-neutral-900/50">
                            <TabsTrigger value="MCU" className="data-[state=active]:bg-cyan-950 data-[state=active]:text-cyan-400 font-orbitron">MCU</TabsTrigger>
                            <TabsTrigger value="DC" className="data-[state=active]:bg-blue-950 data-[state=active]:text-blue-400 font-orbitron">DC</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-4">
                    <div className="glass-panel rounded-full px-5 py-2.5 flex items-center gap-2">
                        <Film className={`w-4 h-4 ${activeTab === 'MCU' ? 'text-cyan-400' : 'text-blue-400'}`} />
                        <span className="font-mono text-white">{filteredItems.length}</span>
                        <span className="text-neutral-400 text-sm">Movies</span>
                    </div>
                    <div className="glass-panel rounded-full px-5 py-2.5 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span className="font-mono text-white">{activeTab === 'MCU' ? '60+' : '30+'}</span>
                        <span className="text-neutral-400 text-sm">Hours</span>
                    </div>
                </div>
            </header>

            {/* Sort Toggle */}
            <div className="max-w-4xl mx-auto mb-8">
                <div className="flex justify-center">
                    <div className="glass-panel rounded-full p-1 flex">
                        <button
                            onClick={() => setSortBy('chronological')}
                            className={`px-6 py-2.5 rounded-full font-orbitron text-sm transition-all flex items-center gap-2 ${sortBy === 'chronological'
                                ? 'bg-neutral-800 text-white shadow-lg'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">Chronological</span>
                            <span className="sm:hidden">Story</span>
                        </button>
                        <button
                            onClick={() => setSortBy('release')}
                            className={`px-6 py-2.5 rounded-full font-orbitron text-sm transition-all flex items-center gap-2 ${sortBy === 'release'
                                ? 'bg-neutral-800 text-white shadow-lg'
                                : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden sm:inline">Release Date</span>
                            <span className="sm:hidden">Release</span>
                        </button>
                    </div>
                </div>
                <p className="text-center text-neutral-500 text-sm mt-3">
                    {sortBy === 'chronological'
                        ? '📖 Watch in story timeline order (recommended for rewatches)'
                        : '🎬 Watch in the order movies were released (recommended for first-timers)'}
                </p>
            </div>

            {/* Watch List */}
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab + sortBy}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {sortedItems.map((item, index) => {
                            const colors = phaseColors[item.phase] || phaseColors['Phase 1']

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className="mb-4"
                                >
                                    <div className="glass-panel glass-card-hover rounded-xl overflow-hidden hover:border-opacity-50 transition-all duration-300">
                                        <div className="flex flex-col sm:flex-row">
                                            {/* Order Number */}
                                            <div className={`flex sm:flex-col items-center justify-center p-4 sm:p-6 ${colors.bg} sm:w-20`}>
                                                <span className={`text-3xl sm:text-4xl font-bold font-orbitron ${colors.text}`}>
                                                    {index + 1}
                                                </span>
                                            </div>

                                            {/* Poster */}
                                            <div className="relative w-full sm:w-32 h-48 sm:h-auto flex-shrink-0 bg-neutral-900">
                                                <Image
                                                    src={item.poster}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 640px) 100vw, 128px"
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
                                                <div>
                                                    {/* Badges */}
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <Badge className={`${colors.bg} ${colors.border} ${colors.text} font-orbitron text-xs`}>
                                                            {item.phase}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-neutral-800/50 border-neutral-600/50 text-neutral-300 text-xs">
                                                            {item.type === 'movie' ? <Film className="w-3 h-3 mr-1" /> : <Tv className="w-3 h-3 mr-1" />}
                                                            {item.type}
                                                        </Badge>
                                                        <Badge variant="outline" className="bg-neutral-800/50 border-neutral-600/50 text-neutral-300 text-xs">
                                                            {item.year}
                                                        </Badge>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-lg sm:text-xl font-bold font-orbitron text-white mb-2">
                                                        {item.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-sm text-neutral-400 mb-3 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {/* Meta */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                                                    {item.runtime && (
                                                        <div className="flex items-center gap-1 text-neutral-400">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{item.runtime}</span>
                                                        </div>
                                                    )}
                                                    {item.rating && (
                                                        <div className="flex items-center gap-1 text-yellow-400">
                                                            <Star className="w-4 h-4 fill-yellow-400" />
                                                            <span>{item.rating}</span>
                                                        </div>
                                                    )}
                                                    <div className={`flex items-center gap-1 ${activeTab === 'MCU' ? 'text-cyan-400' : 'text-blue-400'}`}>
                                                        <Tv className="w-4 h-4" />
                                                        <span>{item.platform}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    )
}
