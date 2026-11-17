'use client'

import { useEffect, useState } from 'react'

// Single shared listener across all subscribers.
const subscribers = new Set<(visible: boolean) => void>()
let listenerInstalled = false

function handleVisibilityChange() {
  const visible = !document.hidden
  subscribers.forEach((cb) => cb(visible))
}

function ensureListener() {
  if (listenerInstalled) return
  if (typeof document === 'undefined') return
  listenerInstalled = true
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

/**
 * useDocumentVisible
 *
 * Returns whether the document is currently visible. Uses a single shared
 * `visibilitychange` listener for all subscribers instead of one per
 * component instance.
 */
export function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(() => {
    if (typeof document === 'undefined') return true
    return !document.hidden
  })

  useEffect(() => {
    ensureListener()
    const cb = (v: boolean) => setVisible(v)
    subscribers.add(cb)
    return () => {
      subscribers.delete(cb)
    }
  }, [])

  return visible
}
