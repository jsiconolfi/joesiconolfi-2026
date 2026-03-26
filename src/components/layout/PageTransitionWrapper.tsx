'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

function isDeepPage(pathname: string): boolean {
  return pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline' || pathname === '/lab'
}

interface PageContentProps {
  pathname: string
  children: React.ReactNode
}

// Inner component keyed by pathname in AnimatePresence.
// `deep` is fixed at mount via lazy useState — parent pathname can update during exit;
// tier (homepage vs deep page) must not flip mid-transition.
function PageContent({ pathname, children }: PageContentProps) {
  const [deep] = useState(() => isDeepPage(pathname))

  useEffect(() => {
    const container = document.querySelector('[data-scroll-container]')
    if (container) (container as HTMLElement).scrollTop = 0
  }, [pathname])

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
