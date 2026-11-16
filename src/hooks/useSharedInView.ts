'use client'

import { useEffect, useRef, useState } from 'react'

type OnChange = (entry: IntersectionObserverEntry) => void

const callbacks = new Map<Element, OnChange>()
let sharedObserver: IntersectionObserver | null = null

function getSharedObserver(rootMargin: string): IntersectionObserver | null {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return null
  }
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cb = callbacks.get(entry.target as Element)
          if (cb) cb(entry)
        })
      },
      { rootMargin, threshold: 0 },
    )
  }
  return sharedObserver
}

/**
 * useSharedInView
 *
 * Registers many refs against a single IntersectionObserver instead of one
 * observer per card. Returns `true` once the element has intersected (one-shot,
 * mirroring framer-motion's `useInView(ref, { once: true })`). The observer
 * instance lives for the page's lifetime; cards observe/unobserve on mount/
 * unmount so grids that add/remove cards (search, pagination) leak nothing.
 */
export function useSharedInView<T extends Element>(
  ref: React.RefObject<T | null>,
  { once = true, rootMargin = '-50px' }: { once?: boolean; rootMargin?: string } = {},
): boolean {
  const [isInView, setIsInView] = useState(false)
  const hasTriggered = useRef(false)
  const cbRef = useRef<OnChange>((entry) => {
    if (!entry.isIntersecting) return
    setIsInView(true)
    if (once) hasTriggered.current = true
  })

  useEffect(() => {
    const el = ref.current
    if (!el || hasTriggered.current) return
    const observer = getSharedObserver(rootMargin)
    if (!observer) return
    callbacks.set(el, cbRef.current)
    observer.observe(el)
    return () => {
      callbacks.delete(el)
      if (!hasTriggered.current) observer.unobserve(el)
    }
  }, [ref, rootMargin])

  return isInView
}
