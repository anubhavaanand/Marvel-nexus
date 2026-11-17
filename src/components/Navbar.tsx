'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Home, Clock, Search, Play, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const navItems = [
  { icon: Home, label: 'Archive', href: '/' },
  { icon: Clock, label: 'Timeline', href: '/timeline' },
  { icon: Play, label: 'Watch', href: '/watch-order' },
  { icon: Search, label: 'Search', href: '/search' },
]

const SCROLL_THRESHOLD = 20

export default function Navbar() {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isScrolledRef = useRef(isScrolled)
  const rafRef = useRef<number | null>(null)
  const toggleRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const previouslyFocused = useRef<HTMLElement | null>(null)

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), [])

  // Lock body scroll while open
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isMobileMenuOpen])

  // Focus management: store trigger, focus first focusable, restore on close
  useEffect(() => {
    if (!isMobileMenuOpen) {
      if (previouslyFocused.current) {
        previouslyFocused.current.focus()
        previouslyFocused.current = null
      }
      return
    }
    previouslyFocused.current = (document.activeElement as HTMLElement) || null
    const container = menuRef.current
    if (!container) return
    const focusables = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusables[0]
    if (first) first.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeMenu()
        return
      }
      if (e.key !== 'Tab') return
      const items = Array.from(
        container.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      if (items.length === 0) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      const active = document.activeElement as HTMLElement
      if (e.shiftKey) {
        if (active === firstEl) {
          e.preventDefault()
          lastEl.focus()
        }
      } else {
        if (active === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMobileMenuOpen, closeMenu])

  useEffect(() => {
    const handleScroll = () => {
      // Coalesce scroll events: at most one state update per animation frame.
      if (rafRef.current !== null) return
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null
        const next = window.scrollY > SCROLL_THRESHOLD
        // Only trigger a re-render when the scrolled state actually flips.
        if (next !== isScrolledRef.current) {
          isScrolledRef.current = next
          setIsScrolled(next)
        }
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    // Compute on mount (and after back/forward-cache restores) so a page
    // loaded mid-scroll starts in the scrolled state instead of flashing the
    // transparent navbar until the next scroll event (#452).
    handleScroll()
    const handlePageShow = () => handleScroll()
    window.addEventListener('pageshow', handlePageShow)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('pageshow', handlePageShow)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // #623: a nested route (/hero/x) should highlight its top-level section.
  const isItemActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {/* Apple-style translucent glass nav */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'glass-strong' : 'bg-transparent'
        }`}
        initial={reducedMotion ? false : { y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-[var(--container-wide)] mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo — Linear-style minimal wordmark */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-7 h-7 rounded-[10px] flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent), #60a5fa)' }}
              >
                <span className="text-white font-bold text-xs">M</span>
              </div>
              <span className="text-[var(--fg)] font-semibold text-base tracking-tight hidden sm:block">
                Multiverse
              </span>
            </Link>

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = isItemActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              ref={toggleRef}
              className="md:hidden min-h-11 min-w-11 p-2 rounded-lg hover:bg-[var(--surface)] transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[var(--fg)]" />
              ) : (
                <Menu className="w-5 h-5 text-[var(--fg)]" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.nav
              className="absolute top-16 left-4 right-4 glass-panel-strong rounded-2xl p-3"
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <h2 id="mobile-menu-title" className="sr-only">
                Mobile navigation
              </h2>
              <div className="flex flex-col gap-1">
                {navItems.map((item) => {
                  const isActive = isItemActive(item.href)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-[var(--accent)] text-[var(--accent-on)]'
                          : 'text-[var(--fg-2)] hover:bg-[var(--surface)] hover:text-[var(--fg)]'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom mobile nav */}
      <motion.nav
        className="fixed bottom-6 left-1/2 z-50 md:hidden glass-panel-strong rounded-full px-2 py-2"
        initial={{ y: 100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = isItemActive(item.href)
            return (
              <Link key={item.href} href={item.href} aria-label={item.label}>
                <motion.div
                  className={`relative flex items-center justify-center w-11 h-11 rounded-full transition-colors ${
                    isActive
                      ? 'bg-[var(--accent)] text-[var(--accent-on)]'
                      : 'text-[var(--fg-2)] hover:text-[var(--fg)]'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.nav>
    </>
  )
}
