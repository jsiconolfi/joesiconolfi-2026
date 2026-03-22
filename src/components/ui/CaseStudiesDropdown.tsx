'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FEATURED_PROJECTS } from '@/content/featured-projects'
import CaseStudyThumbnail from './CaseStudyThumbnail'

export default function CaseStudiesDropdown() {
  const [open, setOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const router = useRouter()

  function handleMouseEnter() {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  function handleProjectClick(url?: string) {
    setOpen(false)
    if (url) {
      if (url.startsWith('http')) {
        window.open(url, '_blank', 'noopener noreferrer')
      } else {
        router.push(url)
      }
    }
  }

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: '13px',
          fontWeight: 300,
          color: open ? '#00ff9f' : '#eeeeee',
          background: 'none',
          border: 'none',
          cursor: 'default',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 0',
          transition: 'color 0.2s ease',
        }}
      >
        case studies
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{
            transform: open ? 'rotate(0deg)' : 'rotate(180deg)',
            transition: 'transform 0.2s ease',
            opacity: 0.5,
          }}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 20px)',
            left: 0,
            width: 320,
            backgroundColor: 'rgba(14, 16, 21, 0.97)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            zIndex: 50,
          }}
        >
          {FEATURED_PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.url)}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '12px 16px',
                cursor: project.url ? 'pointer' : 'default',
                backgroundColor: hoveredId === project.id
                  ? 'rgba(255,255,255,0.04)'
                  : 'transparent',
                transition: 'background 0.15s ease',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <CaseStudyThumbnail project={project} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '12px',
                  fontWeight: 400,
                  color: hoveredId === project.id
                    ? '#00ff9f'
                    : 'rgba(255,255,255,0.75)',
                  margin: '0 0 3px',
                  transition: 'color 0.15s ease',
                }}>
                  {project.name}
                </p>
                <p style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '10px',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.35)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {project.description}
                </p>
              </div>
              {project.url && hoveredId === project.id && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, opacity: 0.5 }}>
                  <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          ))}

          <div
            onClick={() => setOpen(false)}
            onMouseEnter={() => setHoveredId('browse')}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: hoveredId === 'browse'
                ? 'rgba(255,255,255,0.04)'
                : 'transparent',
              transition: 'background 0.15s ease',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 300,
              color: hoveredId === 'browse' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
              margin: '0 0 1px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              transition: 'color 0.15s ease',
            }}>
              Browse
            </p>
            <p style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              fontWeight: 300,
              color: hoveredId === 'browse' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
              margin: 0,
              transition: 'color 0.15s ease',
            }}>
              See all case studies
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
