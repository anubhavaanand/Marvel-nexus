'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

// Franchise background themes
const franchiseThemes: Record<string, {
    gradient: string
    particles: string
    glow: string
}> = {
    mcu: {
        gradient: 'from-cyan-900/30 via-blue-900/20 to-transparent',
        particles: 'bg-cyan-500',
        glow: 'shadow-cyan-500/30',
    },
    xmen: {
        gradient: 'from-yellow-900/30 via-amber-900/20 to-transparent',
        particles: 'bg-yellow-500',
        glow: 'shadow-yellow-500/30',
    },
    spider: {
        gradient: 'from-red-900/30 via-rose-900/20 to-transparent',
        particles: 'bg-red-500',
        glow: 'shadow-red-500/30',
    },
    dc: {
        gradient: 'from-blue-900/30 via-indigo-900/20 to-transparent',
        particles: 'bg-blue-500',
        glow: 'shadow-blue-500/30',
    },
    anime: {
        gradient: 'from-orange-900/30 via-amber-900/20 to-transparent',
        particles: 'bg-orange-500',
        glow: 'shadow-orange-500/30',
    },
    theboys: {
        gradient: 'from-red-950/40 via-red-900/20 to-transparent',
        particles: 'bg-red-600',
        glow: 'shadow-red-600/30',
    },
    invincible: {
        gradient: 'from-yellow-900/30 via-orange-900/20 to-transparent',
        particles: 'bg-yellow-400',
        glow: 'shadow-yellow-400/30',
    },
}

// Animated background component
export function FranchiseBackground({ franchise }: { franchise: string }) {
    const theme = franchiseThemes[franchise] || franchiseThemes.mcu

    return (
        <motion.div
            key={franchise}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Main gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient}`} />

            {/* Animated orbs */}
            <motion.div
                className={`absolute w-96 h-96 rounded-full ${theme.particles} opacity-10 blur-3xl`}
                animate={{
                    x: [0, 100, 0],
                    y: [0, -50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: '10%', left: '10%' }}
            />
            <motion.div
                className={`absolute w-64 h-64 rounded-full ${theme.particles} opacity-10 blur-3xl`}
                animate={{
                    x: [0, -80, 0],
                    y: [0, 80, 0],
                    scale: [1, 1.3, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{ top: '50%', right: '10%' }}
            />

            {/* Scan lines effect */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                }}
            />

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />
        </motion.div>
    )
}

// Parallax section wrapper
export function ParallaxSection({ children, offset = 50 }: { children: React.ReactNode, offset?: number }) {
    const ref = useRef(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], [offset, -offset])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 1, 1, 0.5])

    return (
        <motion.div
            ref={ref}
            style={{ y, opacity }}
            className="relative"
        >
            {children}
        </motion.div>
    )
}

// Animated section header
export function SectionHeader({
    title,
    subtitle,
    color = 'cyan'
}: {
    title: string
    subtitle?: string
    color?: string
}) {
    const colorClasses: Record<string, string> = {
        cyan: 'from-cyan-500 to-blue-500 text-cyan-400',
        yellow: 'from-yellow-500 to-amber-500 text-yellow-400',
        red: 'from-red-500 to-rose-500 text-red-400',
        blue: 'from-blue-500 to-indigo-500 text-blue-400',
        orange: 'from-orange-500 to-amber-500 text-orange-400',
        purple: 'from-purple-500 to-pink-500 text-purple-400',
    }

    const classes = colorClasses[color] || colorClasses.cyan

    return (
        <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
        >
            <div className="flex items-center gap-4">
                <motion.div
                    className={`h-1 w-20 rounded-full bg-gradient-to-r ${classes.split(' ')[0]} ${classes.split(' ')[1]}`}
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                />
                <h2 className={`text-3xl font-orbitron font-bold ${classes.split(' ')[2]}`}>
                    {title}
                </h2>
            </div>
            {subtitle && (
                <p className="text-neutral-400 mt-2 ml-24">{subtitle}</p>
            )}
        </motion.div>
    )
}

// Floating particles component
export function FloatingParticles({ color = 'cyan', count = 20 }: { color?: string, count?: number }) {
    const colorClasses: Record<string, string> = {
        cyan: 'bg-cyan-400',
        yellow: 'bg-yellow-400',
        red: 'bg-red-400',
        blue: 'bg-blue-400',
        orange: 'bg-orange-400',
    }

    const bgClass = colorClasses[color] || colorClasses.cyan

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-1 h-1 rounded-full ${bgClass}`}
                    initial={{
                        x: Math.random() * 100 + '%',
                        y: Math.random() * 100 + '%',
                        opacity: Math.random() * 0.5 + 0.1,
                    }}
                    animate={{
                        y: [
                            Math.random() * 100 + '%',
                            Math.random() * 100 + '%',
                        ],
                        opacity: [0.1, 0.5, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    )
}

// Cinematic card reveal animation
export const cardRevealVariants = {
    hidden: {
        opacity: 0,
        y: 60,
        scale: 0.9,
        rotateX: -10,
    },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
}

// Glowing border component
export function GlowingBorder({ color = 'cyan', children }: { color?: string, children: React.ReactNode }) {
    const colorClasses: Record<string, string> = {
        cyan: 'from-cyan-500 via-cyan-400 to-cyan-500',
        yellow: 'from-yellow-500 via-yellow-400 to-yellow-500',
        red: 'from-red-500 via-red-400 to-red-500',
        blue: 'from-blue-500 via-blue-400 to-blue-500',
        orange: 'from-orange-500 via-orange-400 to-orange-500',
    }

    const classes = colorClasses[color] || colorClasses.cyan

    return (
        <div className="relative p-[1px] rounded-2xl overflow-hidden">
            <motion.div
                className={`absolute inset-0 bg-gradient-to-r ${classes}`}
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundSize: '200% 200%',
                }}
            />
            <div className="relative bg-neutral-900 rounded-2xl">
                {children}
            </div>
        </div>
    )
}
