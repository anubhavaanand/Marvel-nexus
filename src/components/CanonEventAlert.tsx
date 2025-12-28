'use client'

import { AlertTriangle, Zap, Clock, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

interface CanonEventAlertProps {
    description: string
    isFixedPoint: boolean
    glitchLevel: number
    movieTitle?: string
    index?: number
}

export default function CanonEventAlert({
    description,
    isFixedPoint,
    glitchLevel,
    movieTitle,
    index = 0
}: CanonEventAlertProps) {
    // Calculate danger color based on glitch level
    const getDangerColor = (level: number) => {
        if (level <= 3) return 'border-yellow-500/50 bg-yellow-950/20'
        if (level <= 6) return 'border-orange-500/50 bg-orange-950/20'
        return 'border-red-500/50 bg-red-950/20'
    }

    const getGlitchIcon = (level: number) => {
        if (level <= 3) return <Clock className="w-5 h-5 text-yellow-400" />
        if (level <= 6) return <Zap className="w-5 h-5 text-orange-400" />
        return <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
    }

    return (
        <motion.div
            className={`glass-panel ${getDangerColor(glitchLevel)} ${glitchLevel > 6 ? 'hazard-alert' : ''} ${isFixedPoint ? 'tactical-scan' : ''} p-4 rounded-xl relative overflow-hidden`}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
                type: "spring",
                stiffness: 250,
                damping: 25,
                delay: index * 0.1
            }}
            whileHover={{
                scale: 1.02,
                x: 5,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                }
            }}
        >
            {/* Scanline overlay for high glitch levels */}
            {glitchLevel > 6 && (
                <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />
            )}

            {/* Glitch line decoration */}
            <motion.div
                className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 via-cyan-500 to-red-500"
                animate={{
                    backgroundPosition: ['0% 0%', '0% 100%']
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                }}
            />

            <div className="flex items-start gap-3 pl-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                    {getGlitchIcon(glitchLevel)}
                </div>

                <div className="flex-1 space-y-2">
                    {/* Fixed Point Warning */}
                    {isFixedPoint && (
                        <motion.div
                            className="glitch-enhanced text-xs flex items-center gap-2 font-roboto-mono"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            <Shield className="w-3 h-3" />
                            ⚠️ FIXED_CANON_EVENT - DO_NOT_ALTER
                        </motion.div>
                    )}

                    {/* Movie Reference */}
                    {movieTitle && (
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span className="font-mono tracking-wide">{movieTitle}</span>
                        </div>
                    )}

                    {/* Description */}
                    <p className="text-sm text-neutral-300 leading-relaxed font-inter">
                        {description}
                    </p>

                    {/* Glitch Level Meter */}
                    <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">
                            Glitch Level
                        </span>
                        <div className="flex gap-0.5">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    className={`w-2 h-1 rounded-full ${i < glitchLevel
                                        ? glitchLevel > 6
                                            ? 'bg-red-500'
                                            : glitchLevel > 3
                                                ? 'bg-orange-500'
                                                : 'bg-yellow-500'
                                        : 'bg-neutral-700'
                                        }`}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.5 + i * 0.05 }}
                                />
                            ))}
                        </div>
                        <span className={`text-xs font-mono ${glitchLevel > 6 ? 'text-red-400' :
                            glitchLevel > 3 ? 'text-orange-400' : 'text-yellow-400'
                            }`}>
                            {glitchLevel}/10
                        </span>
                    </div>
                </div>
            </div>

            {/* Corner warning indicator for critical events */}
            {isFixedPoint && (
                <motion.div
                    className="absolute top-2 right-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </motion.div>
            )}
        </motion.div>
    )
}
