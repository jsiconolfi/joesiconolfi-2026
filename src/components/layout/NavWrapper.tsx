'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Nav from './Nav'
import { TAB_BAR_HEIGHT } from './TabBar'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function NavWrapper() {
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const hasChrome = pathname.startsWith('/work') || pathname === '/about' || pathname === '/timeline' || pathname === '/lab'

  // Start at 0 always, then animate to target after mount.
  // Without this, pathname-derived top renders synchronously and the
  // CSS transition has no prior state to animate from.
  const [top, setTop] = useState(0)

  useEffect(() => {
    // 60ms delay lets the page enter animation begin first so
    // the nav shift feels coordinated rather than simultaneous.
    const timer = setTimeout(() => {
      setTop(hasChrome ? TAB_BAR_HEIGHT : 0)
    }, 60)
    return () => clearTimeout(timer)
  }, [hasChrome])

  return (
    <div
      style={{
        position: 'fixed',
        top,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        padding: isMobile ? '12px 16px' : '12px 24px',
        transition: 'top 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto', width: isMobile ? '100%' : 'auto' }}>
        <Nav />
      </div>
    </div>
  )
}
