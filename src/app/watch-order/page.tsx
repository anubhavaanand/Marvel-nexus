'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Play,
  Calendar,
  Clock,
  Star,
  Tv,
  Film,
  ArrowUpDown,
  Sparkles
} from 'lucide-react'

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

const watchOrderData: WatchItem[] = [
  { id: 1, franchise: 'MCU', title: 'Captain America: The First Avenger', type: 'movie', year: '2011', phase: 'Phase 1', chronologicalOrder: 1, releaseOrder: 5, poster: 'https://image.tmdb.org/t/p/w500/vSNxAJTlD0r02V9sPYpOjqDZXUK.jpg', runtime: '2h 4m', rating: 6.9, platform: 'Disney+', description: 'During WWII, Steve Rogers becomes Captain America' },
  { id: 2, franchise: 'MCU', title: 'Captain Marvel', type: 'movie', year: '2019', phase: 'Phase 3', chronologicalOrder: 2, releaseOrder: 21, poster: 'https://image.tmdb.org/t/p/w500/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg', runtime: '2h 3m', rating: 6.8, platform: 'Disney+', description: 'Carol Danvers becomes Captain Marvel in the 1990s' },
  { id: 3, franchise: 'MCU', title: 'Iron Man', type: 'movie', year: '2008', phase: 'Phase 1', chronologicalOrder: 3, releaseOrder: 1, poster: 'https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9COBYI0dWDJa.jpg', runtime: '2h 6m', rating: 7.9, platform: 'Disney+', description: 'Tony Stark builds the Iron Man suit' },
  { id: 4, franchise: 'MCU', title: 'Iron Man 2', type: 'movie', year: '2010', phase: 'Phase 1', chronologicalOrder: 4, releaseOrder: 3, poster: 'https://image.tmdb.org/t/p/w500/6WBeq4fCfn7AN0o21W9qNcRF2l9.jpg', runtime: '2h 4m', rating: 7.0, platform: 'Disney+', description: 'Tony faces new enemies and his own mortality' },
  { id: 5, franchise: 'MCU', title: 'The Incredible Hulk', type: 'movie', year: '2008', phase: 'Phase 1', chronologicalOrder: 5, releaseOrder: 2, poster: 'https://image.tmdb.org/t/p/w500/gKzYx79y0AQTL4UAk1cBQJ3nvrm.jpg', runtime: '1h 52m', rating: 6.7, platform: 'Disney+', description: 'Bruce Banner hides from the military' },
  { id: 6, franchise: 'MCU', title: 'Thor', type: 'movie', year: '2011', phase: 'Phase 1', chronologicalOrder: 6, releaseOrder: 4, poster: 'https://image.tmdb.org/t/p/w500/prSfAi1xGrhLQNxVSUFh61xQ4Qy.jpg', runtime: '1h 55m', rating: 7.0, platform: 'Disney+', description: 'Thor is banished from Asgard to Earth' },
  { id: 7, franchise: 'MCU', title: 'The Avengers', type: 'movie', year: '2012', phase: 'Phase 1', chronologicalOrder: 7, releaseOrder: 6, poster: 'https://image.tmdb.org/t/p/w500/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg', runtime: '2h 23m', rating: 8.0, platform: 'Disney+', description: 'Earth\'s Mightiest Heroes assemble' },
  { id: 8, franchise: 'MCU', title: 'Iron Man 3', type: 'movie', year: '2013', phase: 'Phase 2', chronologicalOrder: 8, releaseOrder: 7, poster: 'https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg', runtime: '2h 10m', rating: 7.1, platform: 'Disney+', description: 'Tony faces the Mandarin' },
  { id: 9, franchise: 'MCU', title: 'Thor: The Dark World', type: 'movie', year: '2013', phase: 'Phase 2', chronologicalOrder: 9, releaseOrder: 8, poster: 'https://image.tmdb.org/t/p/w500/wp6OxE4poJ4G7c0U2ZIXasTSMR7.jpg', runtime: '1h 52m', rating: 6.8, platform: 'Disney+', description: 'Thor battles the Dark Elves' },
  { id: 10, franchise: 'MCU', title: 'Captain America: The Winter Soldier', type: 'movie', year: '2014', phase: 'Phase 2', chronologicalOrder: 10, releaseOrder: 9, poster: 'https://image.tmdb.org/t/p/w500/tVFRpFw3xTedgPGqxW0AOI8Qhh0.jpg', runtime: '2h 16m', rating: 7.7, platform: 'Disney+', description: 'Steve faces a ghost from the past' },
  { id: 11, franchise: 'MCU', title: 'Guardians of the Galaxy', type: 'movie', year: '2014', phase: 'Phase 2', chronologicalOrder: 11, releaseOrder: 10, poster: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg', runtime: '2h 1m', rating: 8.0, platform: 'Disney+', description: 'A group of misfits save the galaxy' },
  { id: 12, franchise: 'MCU', title: 'Guardians of the Galaxy Vol. 2', type: 'movie', year: '2017', phase: 'Phase 3', chronologicalOrder: 12, releaseOrder: 15, poster: 'https://image.tmdb.org/t/p/w500/y4MBh0EjBlMuOzv9axM4qJlmhzz.jpg', runtime: '2h 16m', rating: 7.6, platform: 'Disney+', description: 'Peter Quill learns about his father' },
  { id: 13, franchise: 'MCU', title: 'Avengers: Age of Ultron', type: 'movie', year: '2015', phase: 'Phase 2', chronologicalOrder: 13, releaseOrder: 11, poster: 'https://image.tmdb.org/t/p/w500/4ssDuvEDkSArWEdyBl2X5EHvYKU.jpg', runtime: '2h 21m', rating: 7.3, platform: 'Disney+', description: 'The Avengers face Ultron' },
  { id: 14, franchise: 'MCU', title: 'Ant-Man', type: 'movie', year: '2015', phase: 'Phase 2', chronologicalOrder: 14, releaseOrder: 12, poster: 'https://image.tmdb.org/t/p/w500/rQRnQfUl3kfp78nCWq8Ks04vnq1.jpg', runtime: '1h 57m', rating: 7.3, platform: 'Disney+', description: 'Scott Lang becomes Ant-Man' },
  { id: 15, franchise: 'MCU', title: 'Captain America: Civil War', type: 'movie', year: '2016', phase: 'Phase 3', chronologicalOrder: 15, releaseOrder: 13, poster: 'https://image.tmdb.org/t/p/w500/rAGiXaUfPzY7CDEyNKUofk3Kw2e.jpg', runtime: '2h 27m', rating: 7.8, platform: 'Disney+', description: 'The Avengers fight each other' },
  { id: 16, franchise: 'MCU', title: 'Black Widow', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 16, releaseOrder: 24, poster: 'https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg', runtime: '2h 14m', rating: 6.7, platform: 'Disney+', description: 'Natasha confronts her past' },
  { id: 17, franchise: 'MCU', title: 'Black Panther', type: 'movie', year: '2018', phase: 'Phase 3', chronologicalOrder: 17, releaseOrder: 18, poster: 'https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg', runtime: '2h 14m', rating: 7.3, platform: 'Disney+', description: 'T\'Challa becomes king of Wakanda' },
  { id: 18, franchise: 'MCU', title: 'Spider-Man: Homecoming', type: 'movie', year: '2017', phase: 'Phase 3', chronologicalOrder: 18, releaseOrder: 16, poster: 'https://image.tmdb.org/t/p/w500/c24sv2weTHPsmDa7jEMN0m2P3RT.jpg', runtime: '2h 13m', rating: 7.4, platform: 'Disney+', description: 'Peter Parker\'s MCU debut' },
  { id: 19, franchise: 'MCU', title: 'Doctor Strange', type: 'movie', year: '2016', phase: 'Phase 3', chronologicalOrder: 19, releaseOrder: 14, poster: 'https://image.tmdb.org/t/p/w500/uGBVj3bEbCoZbDjjl9wTxcygko1.jpg', runtime: '1h 55m', rating: 7.5, platform: 'Disney+', description: 'Stephen Strange learns the mystic arts' },
  { id: 20, franchise: 'MCU', title: 'Thor: Ragnarok', type: 'movie', year: '2017', phase: 'Phase 3', chronologicalOrder: 20, releaseOrder: 17, poster: 'https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tSdJu.jpg', runtime: '2h 10m', rating: 7.9, platform: 'Disney+', description: 'Thor faces Hela and Ragnarok' },
  { id: 21, franchise: 'MCU', title: 'Ant-Man and the Wasp', type: 'movie', year: '2018', phase: 'Phase 3', chronologicalOrder: 21, releaseOrder: 20, poster: 'https://image.tmdb.org/t/p/w500/rv1AWImgx386ULjcf62VYaW8zSt.jpg', runtime: '1h 58m', rating: 7.0, platform: 'Disney+', description: 'Scott teams up with Hope' },
  { id: 22, franchise: 'MCU', title: 'Avengers: Infinity War', type: 'movie', year: '2018', phase: 'Phase 3', chronologicalOrder: 22, releaseOrder: 19, poster: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg', runtime: '2h 29m', rating: 8.4, platform: 'Disney+', description: 'Thanos collects the Infinity Stones' },
  { id: 23, franchise: 'MCU', title: 'Avengers: Endgame', type: 'movie', year: '2019', phase: 'Phase 3', chronologicalOrder: 23, releaseOrder: 22, poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg', runtime: '3h 1m', rating: 8.4, platform: 'Disney+', description: 'The Avengers undo the Snap' },
  { id: 24, franchise: 'MCU', title: 'Spider-Man: Far From Home', type: 'movie', year: '2019', phase: 'Phase 3', chronologicalOrder: 24, releaseOrder: 23, poster: 'https://image.tmdb.org/t/p/w500/4q2NNj4S5dG2RLF9CpXsej7yXl.jpg', runtime: '2h 9m', rating: 7.4, platform: 'Disney+', description: 'Peter faces Mysterio in Europe' },
  { id: 25, franchise: 'MCU', title: 'Shang-Chi and the Legend of the Ten Rings', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 25, releaseOrder: 25, poster: 'https://image.tmdb.org/t/p/w500/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg', runtime: '2h 12m', rating: 7.4, platform: 'Disney+', description: 'Shang-Chi faces his father' },
  { id: 26, franchise: 'MCU', title: 'Eternals', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 26, releaseOrder: 26, poster: 'https://image.tmdb.org/t/p/w500/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg', runtime: '2h 37m', rating: 6.3, platform: 'Disney+', description: 'Ancient beings protect Earth' },
  { id: 27, franchise: 'MCU', title: 'Spider-Man: No Way Home', type: 'movie', year: '2021', phase: 'Phase 4', chronologicalOrder: 27, releaseOrder: 27, poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', runtime: '2h 28m', rating: 8.2, platform: 'Disney+', description: 'The multiverse breaks open' },
  { id: 28, franchise: 'MCU', title: 'Doctor Strange in the Multiverse of Madness', type: 'movie', year: '2022', phase: 'Phase 4', chronologicalOrder: 28, releaseOrder: 28, poster: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', runtime: '2h 6m', rating: 6.9, platform: 'Disney+', description: 'Strange explores the multiverse' },
  { id: 29, franchise: 'MCU', title: 'Thor: Love and Thunder', type: 'movie', year: '2022', phase: 'Phase 4', chronologicalOrder: 29, releaseOrder: 29, poster: 'https://image.tmdb.org/t/p/w500/pIkRyD18kl4FhoCNQuWxWu5cBLM.jpg', runtime: '1h 59m', rating: 6.2, platform: 'Disney+', description: 'Thor faces Gorr the God Butcher' },
  { id: 30, franchise: 'MCU', title: 'Black Panther: Wakanda Forever', type: 'movie', year: '2022', phase: 'Phase 4', chronologicalOrder: 30, releaseOrder: 30, poster: 'https://image.tmdb.org/t/p/w500/sv1xJUazXeYqALzczSZ3O6nkH75.jpg', runtime: '2h 41m', rating: 6.7, platform: 'Disney+', description: 'Wakanda mourns and rises' },
  { id: 31, franchise: 'MCU', title: 'Ant-Man and the Wasp: Quantumania', type: 'movie', year: '2023', phase: 'Phase 5', chronologicalOrder: 31, releaseOrder: 31, poster: 'https://image.tmdb.org/t/p/w500/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg', runtime: '2h 5m', rating: 6.0, platform: 'Disney+', description: 'Scott enters the Quantum Realm' },
  { id: 32, franchise: 'MCU', title: 'Guardians of the Galaxy Vol. 3', type: 'movie', year: '2023', phase: 'Phase 5', chronologicalOrder: 32, releaseOrder: 32, poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', runtime: '2h 30m', rating: 7.9, platform: 'Disney+', description: 'The Guardians\' final mission' },
  { id: 33, franchise: 'MCU', title: 'The Marvels', type: 'movie', year: '2023', phase: 'Phase 5', chronologicalOrder: 33, releaseOrder: 33, poster: 'https://image.tmdb.org/t/p/w500/tUtgLOESpCx7ue4BaeCTqp3vn1b.jpg', runtime: '1h 45m', rating: 5.5, platform: 'Disney+', description: 'Carol, Monica, and Kamala team up' },
  { id: 34, franchise: 'MCU', title: 'Deadpool & Wolverine', type: 'movie', year: '2024', phase: 'Phase 5', chronologicalOrder: 34, releaseOrder: 34, poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg', runtime: '2h 8m', rating: 7.7, platform: 'Disney+', description: 'Wade and Logan save the TVA' },
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

const phaseColors: Record<string, { primary: string; bg: string; text: string }> = {
  'Phase 1': { primary: 'var(--franchise-mcu)', bg: 'bg-[var(--franchise-mcu)]/10', text: 'text-[var(--franchise-mcu)]' },
  'Phase 2': { primary: '#a855f7', bg: 'bg-purple-500/10', text: 'text-purple-500' },
  'Phase 3': { primary: 'var(--franchise-spider)', bg: 'bg-[var(--franchise-spider)]/10', text: 'text-[var(--franchise-spider)]' },
  'Phase 4': { primary: 'var(--success)', bg: 'bg-[var(--success)]/10', text: 'text-[var(--success)]' },
  'Phase 5': { primary: 'var(--franchise-anime)', bg: 'bg-[var(--franchise-anime)]/10', text: 'text-[var(--franchise-anime)]' },
  'Phase 6': { primary: 'var(--accent)', bg: 'bg-[var(--accent)]/10', text: 'text-[var(--accent)]' },
  'DCEU': { primary: 'var(--franchise-dc)', bg: 'bg-[var(--franchise-dc)]/10', text: 'text-[var(--franchise-dc)]' },
  'Elseworlds': { primary: 'var(--meta)', bg: 'bg-[var(--surface)]', text: 'text-[var(--muted)]' },
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

  const accentColor = activeTab === 'MCU' ? 'var(--franchise-mcu)' : 'var(--franchise-dc)'

  return (
    <main className="min-h-screen">
      <section className="relative bg-[var(--bg)] overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at center, ${accentColor}15 0%, transparent 60%)`
          }}
        />

        <div className="relative container-wide py-28 sm:py-36">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium glass text-[var(--fg-2)]">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: accentColor }} />
                Official Watch Order
              </span>
            </div>

            <h1 className="text-hero mb-6 leading-[1.05]">
              <span className="text-[var(--fg)]">{activeTab}</span>
              <br />
              <span
                className="text-gradient"
                style={{ backgroundImage: `linear-gradient(135deg, ${accentColor}, #60a5fa)` }}
              >
                Watch Order
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[var(--fg-2)] max-w-2xl mx-auto mb-10 leading-relaxed">
              The complete guide to watching the {activeTab === 'MCU' ? 'Marvel Cinematic Universe' : 'DC Universe'} in perfect order.
            </p>

            <div className="flex justify-center mb-8">
              <div className="tabs-list">
                <button
                  onClick={() => setActiveTab('MCU')}
                  className={`tab-trigger ${activeTab === 'MCU' ? 'active' : ''}`}
                >
                  MCU
                </button>
                <button
                  onClick={() => setActiveTab('DC')}
                  className={`tab-trigger ${activeTab === 'DC' ? 'active' : ''}`}
                >
                  DC
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <div className="stat-pill">
                <Film className="w-3.5 h-3.5" style={{ color: accentColor }} />
                <span className="stat-value">{filteredItems.length}</span>
                <span className="stat-label">Movies</span>
              </div>
              <div className="stat-pill">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                <span className="stat-value">{activeTab === 'MCU' ? '60+' : '30+'}</span>
                <span className="stat-label">Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-wide">
        <div className="divider" />
      </div>

      <section className="section bg-[var(--bg)]">
        <div className="container-wide">
          <div className="flex justify-center mb-10">
            <div className="tabs-list">
              <button
                onClick={() => setSortBy('chronological')}
                className={`tab-trigger ${sortBy === 'chronological' ? 'active' : ''}`}
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">Chronological</span>
                <span className="sm:hidden">Story</span>
              </button>
              <button
                onClick={() => setSortBy('release')}
                className={`tab-trigger ${sortBy === 'release' ? 'active' : ''}`}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Release Date</span>
                <span className="sm:hidden">Release</span>
              </button>
            </div>
          </div>

          <p className="text-center text-[var(--meta)] text-sm mb-10">
            {sortBy === 'chronological'
              ? 'Watch in story timeline order (recommended for rewatches)'
              : 'Watch in the order movies were released (recommended for first-timers)'}
          </p>

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
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="mb-4"
                    >
                      <div className="card-glass overflow-hidden">
                        <div className="flex flex-col sm:flex-row">
                          <div className={`flex sm:flex-col items-center justify-center p-4 sm:p-5 ${colors.bg} sm:w-16`}>
                            <span className={`text-xl sm:text-2xl font-semibold ${colors.text}`}>
                              {index + 1}
                            </span>
                          </div>

                          <div className="relative w-full sm:w-28 h-44 sm:h-auto flex-shrink-0 bg-[var(--surface)]">
                            <Image
                              src={item.poster}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 112px"
                            />
                          </div>

                          <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text}`}>
                                  {item.phase}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium glass text-[var(--muted)]">
                                  {item.type === 'movie' ? <Film className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                                  {item.type}
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium glass text-[var(--muted)]">
                                  {item.year}
                                </span>
                              </div>

                              <h3 className="text-base sm:text-lg font-semibold text-[var(--fg)] mb-1.5">
                                {item.title}
                              </h3>

                              <p className="text-sm text-[var(--muted)] mb-2 line-clamp-2">
                                {item.description}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                              {item.runtime && (
                                <div className="flex items-center gap-1 text-[var(--meta)]">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span className="text-xs">{item.runtime}</span>
                                </div>
                              )}
                              {item.rating && (
                                <div className="flex items-center gap-1 text-[#ca8a04]">
                                  <Star className="w-3.5 h-3.5 fill-[#ca8a04]" />
                                  <span className="text-xs">{item.rating}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1 text-xs" style={{ color: accentColor }}>
                                <Tv className="w-3.5 h-3.5" />
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
        </div>
      </section>
    </main>
  )
}
