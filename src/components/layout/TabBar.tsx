'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useTabs } from '@/context/TabContext'
import { getCaseStudy } from '@/content/case-studies'

export const TAB_BAR_HEIGHT = 38

function pathnameIsWorkIndex(pathname: string): boolean {
  return pathname === '/work' || pathname === '/work/'
}

/** Fixed top bar title for /work index, /about, /timeline, /lab — matches case study TabBar chrome. */
function staticChromeExe(pathname: string): string | null {
  if (pathnameIsWorkIndex(pathname)) return 'case-studies.exe'
  if (pathname === '/about') return 'about.exe'
  if (pathname === '/timeline') return 'timeline.exe'
  if (pathname === '/lab') return 'lab.exe'
  return null
}

/** Active-tab traffic lights only; own state so hover resets when this row unmounts (Session 81). */
function TabActiveTrafficLights({
  onClose,
  closeButtonTitle = 'Close tab',
}: {
  onClose: () => void
  closeButtonTitle?: string
}) {
  const [hoveredRed, setHoveredRed] = useState(false)
  const [hoveredYellow, setHoveredYellow] = useState(false)
  const [hoveredGreen, setHoveredGreen] = useState(false)

  return (
    <div
      style={{ display: 'flex', gap: 4, flexShrink: 0 }}
      onClick={e => e.stopPropagation()}
    >
      <button
        type="button"
        title={closeButtonTitle}
        onClick={e => {
          e.stopPropagation()
          onClose()
        }}
        onMouseEnter={e => {
          e.stopPropagation()
          setHoveredRed(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setHoveredRed(false)
        }}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: '#ff5f57',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          touchAction: 'manipulation',
        }}
      >
        {hoveredRed && (
          <span
            style={{
              fontSize: 8,
              lineHeight: 1,
              color: 'rgba(0,0,0,0.65)',
              fontWeight: 500,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            ×
          </span>
        )}
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={e => e.stopPropagation()}
        onMouseEnter={e => {
          e.stopPropagation()
          setHoveredYellow(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setHoveredYellow(false)
        }}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: '#febc2e',
          border: 'none',
          padding: 0,
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {hoveredYellow && (
          <span
            style={{
              fontSize: 8,
              lineHeight: 1,
              color: 'rgba(0,0,0,0.5)',
              fontWeight: 500,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            −
          </span>
        )}
      </button>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={e => e.stopPropagation()}
        onMouseEnter={e => {
          e.stopPropagation()
          setHoveredGreen(true)
        }}
        onMouseLeave={e => {
          e.stopPropagation()
          setHoveredGreen(false)
        }}
        style={{
          width: 12,
          height: 12,
          borderRadius: '50%',
          backgroundColor: '#28c840',
          border: 'none',
          padding: 0,
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {hoveredGreen && (
          <span
            style={{
              fontSize: 8,
              lineHeight: 1,
              color: 'rgba(0,0,0,0.5)',
              fontWeight: 500,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            +
          </span>
        )}
      </button>
    </div>
  )
}

export default function TabBar() {
  const pathname = usePathname()
  const router = useRouter()
  const isMobile = useIsMobile()
  const { tabs, activeSlug, openTab, closeTab, setActiveSlug } = useTabs()
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [hoveredClose, setHoveredClose] = useState<string | null>(null)

  useEffect(() => {
    if (!pathname.startsWith('/work/')) return
    const slug = pathname.replace('/work/', '')
    const caseStudy = getCaseStudy(slug)
    if (!caseStudy) return

    openTab({
      slug,
      name: caseStudy.name,
      exe: `${slug}.exe`,
    })
    setActiveSlug(slug)
  }, [pathname, openTab, setActiveSlug])

  const chromeExe = staticChromeExe(pathname)
  if (chromeExe) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: TAB_BAR_HEIGHT,
          backgroundColor: 'rgba(10, 12, 16, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'stretch',
          zIndex: 50,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: isMobile ? '0 6px 0 8px' : '0 8px 0 10px',
            cursor: 'default',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderBottom: '1px solid #161a22',
          }}
        >
          {!isMobile && (
            <TabActiveTrafficLights
              onClose={() => router.push('/')}
              closeButtonTitle="Home"
            />
          )}
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: 11,
              fontWeight: 400,
              color: 'rgba(255,255,255,0.85)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
              minWidth: 0,
            }}
          >
            {chromeExe}
          </span>
        </div>
      </div>
    )
  }

  if (!pathname.startsWith('/work/')) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: TAB_BAR_HEIGHT,
        backgroundColor: 'rgba(10, 12, 16, 0.98)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 50,
        overflow: 'hidden',
      }}
    >
      {tabs.map(tab => {
        const isActive = tab.slug === activeSlug
        const isHoveringTab = hoveredTab === tab.slug
        const isHoveringClose = hoveredClose === tab.slug

        return (
          <div
            key={tab.slug}
            onMouseEnter={() => setHoveredTab(tab.slug)}
            onMouseLeave={() => setHoveredTab(null)}
            onClick={() => {
              setActiveSlug(tab.slug)
              router.push(`/work/${tab.slug}`)
            }}
            style={{
              flex: 1,
              minWidth: 0,
              maxWidth: isMobile ? 120 : 200,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: isMobile ? '0 6px 0 8px' : '0 8px 0 10px',
              cursor: 'pointer',
              touchAction: 'manipulation',
              backgroundColor: isActive
                ? 'rgba(255,255,255,0.05)'
                : isHoveringTab
                ? 'rgba(255,255,255,0.03)'
                : 'transparent',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              borderBottom: isActive
                ? '1px solid #161a22'
                : '1px solid transparent',
              transition: 'background 0.15s ease',
              position: 'relative',
            }}
          >
            {/* Traffic lights — active tab only, desktop; red closes tab (Session 81); hidden on mobile (Session 67) */}
            {isActive && !isMobile && (
              <TabActiveTrafficLights onClose={() => closeTab(tab.slug)} />
            )}

            {/* Tab label */}
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: 11,
                fontWeight: isActive ? 400 : 300,
                color: isActive
                  ? 'rgba(255,255,255,0.85)'
                  : isHoveringTab
                  ? 'rgba(255,255,255,0.55)'
                  : 'rgba(255,255,255,0.35)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
                transition: 'color 0.15s ease',
              }}
            >
              {tab.exe}
            </span>

            {/* Close button — always visible on active, fades in on hover for inactive */}
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                closeTab(tab.slug)
              }}
              onMouseEnter={e => {
                e.stopPropagation()
                setHoveredClose(tab.slug)
              }}
              onMouseLeave={e => {
                e.stopPropagation()
                setHoveredClose(null)
              }}
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isActive || isHoveringTab ? 1 : 0,
                backgroundColor: isHoveringClose
                  ? 'rgba(255,255,255,0.12)'
                  : 'transparent',
                color: isHoveringClose
                  ? 'rgba(255,255,255,0.8)'
                  : 'rgba(255,255,255,0.35)',
                fontSize: 12,
                lineHeight: 1,
                transition: 'opacity 0.15s ease, background 0.15s ease, color 0.15s ease',
                minWidth: isMobile ? 44 : undefined,
                minHeight: isMobile ? 44 : undefined,
                touchAction: 'manipulation',
              }}
            >
              <span style={{ pointerEvents: 'none', lineHeight: 1, fontSize: 12 }}>×</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
