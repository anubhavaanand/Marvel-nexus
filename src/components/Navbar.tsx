'use client'

import { Home, Clock, Search, Shield, Sparkles, Play } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const navItems = [
    { icon: Home, label: 'Archive', href: '/' },
    { icon: Clock, label: 'Timeline', href: '/timeline' },
    { icon: Play, label: 'Watch', href: '/watch-order' },
    { icon: Search, label: 'Search', href: '/search' },
    // Admin hidden - access via /admin URL directly
]

export default function Navbar() {
    const pathname = usePathname()

    return (
        <motion.nav
            className="fixed bottom-4 left-1/2 z-50 glass-panel-enhanced rounded-full px-6 py-3 scanlines-enhanced"
            initial={{ y: 100, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            transition={{
                delay: 0.5,
                type: 'spring',
                stiffness: 250,
                damping: 25
            }}
        >
            {/* Background glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 blur-xl -z-10" />

            <div className="flex gap-6 items-center">
                {/* Logo with System Status */}
                <motion.div
                    className="hidden sm:flex items-center gap-2 pr-4 border-r border-white/10"
                    whileHover={{ scale: 1.05 }}
                >
                    <div className="relative">
                        <Sparkles className="w-5 h-5 text-cyan-400" />
                        {/* Status pulse indicator */}
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full status-indicator" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-orbitron text-cyan-400 tracking-wider">ARCHIVE</span>
                        <span className="text-[8px] font-roboto-mono text-green-400 tracking-wide">SYSTEM_STABLE</span>
                    </div>
                </motion.div>

                {/* Nav Items */}
                {navItems.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                className={`relative flex flex-col items-center gap-1 cursor-pointer px-2 py-1 rounded-lg transition-colors ${isActive ? 'text-cyan-400' : 'text-neutral-400 hover:text-cyan-300'
                                    }`}
                                whileHover={{
                                    scale: 1.15,
                                    transition: { type: "spring", stiffness: 300, damping: 20 }
                                }}
                                whileTap={{
                                    scale: 0.95,
                                    transition: { type: "spring", stiffness: 400, damping: 17 }
                                }}
                            >
                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-cyan-500/10 rounded-lg"
                                        layoutId="activeNav"
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    />
                                )}

                                {/* Icon with glow when active */}
                                <div className="relative z-10">
                                    <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]' : ''}`} />
                                </div>

                                {/* Label */}
                                <span className={`text-[10px] sm:text-xs font-inter relative z-10 ${isActive ? 'font-medium' : ''}`}>
                                    {item.label}
                                </span>

                                {/* Active dot indicator */}
                                {isActive && (
                                    <motion.div
                                        className="absolute -bottom-1 w-1 h-1 bg-cyan-400 rounded-full"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.1 }}
                                    />
                                )}
                            </motion.div>
                        </Link>
                    )
                })}
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            <div className="absolute -bottom-px left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        </motion.nav>
    )
}
