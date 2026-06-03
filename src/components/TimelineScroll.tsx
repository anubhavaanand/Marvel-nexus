'use client'

import { motion, useScroll, useSpring, useTransform, MotionValue } from 'framer-motion'
import { useState } from 'react'

export default function TimelineScroll() {
    const { scrollYProgress } = useScroll()
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    })

    // Generate random branches deterministically for the tree effect
    const [branches] = useState(() => Array.from({ length: 20 }, (_, i) => {
        const seed = Math.sin((i + 1) * 9876.54) * 10000
        return (seed - Math.floor(seed)) * 0.9 + 0.05 // keep away from boundaries
    }))

    return (
        <>
            {/* The Scroll Container on the Right */}
            <div
                className="fixed right-0 top-0 bottom-0 w-16 z-50 flex items-center justify-center pointer-events-none"
            >
                {/* Interactive Area (Invisible but clickable) */}
                <div
                    className="absolute right-0 top-0 bottom-0 w-8 cursor-pointer pointer-events-auto"
                    onClick={(e) => {
                        // Click to scroll
                        const y = e.clientY / window.innerHeight
                        window.scrollTo({ top: y * document.body.scrollHeight, behavior: 'smooth' })
                    }}
                />

                {/* The "Tree" Line */}
                <div className="relative h-screen w-full">
                    {/* Background Line (Dim) */}
                    <div className="absolute right-6 top-8 bottom-8 w-0.5 bg-cyan-900/30 rounded-full" />

                    {/* Progress Line (Glowing) */}
                    <motion.div
                        className="absolute right-6 top-8 bottom-8 w-0.5 bg-cyan-400 origin-top shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                        style={{ scaleY }}
                    />

                    {/* The Knob / Slider Head */}
                    <motion.div
                        className="absolute right-[22px] top-8 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_15px_rgba(34,211,238,1)] z-10"
                        style={{
                            top: useTransform(scrollYProgress, val => `calc(${val * 100}% - ${val * 64}px + 32px)`)
                        }}
                    >
                        {/* Pulse Effect */}
                        <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75" />
                    </motion.div>

                    {/* Branches (The "Pine Tree" Effect) */}
                    {branches.map((pos, i) => (
                        <Branch
                            key={i}
                            position={pos}
                            progress={scrollYProgress}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}

function Branch({ position, progress }: { position: number, progress: MotionValue<number> }) {
    // Determine if this branch is "active" (passed by scroll)
    const isActive = useTransform(progress, (p: number) => p >= position)

    // Branch length and direction variation using a deterministic pseudo-random hash from position
    const seed = Math.sin(position * 12345.67) * 10000
    const randomVal = seed - Math.floor(seed)

    const width = 10 + randomVal * 20
    const angle = randomVal > 0.5 ? 45 : -45

    return (
        <motion.div
            className="absolute right-[24px] h-[1px] origin-right transition-colors duration-300"
            style={{
                top: `${position * 90 + 5}%`, // Distribute within safe area
                width: `${width}px`,
                backgroundColor: isActive ? '#22d3ee' : '#164e63', // Cyan-400 vs Cyan-900
                transform: `rotate(${angle}deg)`,
                opacity: isActive ? 1 : 0.3,
                boxShadow: isActive ? '0 0 8px rgba(34,211,238,0.6)' : 'none'
            }}
        />
    )
}
