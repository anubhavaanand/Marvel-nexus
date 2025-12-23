'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Atom, Bug, Shield, Zap, Swords, Skull, CircleDot } from 'lucide-react'

interface HomeClientProps {
    children: React.ReactNode
    initialTab?: string
}

// Franchise background themes
const franchiseThemes: Record<string, {
    gradient: string
    color: string
    bgGlow: string
}> = {
    mcu: {
        gradient: 'from-cyan-900/30 via-blue-950/20 to-transparent',
        color: 'cyan',
        bgGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.15), transparent)',
    },
    xmen: {
        gradient: 'from-yellow-900/30 via-amber-950/20 to-transparent',
        color: 'yellow',
        bgGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(234, 179, 8, 0.15), transparent)',
    },
    spider: {
        gradient: 'from-red-900/30 via-rose-950/20 to-transparent',
        color: 'red',
        bgGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(239, 68, 68, 0.15), transparent)',
    },
    dc: {
        gradient: 'from-blue-900/30 via-indigo-950/20 to-transparent',
        color: 'blue',
        bgGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent)',
    },
    anime: {
        gradient: 'from-orange-900/30 via-amber-950/20 to-transparent',
        color: 'orange',
        bgGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(249, 115, 22, 0.15), transparent)',
    },
    theboys: {
        gradient: 'from-red-950/40 via-red-900/20 to-transparent',
        color: 'red',
        bgGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(220, 38, 38, 0.2), transparent)',
    },
    invincible: {
        gradient: 'from-yellow-900/30 via-orange-950/20 to-transparent',
        color: 'yellow',
        bgGlow: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(250, 204, 21, 0.15), transparent)',
    },
}

export default function HomeClient({ children }: HomeClientProps) {
    const [activeTab, setActiveTab] = useState('mcu')
    const theme = franchiseThemes[activeTab] || franchiseThemes.mcu

    return (
        <div className="relative min-h-screen">
            {/* Animated Background Layer */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    className="fixed inset-0 pointer-events-none z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Main glow effect */}
                    <div
                        className="absolute inset-0"
                        style={{ background: theme.bgGlow }}
                    />

                    {/* Animated gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${theme.gradient}`} />

                    {/* Floating orbs */}
                    <motion.div
                        className={`absolute w-[500px] h-[500px] rounded-full bg-${theme.color}-500/10 blur-[100px]`}
                        animate={{
                            x: ['-20%', '10%', '-20%'],
                            y: ['-10%', '10%', '-10%'],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{ top: '-10%', left: '0%' }}
                    />
                    <motion.div
                        className={`absolute w-[400px] h-[400px] rounded-full bg-${theme.color}-500/10 blur-[100px]`}
                        animate={{
                            x: ['20%', '-10%', '20%'],
                            y: ['10%', '-20%', '10%'],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        style={{ bottom: '10%', right: '0%' }}
                    />

                    {/* Scan lines */}
                    <div
                        className="absolute inset-0 opacity-[0.015]"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.05) 2px, rgba(255,255,255,0.05) 4px)',
                        }}
                    />

                    {/* Grid pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
                            backgroundSize: '60px 60px',
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Tab Change Handler - Hidden element to capture tab changes */}
            <div className="relative z-10">
                <TabChangeListener onTabChange={setActiveTab} />
                {children}
            </div>
        </div>
    )
}

// Component to listen for tab changes
function TabChangeListener({ onTabChange }: { onTabChange: (tab: string) => void }) {
    useEffect(() => {
        // Listen for tab changes via mutation observer
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-state') {
                    const target = mutation.target as HTMLElement
                    if (target.getAttribute('data-state') === 'active') {
                        const tabValue = target.getAttribute('data-value') || target.getAttribute('value')
                        if (tabValue) {
                            onTabChange(tabValue)
                        }
                    }
                }
            })
        })

        // Observe the tabs container
        const tabsList = document.querySelector('[role="tablist"]')
        if (tabsList) {
            observer.observe(tabsList, {
                attributes: true,
                subtree: true,
                attributeFilter: ['data-state'],
            })
        }

        return () => observer.disconnect()
    }, [onTabChange])

    return null
}

// Enhanced animated badge
export function AnimatedBadge({
    children,
    color = 'cyan'
}: {
    children: React.ReactNode
    color?: string
}) {
    const colorClasses: Record<string, string> = {
        cyan: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400',
        yellow: 'bg-yellow-950/80 border-yellow-500/50 text-yellow-400',
        red: 'bg-red-950/80 border-red-500/50 text-red-400',
        blue: 'bg-blue-950/80 border-blue-500/50 text-blue-400',
        orange: 'bg-orange-950/80 border-orange-500/50 text-orange-400',
        purple: 'bg-purple-950/80 border-purple-500/50 text-purple-400',
    }

    return (
        <motion.span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-orbitron border ${colorClasses[color]}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
        >
            {children}
        </motion.span>
    )
}
