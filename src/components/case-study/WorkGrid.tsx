'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/useIsMobile'
import { CASE_STUDIES, type CaseStudy } from '@/content/case-studies'

function GridThumbnail({ cs }: { cs: CaseStudy }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleEnter() {
    const video = videoRef.current
    if (!video || !cs.heroAsset?.endsWith('.mp4')) return
    video.currentTime = 0
    void video.play().catch(() => {})
  }

  function handleLeave() {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {cs.heroAsset ? (
        cs.heroAsset.endsWith('.mp4') ? (
          <video
            ref={videoRef}
            src={cs.heroAsset}
            muted
            playsInline
            loop
            preload="metadata"
            onLoadedMetadata={e => {
              ;(e.currentTarget as HTMLVideoElement).currentTime = 0
            }}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cs.heroAsset}
            alt={cs.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        )
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
            backgroundSize: '20px 20px',
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.12)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {cs.slug}
          </span>
        </div>
      )}
    </div>
  )
}

export default function WorkGrid() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [closeHovered, setCloseHovered] = useState(false)
  const [yellowHovered, setYellowHovered] = useState(false)
  const [greenHovered, setGreenHovered] = useState(false)

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'var(--font-mono, monospace)', overflowX: 'hidden' }}>

      {/* Terminal chrome header — colored traffic lights; red → home (Session 71) */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(10, 12, 16, 0.98)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
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
              fontWeight: 500, userSelect: 'none',
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
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }}>−</span>
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
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }}>+</span>
          )}
        </span>

        {/* Window title */}
        <span style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.4)',
          marginLeft: 10,
          fontFamily: 'var(--font-mono)',
          fontWeight: 300,
        }}>
          case-studies.exe
        </span>
      </div>

      {/* Content */}
      <div style={{
        padding: isMobile ? '100px 20px 80px' : '100px 48px 120px',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
      }}>

        {/* Header */}
        <div style={{ maxWidth: 960, margin: '0 auto 64px' }}>
          <p style={{
            fontSize: 10,
            color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            margin: '0 0 12px',
          }}>
            case studies
          </p>
          <h1 style={{
            fontSize: isMobile ? 22 : 28,
            fontWeight: 400,
            margin: '0 0 8px',
            letterSpacing: '-0.02em',
            color: 'rgba(255,255,255,0.9)',
          }}>
            15 years of building AI-native products
          </h1>
          <p style={{
            fontSize: 13,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.4)',
            margin: 0,
          }}>
            {CASE_STUDIES.length} projects — design, engineering, and everything between
          </p>
        </div>

        {/* Grid */}
        <div
          style={{
            maxWidth: 960,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
          }}
        >
          {CASE_STUDIES.map(cs => (
            <div
              key={cs.id}
              role="button"
              tabIndex={0}
              aria-label={`Open case study ${cs.name}`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  router.push(`/work/${cs.slug}`)
                }
              }}
              onClick={() => router.push(`/work/${cs.slug}`)}
              style={{
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                backgroundColor: 'rgba(22, 26, 34, 0.6)',
                backdropFilter: 'blur(5px)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, background 0.2s ease',
                touchAction: 'manipulation',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.14)'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(22,26,34,0.85)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(22,26,34,0.6)'
              }}
            >
              {/* Terminal chrome */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '8px 12px',
                minHeight: isMobile ? 44 : undefined,
                backgroundColor: 'rgba(14,16,21,0.8)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block' }} />
                <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block' }} />
                <span style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.4)',
                  marginLeft: 8,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {cs.slug}.exe
                </span>
              </div>

              <GridThumbnail cs={cs} />

              {/* Info */}
              <div style={{ padding: '12px 14px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                    {cs.name}
                  </p>
                  <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
                    {cs.year}
                  </p>
                </div>
                <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px', lineHeight: 1.4, wordBreak: 'break-word' }}>
                  {cs.tagline}
                </p>
                <p style={{
                  fontSize: 9,
                  color: 'rgba(0,255,159,0.5)',
                  margin: 0,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  case study
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
