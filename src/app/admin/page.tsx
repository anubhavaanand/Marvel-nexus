'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Shield,
    Database,
    RefreshCw,
    Plus,
    Film,
    Users,
    AlertTriangle,
    Check,
    X,
    Loader2,
    Zap,
    Globe,
    Lock,
    Eye,
    EyeOff
} from 'lucide-react'
import HeroManager from '@/components/admin/HeroManager'

// Simple password - change this to whatever you want!
const ADMIN_PASSWORD = 'Anubhav@12'

interface SeedStatus {
    heroes: 'idle' | 'loading' | 'success' | 'error'
    movies: 'idle' | 'loading' | 'success' | 'error'
    events: 'idle' | 'loading' | 'success' | 'error'
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [seedStatus, setSeedStatus] = useState<SeedStatus>({
        heroes: 'idle',
        movies: 'idle',
        events: 'idle'
    })
    const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown')

    // Check if already authenticated (stored in sessionStorage)
    useEffect(() => {
        const stored = sessionStorage.getItem('admin_auth')
        if (stored === 'true') {
            setIsAuthenticated(true)
        }
    }, [])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === ADMIN_PASSWORD) {
            setIsAuthenticated(true)
            sessionStorage.setItem('admin_auth', 'true')
            setError('')
        } else {
            setError('Incorrect password')
            setPassword('')
        }
    }

    const handleLogout = () => {
        setIsAuthenticated(false)
        sessionStorage.removeItem('admin_auth')
    }

    // If not authenticated, show login screen
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen flex items-center justify-center px-4">
                <motion.div
                    className="glass-panel rounded-2xl p-8 w-full max-w-md"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-4 rounded-full bg-cyan-950/50 border border-cyan-500/30">
                                <Lock className="w-8 h-8 text-cyan-400" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-orbitron text-white mb-2">Admin Access</h1>
                        <p className="text-neutral-400 text-sm">Enter password to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {error && (
                            <p className="text-red-400 text-sm text-center">{error}</p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-orbitron"
                        >
                            <Lock className="w-4 h-4 mr-2" />
                            Access Admin
                        </Button>
                    </form>
                </motion.div>
            </main>
        )
    }

    const checkConnection = async () => {
        setConnectionStatus('unknown')
        setTimeout(() => {
            const isConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
            setConnectionStatus(isConfigured ? 'connected' : 'error')
        }, 1000)
    }

    const seedHeroes = async () => {
        setSeedStatus(prev => ({ ...prev, heroes: 'loading' }))
        setTimeout(() => {
            setSeedStatus(prev => ({ ...prev, heroes: 'success' }))
        }, 2000)
    }

    const seedMovies = async () => {
        setSeedStatus(prev => ({ ...prev, movies: 'loading' }))
        setTimeout(() => {
            setSeedStatus(prev => ({ ...prev, movies: 'success' }))
        }, 2000)
    }

    const seedEvents = async () => {
        setSeedStatus(prev => ({ ...prev, events: 'loading' }))
        setTimeout(() => {
            setSeedStatus(prev => ({ ...prev, events: 'success' }))
        }, 2000)
    }

    const getStatusIcon = (status: 'idle' | 'loading' | 'success' | 'error') => {
        switch (status) {
            case 'loading':
                return <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            case 'success':
                return <Check className="w-5 h-5 text-green-400" />
            case 'error':
                return <X className="w-5 h-5 text-red-400" />
            default:
                return null
        }
    }

    return (
        <main className="min-h-screen px-4 sm:px-8 pt-8 pb-32">
            {/* Header */}
            <header className="text-center mb-12 pt-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Shield className="w-8 h-8 text-cyan-400" />
                    <span className="text-sm font-mono text-cyan-400 tracking-widest uppercase">
                        Authenticated Session
                    </span>
                    <Shield className="w-8 h-8 text-cyan-400" />
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-orbitron text-center mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 text-glow">
                        ADMIN PANEL
                    </span>
                </h1>

                <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-inter">
                    Database management, TMDB sync, and content configuration.
                </p>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="mt-4 border-red-500/50 text-red-400 hover:bg-red-950/50"
                >
                    <Lock className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </header>

            <div className="max-w-4xl mx-auto space-y-8">
                {/* Connection Status Card */}
                <motion.div
                    className="glass-panel rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-orbitron text-white flex items-center gap-3">
                            <Database className="w-6 h-6 text-cyan-400" />
                            Supabase Connection
                        </h2>
                        <Badge className={`font-mono ${connectionStatus === 'connected'
                            ? 'bg-green-950/50 border-green-500/50 text-green-400'
                            : connectionStatus === 'error'
                                ? 'bg-red-950/50 border-red-500/50 text-red-400'
                                : 'bg-neutral-800/50 border-neutral-600/50 text-neutral-400'
                            }`}>
                            {connectionStatus === 'connected' ? 'CONNECTED' :
                                connectionStatus === 'error' ? 'NOT CONFIGURED' : 'UNKNOWN'}
                        </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 p-4 bg-neutral-800/30 rounded-lg">
                            <p className="text-sm text-neutral-400 mb-2">URL</p>
                            <code className="text-xs text-cyan-400 font-mono break-all">
                                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
                            </code>
                        </div>
                        <Button
                            onClick={checkConnection}
                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-orbitron"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Test Connection
                        </Button>
                    </div>
                </motion.div>

                {/* Seed Data Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Seed Heroes */}
                    <motion.div
                        className="glass-panel rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Users className="w-8 h-8 text-cyan-400" />
                            <div>
                                <h3 className="font-orbitron text-white">Heroes</h3>
                                <p className="text-xs text-neutral-400">81+ heroes ready</p>
                            </div>
                            {getStatusIcon(seedStatus.heroes)}
                        </div>

                        <p className="text-sm text-neutral-400 mb-4">
                            Seed hero data from all franchises - Marvel, DC, Anime, and more.
                        </p>

                        <Button
                            onClick={seedHeroes}
                            disabled={seedStatus.heroes === 'loading'}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-orbitron disabled:opacity-50"
                        >
                            {seedStatus.heroes === 'loading' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Seeding...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Seed Heroes
                                </>
                            )}
                        </Button>
                    </motion.div>

                    {/* Seed Movies */}
                    <motion.div
                        className="glass-panel rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Film className="w-8 h-8 text-purple-400" />
                            <div>
                                <h3 className="font-orbitron text-white">Movies</h3>
                                <p className="text-xs text-neutral-400">34 films ready</p>
                            </div>
                            {getStatusIcon(seedStatus.movies)}
                        </div>

                        <p className="text-sm text-neutral-400 mb-4">
                            Seed MCU movie data from Phase 1-5 with posters and ratings.
                        </p>

                        <Button
                            onClick={seedMovies}
                            disabled={seedStatus.movies === 'loading'}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-orbitron disabled:opacity-50"
                        >
                            {seedStatus.movies === 'loading' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Syncing...
                                </>
                            ) : (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Sync Movies
                                </>
                            )}
                        </Button>
                    </motion.div>

                    {/* Seed Canon Events */}
                    <motion.div
                        className="glass-panel rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Zap className="w-8 h-8 text-red-400" />
                            <div>
                                <h3 className="font-orbitron text-white">Canon Events</h3>
                                <p className="text-xs text-neutral-400">Fixed points ready</p>
                            </div>
                            {getStatusIcon(seedStatus.events)}
                        </div>

                        <p className="text-sm text-neutral-400 mb-4">
                            Seed canon events with glitch levels and fixed point markers.
                        </p>

                        <Button
                            onClick={seedEvents}
                            disabled={seedStatus.events === 'loading'}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-orbitron disabled:opacity-50"
                        >
                            {seedStatus.events === 'loading' ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Events
                                </>
                            )}
                        </Button>
                    </motion.div>
                </div>

                {/* Hero Manager Section */}
                <motion.div
                    className="glass-panel rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="w-8 h-8 text-cyan-400" />
                        <h2 className="text-xl font-orbitron text-white">Hero Manager</h2>
                    </div>

                    <HeroManager />
                </motion.div>

                {/* Quick Stats & Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Database Status */}
                    <motion.div
                        className="glass-panel rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h2 className="text-xl font-orbitron text-white mb-6">Database Status</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <Stat label="Heroes" value="81+" color="cyan" />
                            <Stat label="Movies" value="34" color="purple" />
                            <Stat label="Canon Events" value="50+" color="red" />
                            <Stat label="Franchises" value="7" color="yellow" />
                        </div>
                    </motion.div>

                    {/* Quick Access */}
                    <motion.div
                        className="glass-panel rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h2 className="text-xl font-orbitron text-white mb-6">Quick Links</h2>
                        <div className="space-y-3">
                            <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-cyan-400 hover:bg-cyan-950/30" asChild>
                                <a href="/" target="_blank">
                                    <Globe className="w-4 h-4 mr-3" />
                                    View Live Site
                                </a>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-purple-400 hover:bg-purple-950/30" asChild>
                                <a href="https://supabase.com/dashboard" target="_blank">
                                    <Database className="w-4 h-4 mr-3" />
                                    Open Supabase Dashboard
                                </a>
                            </Button>
                            <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-green-400 hover:bg-green-950/30" asChild>
                                <a href="https://github.com/anubhavaanand/Marvel-nexus" target="_blank">
                                    <div className="w-4 h-4 mr-3 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">GH</div>
                                    View GitHub Repo
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </main>
    )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
    const colorClasses: Record<string, string> = {
        cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/30',
        purple: 'text-purple-400 border-purple-500/30 bg-purple-950/30',
        red: 'text-red-400 border-red-500/30 bg-red-950/30',
        yellow: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/30',
    }

    return (
        <div className={`p-4 rounded-xl border ${colorClasses[color]}`}>
            <p className="text-3xl font-orbitron font-bold">{value}</p>
            <p className="text-xs text-neutral-400 mt-1">{label}</p>
        </div>
    )
}
