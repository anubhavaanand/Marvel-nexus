'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react'
import { loginAdminAction } from '@/app/actions/admin'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Avoid mobile layout shift: only autofocus on non-touch viewports
  // after the mount animation completes
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (!isTouch && passwordInputRef.current) {
      // Small delay to let the framer-motion animation settle
      const timer = setTimeout(() => {
        passwordInputRef.current?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoggingIn(true)
    try {
      const result = await loginAdminAction(password)
      if (result.ok) {
        setError('')
        router.refresh()
      } else {
        setError(result.error || 'Login failed. Please try again.')
        setPassword('')
      }
    } catch {
      // Unexpected server-action failure (e.g. misconfiguration): surface a
      // generic failure message without revealing the cause.
      setError('Login failed. Please try again.')
      setPassword('')
    } finally {
      setIsLoggingIn(false)
    }
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
              ref={passwordInputRef}
              id="admin-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:border-cyan-500 font-mono"
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
            disabled={isLoggingIn}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-orbitron"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Accessing...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Access Admin
              </>
            )}
          </Button>
        </form>
      </motion.div>
    </main>
  )
}
