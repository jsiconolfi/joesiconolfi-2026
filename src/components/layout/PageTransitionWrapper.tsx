'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

function isDeepPage(pathname: string): boolean {
  return pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline'
}

interface PageContentProps {
  pathname: string
  children: React.ReactNode
}

// Inner component keyed by pathname in AnimatePresence.
// deep is captured via useRef at first mount and never changes for this instance —
// even if AnimatePresence re-renders it with a new pathname prop during exit,
// the initial/exit directions and style values stay correct for this page tier.
function PageContent({ pathname, children }: PageContentProps) {
  const deepRef = useRef(isDeepPage(pathname))
  const deep = deepRef.current

  useEffect(() => {
    const container = document.querySelector('[data-scroll-container]')
    if (container) (container as HTMLElement).scrollTop = 0
  })

  return (
    <motion.div
      data-scroll-container
      initial={{ y: deep ? '-100vh' : '100vh', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: deep ? '100vh' : '-100vh', opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: deep ? 'auto' : 'hidden',
        backgroundColor: deep ? 'rgba(14, 16, 21, 0.97)' : 'transparent',
        zIndex: deep ? 20 : 10,
        pointerEvents: deep ? 'auto' : 'none',
      }}
    >
      {children}
    </motion.div>
  )
}

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageContent key={pathname} pathname={pathname}>
        {children}
      </PageContent>
    </AnimatePresence>
  )
}
