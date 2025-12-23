'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Lock, Zap, Globe } from 'lucide-react'
import type { Hero } from '@/lib/supabase'

interface HeroCardProps {
    hero: Hero
    index?: number
}

const franchiseColors: Record<string, { bg: string; border: string; text: string; glow: string; shadowColor: string }> = {
    'MCU': { bg: 'bg-cyan-950/80', border: 'border-cyan-500/50', text: 'text-cyan-400', glow: 'shadow-cyan-500/30', shadowColor: 'rgba(6, 182, 212, 0.3)' },
    'X-Men': { bg: 'bg-yellow-950/80', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: 'shadow-yellow-500/30', shadowColor: 'rgba(234, 179, 8, 0.3)' },
    'Spider-Verse': { bg: 'bg-red-950/80', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/30', shadowColor: 'rgba(239, 68, 68, 0.3)' },
    'Defenders': { bg: 'bg-purple-950/80', border: 'border-purple-500/50', text: 'text-purple-400', glow: 'shadow-purple-500/30', shadowColor: 'rgba(168, 85, 247, 0.3)' },
    'DC': { bg: 'bg-blue-950/80', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-blue-500/30', shadowColor: 'rgba(59, 130, 246, 0.3)' },
    'Anime': { bg: 'bg-orange-950/80', border: 'border-orange-500/50', text: 'text-orange-400', glow: 'shadow-orange-500/30', shadowColor: 'rgba(249, 115, 22, 0.3)' },
    'The Boys': { bg: 'bg-red-950/80', border: 'border-red-500/50', text: 'text-red-400', glow: 'shadow-red-500/30', shadowColor: 'rgba(220, 38, 38, 0.3)' },
    'Invincible': { bg: 'bg-yellow-950/80', border: 'border-yellow-500/50', text: 'text-yellow-400', glow: 'shadow-yellow-500/30', shadowColor: 'rgba(250, 204, 21, 0.3)' },
    'Peacemaker': { bg: 'bg-red-950/80', border: 'border-blue-500/50', text: 'text-blue-400', glow: 'shadow-red-500/30', shadowColor: 'rgba(239, 68, 68, 0.3)' },
}

export default function HeroCard({ hero, index = 0 }: HeroCardProps) {
    const colors = franchiseColors[hero.franchise] || franchiseColors['MCU']
    const slug = hero.alias.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-50px" })

    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        setIsAdmin(sessionStorage.getItem('admin_auth') === 'true')
    }, [])

    return (
        <Link href={hero.is_locked_content && !isAdmin ? '#' : `/hero/${slug}`}>
            <motion.div
                ref={ref}
                className={`relative group h-[420px] rounded-2xl overflow-hidden ${hero.is_locked_content && !isAdmin ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                initial={{ opacity: 0, y: 80, rotateX: -15, scale: 0.9 }}
                animate={isInView ? {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1
                } : {}}
                transition={{
                    duration: 0.7,
                    delay: index * 0.1,
                    ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={hero.is_locked_content && !isAdmin ? {} : {
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.3 }
                }}
                whileTap={hero.is_locked_content && !isAdmin ? {} : { scale: 0.98 }}
                style={{
                    boxShadow: `0 20px 40px -15px ${colors.shadowColor}`,
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Border glow on hover */}
                <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
                    style={{
                        background: `linear-gradient(135deg, ${colors.shadowColor}, transparent, ${colors.shadowColor})`,
                        padding: '1px',
                    }}
                />

                <div className="absolute inset-[1px] rounded-2xl overflow-hidden bg-neutral-900">
                    {/* Full Background Image */}
                    <div className="absolute inset-0">
                        {/* Fallback gradient with initials - shows behind image */}
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-black z-0">
                            <motion.span
                                className={`text-6xl font-orbitron font-bold ${colors.text} opacity-20`}
                                animate={{ scale: [1, 1.1, 1], opacity: [0.15, 0.25, 0.15] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                {hero.alias.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </motion.span>
                        </div>
                        {/* Image on top of fallback - Using standard img tag for reliability */}
                        {hero.image_url && (
                            <img
                                src={hero.image_url}
                                alt={hero.alias}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 z-10"
                                onError={(e) => {
                                    // If image fails, hide it to show fallback
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                }}
                            />
                        )}
                    </div>

                    {/* Gradient Overlay - More pronounced at bottom */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90 z-20" />

                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-radial-gradient z-20"
                        style={{
                            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
                        }}
                    />

                    {/* Holographic scan line effect on hover */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-30 pointer-events-none transition-opacity duration-300 z-30"
                        style={{
                            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                        }}
                    />

                    {/* Shine effect on hover */}
                    <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none z-30"
                        initial={{ x: '-100%', opacity: 0 }}
                        whileHover={{ x: '200%', opacity: 0.1 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            width: '50%',
                        }}
                    />

                    {/* Locked Content Overlay - Hidden for Admin */}
                    {hero.is_locked_content && !isAdmin && (
                        <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-sm flex items-center justify-center z-40">
                            <motion.div
                                className="flex flex-col items-center gap-2"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Lock className="w-12 h-12 text-cyan-400" />
                                <span className="text-sm text-cyan-400 font-orbitron">PREMIUM</span>
                            </motion.div>
                        </div>
                    )}

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-40">
                        <Badge
                            variant="outline"
                            className={`${colors.bg} ${colors.border} ${colors.text} text-xs font-orbitron backdrop-blur-md`}
                        >
                            {hero.franchise}
                        </Badge>

                        {hero.powers && hero.powers.length > 0 && (
                            <Badge
                                variant="outline"
                                className="bg-black/60 border-neutral-600/50 text-neutral-300 text-xs backdrop-blur-md"
                            >
                                <Zap className="w-3 h-3 mr-1" />
                                {hero.powers.length}
                            </Badge>
                        )}
                    </div>

                    {/* Bottom Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-40">
                        {/* Hero Name */}
                        <motion.h3
                            className="text-2xl font-bold font-orbitron text-white mb-1 drop-shadow-lg"
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1 + 0.3 }}
                        >
                            {hero.alias}
                        </motion.h3>

                        {/* Real Name */}
                        <motion.p
                            className="text-sm text-neutral-300 font-inter mb-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1 + 0.4 }}
                        >
                            {hero.name}
                        </motion.p>

                        {/* Origin World */}
                        <motion.div
                            className={`flex items-center gap-1.5 text-xs ${colors.text}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: index * 0.1 + 0.5 }}
                        >
                            <Globe className="w-3 h-3" />
                            <span className="font-mono">{hero.origin_world}</span>
                        </motion.div>

                        {/* Powers Preview - Show on hover */}
                        <motion.div
                            className="mt-3 overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            whileHover={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-wrap gap-1">
                                {hero.powers?.slice(0, 3).map((power, i) => (
                                    <span
                                        key={i}
                                        className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 backdrop-blur-sm border border-white/10"
                                    >
                                        {power}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
