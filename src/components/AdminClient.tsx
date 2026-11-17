'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Check,
  X,
  Loader2,
  Zap,
  Globe,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
} from 'lucide-react'
import type { Hero } from '@/lib/supabase'
import HeroManager from '@/components/admin/HeroManager'
import {
  loginAdminAction,
  logoutAdminAction,
  checkAdminAuthAction,
  testDatabaseConnectionAction,
} from '@/app/actions/admin'
import {
  createCanonEventsAction,
  getAdminStatsAction,
  getLastSeededStatusAction,
  seedDemoHeroesAction,
  syncMoviesAction,
  type AdminStats,
} from '@/app/actions/seed'

interface SeedStatus {
  heroes: 'idle' | 'loading' | 'success' | 'error'
  movies: 'idle' | 'loading' | 'success' | 'error'
  events: 'idle' | 'loading' | 'success' | 'error'
}

interface AdminClientProps {
  initialHeroes: Hero[]
  initialStats?: AdminStats | null
  heroesError?: string | null
  statsError?: string | null
}

export default function AdminPage({
  initialHeroes,
  initialStats = null,
  heroesError = null,
  statsError = null,
}: AdminClientProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [seedStatus, setSeedStatus] = useState<SeedStatus>({
    heroes: 'idle',
    movies: 'idle',
    events: 'idle',
  })
  const [lastSeeded, setLastSeeded] = useState<
    Record<'heroes' | 'movies' | 'events', string | null>
  >({
    heroes: null,
    movies: null,
    events: null,
  })
  const [seedConfirm, setSeedConfirm] = useState<'heroes' | 'movies' | 'events' | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>(
    'unknown',
  )
  const [connectionTesting, setConnectionTesting] = useState(false)
  const [connectionLatency, setConnectionLatency] = useState<number | null>(null)
  const [connectionError, setConnectionError] = useState('')
  const [stats, setStats] = useState<AdminStats | null>(initialStats)
  const router = useRouter()
  // True until the server session check finishes, so authenticated admins
  // never see the login form flash (#450).
  const [authChecking, setAuthChecking] = useState(true)

  // Check if already authenticated (server session check)
  useEffect(() => {
    const checkAuth = async () => {
      let isAuth = false
      try {
        isAuth = await checkAdminAuthAction()
      } catch {
        isAuth = false
      } finally {
        setIsAuthenticated(isAuth)
        setAuthChecking(false)
      }
    }
    requestAnimationFrame(() => {
      checkAuth()
    })
  }, [])

  // Load last-seeded timestamps on mount so operators see history from
  // previous sessions too, not just seeds run in this tab (#372).
  useEffect(() => {
    const loadLastSeeded = async () => {
      try {
        const result = await getLastSeededStatusAction()
        if (result.ok) setLastSeeded(result.lastSeeded)
      } catch {
        // Non-fatal: the admin panel works without seed history.
      }
    }
    loadLastSeeded()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    let success = false
    try {
      const result = await loginAdminAction(password)
      success = result.ok
    } catch {
      // Unexpected server-action failure (e.g. misconfiguration): surface a
      // generic failure message without revealing the cause.
      success = false
    }
    if (success) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Login failed. Please try again.')
      setPassword('')
    }
  }

  const handleLogout = async () => {
    await logoutAdminAction()
    setIsAuthenticated(false)
  }

  // If not authenticated, show login screen (with a checking state that avoids
  // flashing the form for already-authenticated admins, #450).
  if (!isAuthenticated) {
    if (authChecking) {
      return (
        <main className="min-h-screen flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3 text-neutral-400" role="status">
            <div className="w-6 h-6 border-2 border-cyan-500/40 border-t-cyan-400 rounded-full animate-spin" />
            <span className="text-sm">Checking access…</span>
          </div>
        </main>
      )
    }
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
              <label htmlFor="admin-password" className="text-xs text-neutral-400">
                Password
              </label>
              <input
                id="admin-password"
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

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
    setConnectionTesting(true)
    setConnectionStatus('unknown')
    setConnectionError('')
    setConnectionLatency(null)
    try {
      const result = await testDatabaseConnectionAction()
      if (result.ok) {
        setConnectionStatus('connected')
        setConnectionLatency(result.latencyMs ?? null)
      } else {
        setConnectionStatus('error')
        setConnectionError(result.error || 'Connection failed')
      }
    } catch {
      setConnectionStatus('error')
      setConnectionError('Connection failed')
    } finally {
      setConnectionTesting(false)
    }
  }

  const refreshStats = async () => {
    try {
      const result = await getAdminStatsAction()
      if (result.ok) setStats(result.stats)
    } catch {
      // Keep the last known stats if the refresh fails.
    }
  }

  const runSeedAction = async (
    key: 'heroes' | 'movies' | 'events',
    action: () => Promise<{ ok: boolean; error?: string; lastSeeded?: string }>,
  ) => {
    // If not yet confirmed, request confirmation and return
    if (seedConfirm !== key) {
      setSeedConfirm(key)
      return
    }

    // Confirmed - run the action
    setSeedStatus((prev) => ({ ...prev, [key]: 'loading' }))
    setSeedConfirm(null)
    try {
      const result = await action()
      if (!result.ok) {
        setSeedStatus((prev) => ({ ...prev, [key]: 'error' }))
        return
      }
      setSeedStatus((prev) => ({ ...prev, [key]: 'success' }))
      if (result.lastSeeded) {
        setLastSeeded((prev) => ({ ...prev, [key]: result.lastSeeded }))
      }
      await refreshStats()
    } catch {
      setSeedStatus((prev) => ({ ...prev, [key]: 'error' }))
    }
  }

  const seedHeroes = () => runSeedAction('heroes', seedDemoHeroesAction)
  const seedMovies = () => runSeedAction('movies', syncMoviesAction)
  const seedEvents = () => runSeedAction('events', createCanonEventsAction)

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

      {/* Load-error banners: surface DB/auth failures instead of swallowing them. */}

      {(heroesError || statsError) && (
        <div className="max-w-4xl mx-auto mb-8 space-y-3">
          {heroesError && <ErrorBanner message={heroesError} onRetry={() => router.refresh()} />}
          {statsError && <ErrorBanner message={statsError} onRetry={() => router.refresh()} />}
        </div>
      )}

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
            <Badge
              className={`font-mono ${
                connectionStatus === 'connected'
                  ? 'bg-green-950/50 border-green-500/50 text-green-400'
                  : connectionStatus === 'error'
                    ? 'bg-red-950/50 border-red-500/50 text-red-400'
                    : 'bg-neutral-800/50 border-neutral-600/50 text-neutral-400'
              }`}
            >
              {connectionStatus === 'connected'
                ? `CONNECTED${connectionLatency != null ? ` • ${connectionLatency}ms` : ''}`
                : connectionStatus === 'error'
                  ? connectionError || 'NOT CONFIGURED'
                  : 'UNKNOWN'}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 p-4 bg-neutral-800/30 rounded-lg">
              <p className="text-sm text-neutral-400 mb-2">URL</p>
              <code className="text-xs text-cyan-400 font-mono break-all">
                {process.env.NEXT_PUBLIC_SUPABASE_URL
                  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
                  : 'Not configured'}
              </code>
            </div>
            <Button
              onClick={checkConnection}
              disabled={connectionTesting}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-orbitron"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${connectionTesting ? 'animate-spin' : ''}`} />
              {connectionTesting ? 'Testing...' : 'Test Connection'}
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
                <p className="text-xs text-neutral-400">
                  {stats ? `${stats.heroes} heroes in database` : 'Heroes from every franchise'}
                </p>
              </div>
              {getStatusIcon(seedStatus.heroes)}
            </div>

            <p className="text-sm text-neutral-400 mb-4">
              Seed hero data from all franchises - Marvel, DC, Anime, and more.
            </p>

            <Button
              onClick={seedHeroes}
              disabled={seedStatus.heroes === 'loading'}
              className={`w-full font-orbitron disabled:opacity-50 ${
                seedStatus.heroes === 'loading'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : seedConfirm === 'heroes'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white'
              }`}
            >
              {seedStatus.heroes === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Seeding...
                </>
              ) : seedConfirm === 'heroes' ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Confirm Seed Heroes?
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Seed Heroes
                </>
              )}
            </Button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Last seeded:{' '}
              {lastSeeded.heroes ? new Date(lastSeeded.heroes).toLocaleString() : 'never'}
            </p>
          </motion.div>
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
              className={`w-full font-orbitron disabled:opacity-50 ${
                seedStatus.movies === 'loading'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : seedConfirm === 'movies'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {seedStatus.movies === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Syncing...
                </>
              ) : seedConfirm === 'movies' ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Confirm Sync Movies?
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Sync Movies
                </>
              )}
            </Button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Last seeded:{' '}
              {lastSeeded.movies ? new Date(lastSeeded.movies).toLocaleString() : 'never'}
            </p>
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
              className={`w-full font-orbitron disabled:opacity-50 ${
                seedStatus.events === 'loading'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : seedConfirm === 'events'
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {seedStatus.events === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : seedConfirm === 'events' ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Confirm Create Events?
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Events
                </>
              )}
            </Button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Last seeded:{' '}
              {lastSeeded.events ? new Date(lastSeeded.events).toLocaleString() : 'never'}
            </p>
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

          <HeroManager initialHeroes={initialHeroes} />
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
              <Stat label="Heroes" value={stats ? String(stats.heroes) : '—'} color="cyan" />
              <Stat label="Movies" value={stats ? String(stats.movies) : '—'} color="purple" />
              <Stat
                label="Canon Events"
                value={stats ? String(stats.canonEvents) : '—'}
                color="red"
              />
              <Stat
                label="Franchises"
                value={stats ? String(stats.franchises) : '—'}
                color="yellow"
              />
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
              <Button
                variant="ghost"
                className="w-full justify-start text-neutral-300 hover:text-cyan-400 hover:bg-cyan-950/30"
                asChild
              >
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <Globe className="w-4 h-4 mr-3" />
                  View Live Site
                </a>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-neutral-300 hover:text-purple-400 hover:bg-purple-950/30"
                asChild
              >
                <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                  <Database className="w-4 h-4 mr-3" />
                  Open Supabase Dashboard
                </a>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-neutral-300 hover:text-green-400 hover:bg-green-950/30"
                asChild
              >
                <a
                  href="https://github.com/anubhavaanand/Marvel-nexus"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="w-4 h-4 mr-3 rounded-full border border-current flex items-center justify-center text-[10px] font-bold">
                    GH
                  </div>
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

/**
 * Generic error banner for admin load failures. Details are logged server-side;
 * the UI shows only a generic message so nothing sensitive leaks.
 */
function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 p-4 rounded-lg border border-red-500/50 bg-red-950/30 text-red-200">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 text-red-400" />
        <div>
          <p className="font-medium text-red-100">{message}</p>
          <p className="text-xs text-red-300/70">
            Check the server logs for details. Retrying will re-fetch the panel data.
          </p>
        </div>
      </div>
      <Button
        onClick={onRetry}
        variant="outline"
        className="border-red-500/50 text-red-300 hover:bg-red-950/50 shrink-0"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Retry
      </Button>
    </div>
  )
}
