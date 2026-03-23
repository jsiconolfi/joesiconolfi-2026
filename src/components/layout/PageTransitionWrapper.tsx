'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { TAB_BAR_HEIGHT } from './TabBar'

// Case study pages and the work index are "deeper" — they slide in from above, exit downward.
// Homepage is the base — it enters from below, exits upward.
function getTransitionDirection(pathname: string): 'up' | 'down' {
  return pathname.startsWith('/work') ? 'up' : 'down'
}

const TRANSITION = {
  duration: 0.45,
  ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
}

interface PageTransitionWrapperProps {
  children: React.ReactNode
}

export default function PageTransitionWrapper({ children }: PageTransitionWrapperProps) {
  const pathname = usePathname()
  const direction = getTransitionDirection(pathname)
  // /work/* = individual case study (has tab bar, top offset)
  // /work = index grid (dark bg + scroll, no tab bar offset)
  const isCaseStudy = pathname.startsWith('/work/')
  const isWorkIndex = pathname === '/work'
  const isContentPage = isCaseStudy || isWorkIndex

  // Reset scroll position on every navigation
  useEffect(() => {
    const container = document.querySelector<HTMLElement>('[data-scroll-container]')
    if (container) container.scrollTop = 0
  }, [pathname])

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        data-scroll-container
        initial={direction === 'up' ? { y: '-100vh', opacity: 0 } : { y: '100vh', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={direction === 'up' ? { y: '100vh', opacity: 0 } : { y: '-100vh', opacity: 0 }}
        transition={TRANSITION}
        style={{
          position: 'fixed',
          // Case studies have tab bar (38px offset); work index and homepage do not
          top: isCaseStudy ? TAB_BAR_HEIGHT : 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflowY: isContentPage ? 'auto' : 'hidden',
          // Content pages (case studies + work index): nearly opaque overlay
          // Homepage: transparent so swirl + orbital cards show fully
          backgroundColor: isContentPage ? 'rgba(14, 16, 21, 0.97)' : 'transparent',
          // Content pages sit above orbital cards (z-10); homepage is transparent so
          // pointer-events-none is safe — ChatPanel re-enables pointer-events-auto
          zIndex: isContentPage ? 20 : 10,
          pointerEvents: isContentPage ? 'auto' : 'none',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
