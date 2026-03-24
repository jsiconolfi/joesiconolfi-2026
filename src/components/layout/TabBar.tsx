'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useTabs } from '@/context/TabContext'
import { getCaseStudy } from '@/content/case-studies'

export const TAB_BAR_HEIGHT = 38

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
            {/* Traffic lights — active tab only, decorative; hidden on mobile (Session 67) */}
            {isActive && !isMobile && (
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#ff5f57', display: 'block' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#febc2e', display: 'block' }} />
                <span style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: '#28c840', display: 'block' }} />
              </div>
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
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}
