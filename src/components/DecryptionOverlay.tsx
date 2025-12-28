'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Cpu, Activity } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DecryptionOverlayProps {
    isLoading: boolean
    title?: string
}

export default function DecryptionOverlay({
    isLoading,
    title = "NEURAL_LINK"
}: DecryptionOverlayProps) {
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState("INITIALIZING")

    useEffect(() => {
        if (!isLoading) {
            setProgress(0)
            setStatus("INITIALIZING")
            return
        }

        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) return 100
                return prev + Math.random() * 15
            })
        }, 100)

        return () => clearInterval(interval)
    }, [isLoading])

    useEffect(() => {
        if (progress < 30) setStatus("ESTABLISHING_CONNECTION")
        else if (progress < 60) setStatus("DECRYPTING_DATA")
        else if (progress < 90) setStatus("VERIFYING_INTEGRITY")
        else setStatus("COMPLETE")
    }, [progress])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        initial={{ backdropFilter: 'blur(0px)' }}
                        animate={{ backdropFilter: 'blur(12px)' }}
                    />

                    {/* Main Content */}
                    <div className="relative z-10 max-w-md w-full mx-4">
                        <motion.div
                            className="glass-panel-enhanced rounded-2xl p-8 space-y-6 scanlines-enhanced tactical-scan"
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 25
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <Cpu className="w-6 h-6 text-cyan-400" />
                                    </motion.div>
                                    <h3 className="text-lg font-orbitron text-cyan-400 system-flicker">
                                        BOOTING_{title}
                                    </h3>
                                </div>
                                <Activity className="w-5 h-5 text-green-400 status-indicator" />
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-roboto-mono text-neutral-400 terminal-text">
                                        STATUS://
                                    </span>
                                    <span className="text-sm font-roboto-mono text-cyan-400">
                                        {status}
                                    </span>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-neutral-800/50 rounded-full overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    {/* Glow effect */}
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-cyan-400 rounded-full blur-md opacity-50"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>

                                {/* Percentage */}
                                <div className="flex justify-end">
                                    <motion.span
                                        className="text-xs font-roboto-mono text-cyan-400"
                                        key={Math.floor(progress)}
                                    >
                                        {Math.floor(progress)}%
                                    </motion.span>
                                </div>
                            </div>

                            {/* System Messages */}
                            <div className="space-y-1">
                                <SystemMessage delay={0.1}>{">"} Establishing quantum tunnel...</SystemMessage>
                                <SystemMessage delay={0.3}>{">"} Bypassing security protocols...</SystemMessage>
                                <SystemMessage delay={0.5}>{">"} Loading hero data matrix...</SystemMessage>
                                <SystemMessage delay={0.7}>{">"} Decrypting multiverse records...</SystemMessage>
                            </div>

                            {/* Shield Icon */}
                            <div className="flex justify-center pt-4">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.2, 1],
                                        rotate: [0, 180, 360]
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <Shield className="w-12 h-12 text-cyan-400/30" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function SystemMessage({ children, delay }: { children: React.ReactNode, delay: number }) {
    return (
        <motion.p
            className="text-xs font-roboto-mono text-green-400/80 system-boot"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
        >
            {children}
        </motion.p>
    )
}
