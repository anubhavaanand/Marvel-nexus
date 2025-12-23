'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface LockedContentGuardProps {
    children: React.ReactNode
    isLocked: boolean
}

export default function LockedContentGuard({ children, isLocked }: LockedContentGuardProps) {
    const [isAdmin, setIsAdmin] = useState(false)
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        const adminAuth = sessionStorage.getItem('admin_auth') === 'true'
        setIsAdmin(adminAuth)
        setIsChecking(false)
    }, [])

    if (isChecking) {
        return <div className="min-h-screen bg-black" /> // Prevent flash of content
    }

    // specific condition: Content is locked AND user is NOT admin
    if (isLocked && !isAdmin) {
        return (
            <main className="min-h-screen bg-black flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/xT9IgusfDcqpPFzjdS/giphy.gif')] bg-cover bg-center opacity-10" />

                <motion.div
                    className="glass-panel max-w-md w-full p-8 rounded-2xl text-center relative z-10 border-cyan-500/30"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
                            <Lock className="w-16 h-16 text-cyan-400 relative z-10" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-orbitron font-bold text-white mb-4">
                        Restricted Access
                    </h1>

                    <p className="text-neutral-400 mb-8 font-inter">
                        This character file is classified Level 10. Only authorized personnel with Admin clearance can view full details.
                    </p>

                    <div className="space-y-4">
                        <Button className="w-full bg-cyan-900/50 hover:bg-cyan-800/50 text-cyan-400 border border-cyan-500/30" asChild>
                            <Link href="/admin">
                                <Shield className="w-4 h-4 mr-2" />
                                Authenticate as Admin
                            </Link>
                        </Button>

                        <Button variant="ghost" className="w-full text-neutral-500 hover:text-white" asChild>
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Return to Archive
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </main>
        )
    }

    return <>{children}</>
}
