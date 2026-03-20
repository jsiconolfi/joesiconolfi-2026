'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true when the user has requested reduced motion via OS preference.
 * Safe to use in SSR — defaults to false until the client hydrates.
 */
export function useReducedMotion(): boolean {
  // Lazy initializer reads the media query directly on the client,
  // falling back to false during SSR where window is unavailable.
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return reducedMotion
}
