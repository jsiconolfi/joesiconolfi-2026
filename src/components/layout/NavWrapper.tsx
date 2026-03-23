'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import { TAB_BAR_HEIGHT } from './TabBar'

// Height of the WorkGrid terminal chrome header — matches TabBar height
const WORK_CHROME_HEIGHT = TAB_BAR_HEIGHT  // both are 38px

export default function NavWrapper() {
  const pathname = usePathname()

  // Shift nav down when any page has its own terminal chrome header
  // /work (index) has the sticky WorkGrid chrome; /work/[slug] has the tab bar
  const hasChrome = pathname.startsWith('/work')

  return (
    <div
      style={{
        position: 'fixed',
        top: hasChrome ? WORK_CHROME_HEIGHT : 0,
        left: 0,
        right: 0,
        zIndex: 40,
        display: 'flex',
        justifyContent: 'center',
        padding: '12px 24px',
        transition: 'top 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ pointerEvents: 'auto' }}>
        <Nav />
      </div>
    </div>
  )
}
