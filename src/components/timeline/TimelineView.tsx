'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { TIMELINE } from '@/content/timeline'
import type { TimelineEra } from '@/content/timeline'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function TimelineView() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [closeHovered, setCloseHovered] = useState(false)
  const [yellowHovered, setYellowHovered] = useState(false)
  const [greenHovered, setGreenHovered] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const eraRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Single scroll listener — finds the era whose center is closest to 40% from
  // the top of the viewport. Uses getBoundingClientRect (always viewport-relative)
  // rather than offsetTop (which is relative to offsetParent and breaks in nested
  // scroll containers). Works in both directions, never skips.
  useEffect(() => {
    const scrollContainer = document.querySelector('[data-scroll-container]') as HTMLElement | null
    if (!scrollContainer) return

    function findActiveEra() {
      const targetY = window.innerHeight * 0.4

      let closestId: string | null = null
      let closestDistance = Infinity

      eraRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect()
        const elCenter = rect.top + rect.height / 2
        const distance = Math.abs(elCenter - targetY)
        if (distance < closestDistance) {
          closestDistance = distance
          closestId = id
        }
      })

      if (closestId) setActiveId(closestId)
    }

    // rAF ensures DOM is fully painted before the first measurement
    requestAnimationFrame(findActiveEra)

    scrollContainer.addEventListener('scroll', findActiveEra, { passive: true })
    return () => scrollContainer.removeEventListener('scroll', findActiveEra)
  }, [])

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'var(--font-mono, monospace)', overflowX: 'hidden' }}>

      {/* Terminal chrome — colored traffic lights; red → home (Session 71) */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: 'rgba(10, 12, 16, 0.98)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <button
          type="button"
          title="Home"
          onClick={() => router.push('/')}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: '#ff5f57',
            border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            touchAction: 'manipulation',
          }}
        >
          {closeHovered && (
            <span style={{
              fontSize: 8, lineHeight: 1,
              color: 'rgba(0,0,0,0.65)',
              fontWeight: 700, userSelect: 'none',
              pointerEvents: 'none',
            }}>×</span>
          )}
        </button>
        <span
          onMouseEnter={() => setYellowHovered(true)}
          onMouseLeave={() => setYellowHovered(false)}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: '#febc2e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'default',
          }}
        >
          {yellowHovered && (
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 700, userSelect: 'none', pointerEvents: 'none' }}>−</span>
          )}
        </span>
        <span
          onMouseEnter={() => setGreenHovered(true)}
          onMouseLeave={() => setGreenHovered(false)}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: '#28c840',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'default',
          }}
        >
          {greenHovered && (
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 700, userSelect: 'none', pointerEvents: 'none' }}>+</span>
          )}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 10, fontWeight: 300 }}>
          timeline.exe
        </span>

      </div>

      {/* Page content */}
      <div style={{
        maxWidth: 760,
        margin: '0 auto',
        padding: isMobile ? '100px 20px 80px' : '120px 48px 160px',
        boxSizing: 'border-box',
        width: '100%',
      }}>

        {/* Header */}
        <div style={{ marginBottom: 80, paddingLeft: 48 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>
            timeline
          </p>
          <h1 style={{ fontSize: isMobile ? 22 : 28, fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)' }}>
            15+ years of building
          </h1>
          <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0, lineHeight: 1.6 }}>
            From MySpace CSS to AI systems at Cohere. Every role compounded the next.
          </p>
          <a
            href="/JoeSiconolfi_Resume-2026.pdf"
            download
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 20,
              fontSize: 11,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.4)',
              textDecoration: 'none',
              fontFamily: 'var(--font-mono)',
              transition: 'color 0.2s ease',
              minHeight: isMobile ? 44 : undefined,
              touchAction: 'manipulation',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#00ff9f')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <span style={{ fontSize: 10, color: 'rgba(0,255,159,0.5)' }}>↓</span>
            download resume
          </a>
        </div>

        {/* Timeline — single static rail + era blocks on top */}
        <div style={{ position: 'relative' }}>

          {/* Static rail — single element, never transitions */}
          <div style={{
            position: 'absolute',
            left: 11,
            top: 8,
            bottom: 0,
            width: 1,
            backgroundColor: 'rgba(255,255,255,0.07)',
            pointerEvents: 'none',
          }} />

          {/* Era blocks sit above the rail */}
          <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
            {TIMELINE.map((era) => (
              <EraBlock
                key={era.id}
                era={era}
                isActive={activeId === era.id}
                isMobile={isMobile}
                onRef={el => {
                  if (el) eraRefs.current.set(era.id, el)
                  else eraRefs.current.delete(era.id)
                }}
                onCaseStudy={era.slug ? () => router.push(`/work/${era.slug}`) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Footer — marginLeft: 11 aligns border with rail, paddingLeft: 37 keeps text at content column (11+37=48) */}
        <div style={{ marginTop: 64, paddingTop: 40, marginLeft: 11, paddingLeft: 37, borderTop: '1px solid rgba(255,255,255,0.06)', wordBreak: 'break-word' }}>
          <p style={{
            fontSize: 11,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.25)',
            margin: 0,
            lineHeight: 1.6,
          }}>
            Currently at Cohere, San Francisco · Staff Design Engineer
          </p>
        </div>
      </div>
    </main>
  )
}

interface EraBlockProps {
  era: TimelineEra
  isActive: boolean
  isMobile: boolean
  onRef: (el: HTMLDivElement | null) => void
  onCaseStudy?: () => void
}

function EraBlock({ era, isActive, isMobile, onRef, onCaseStudy }: EraBlockProps) {
  const isCompact = era.type === 'compact'
  const isCurrent = era.id === 'cohere'

  return (
    <div
      ref={onRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '24px 1fr',
        gap: '0 24px',
      }}
    >
      {/* Dot column — dot only, sits above the static rail */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 4,
      }}>
        <div style={{
          width: isCompact ? 6 : 8,
          height: isCompact ? 6 : 8,
          borderRadius: '50%',
          backgroundColor: isActive ? '#00ff9f' : 'rgba(255,255,255,0.12)',
          boxShadow: isActive ? '0 0 6px rgba(0,255,159,0.3)' : 'none',
          transition: 'background-color 0.35s ease, box-shadow 0.35s ease',
          flexShrink: 0,
        }} />
      </div>

      {/* Content column */}
      <div style={{ paddingBottom: isCompact ? 32 : 56, minWidth: 0 }}>

        {/* Year + company */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: isCompact ? 4 : 10 }}>
          <span style={{
            fontSize: 10,
            color: isActive ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
            fontWeight: 300,
            letterSpacing: '0.05em',
            flexShrink: 0,
            transition: 'color 0.35s ease',
          }}>
            {era.years}
          </span>
          <span style={{
            fontSize: isCompact ? 12 : 14,
            fontWeight: isCompact ? 300 : 400,
            color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
            transition: 'color 0.35s ease',
          }}>
            {era.company}
          </span>
          {isCurrent && (
            <span style={{
              fontSize: 9,
              color: '#00ff9f',
              border: '1px solid rgba(0,255,159,0.3)',
              borderRadius: 3,
              padding: '1px 5px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              now
            </span>
          )}
        </div>

        {/* Role */}
        <p style={{
          fontSize: isCompact ? 10 : 11,
          color: isActive ? 'rgba(0,255,159,0.7)' : 'rgba(0,255,159,0.25)',
          margin: isCompact ? '0 0 6px' : '0 0 10px',
          fontWeight: 300,
          transition: 'color 0.35s ease',
        }}>
          {era.role} · {era.location}
        </p>

        {/* Summary */}
        <p style={{
          fontSize: isCompact ? 11 : 12,
          fontWeight: 300,
          lineHeight: 1.7,
          color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)',
          margin: isCompact ? '0' : '0 0 16px',
          transition: 'color 0.35s ease',
          wordBreak: 'break-word',
        }}>
          {era.summary}
        </p>

        {/* Artifacts — full eras only */}
        {!isCompact && era.artifacts && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            {era.artifacts.map((artifact, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
                <span style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.18)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  flexShrink: 0,
                  width: 72,
                }}>
                  {artifact.label}
                </span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 300,
                  color: isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.18)',
                  transition: 'color 0.35s ease',
                  wordBreak: 'break-word',
                  minWidth: 0,
                }}>
                  {artifact.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Tech stack pills — full eras only */}
        {!isCompact && era.tech && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: onCaseStudy ? 14 : 0 }}>
            {era.tech.map(t => (
              <span key={t} style={{
                fontSize: 9,
                fontWeight: 300,
                color: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.12)',
                border: `1px solid ${isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)'}`,
                borderRadius: 3,
                padding: '2px 6px',
                transition: 'color 0.35s ease, border-color 0.35s ease',
              }}>
                {t}
              </span>
            ))}
          </div>
        )}

        {/* Case study link */}
        {onCaseStudy && (
          <button
            type="button"
            onClick={onCaseStudy}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: isMobile ? '10px 0' : 0,
              fontSize: 10,
              color: isActive ? 'rgba(0,255,159,0.55)' : 'rgba(0,255,159,0.15)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 300,
              letterSpacing: '0.06em',
              transition: 'color 0.2s ease',
              textTransform: 'uppercase',
              minHeight: isMobile ? 44 : undefined,
              display: isMobile ? 'inline-flex' : undefined,
              alignItems: isMobile ? 'center' : undefined,
              touchAction: 'manipulation',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#00ff9f')}
            onMouseLeave={e => (e.currentTarget.style.color = isActive ? 'rgba(0,255,159,0.55)' : 'rgba(0,255,159,0.15)')}
          >
            view case study →
          </button>
        )}
      </div>
    </div>
  )
}
