'use client'

import { useEffect, useState } from 'react'

/**
 * Returns true once the page has scrolled past `threshold` pixels.
 * Defaults to 80px — enough to confirm intentional scrolling.
 */
export function useScrolled(threshold = 80): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [threshold])

  return scrolled
}
