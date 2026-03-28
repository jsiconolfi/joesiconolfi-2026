'use client'

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/content/projects'

interface OrbitalCardProps {
  project: Project
  homeX: number
  homeY: number
  driftXAmp: number
  driftYAmp: number
  driftXSpeed: number
  driftYSpeed: number
  driftPhase: number
  leftSlot: { x: number; y: number }
  rightSlot: { x: number; y: number }
  cardIndex: number
  onPositionUpdate: (index: number, x: number, y: number) => void
  positionsRef: React.MutableRefObject<Array<{ x: number; y: number }>>
  /** Parent coordinates single active MP4 — pause others before play */
  onVideoHover: (index: number) => void
  onVideoLeave: (index: number) => void
}

/** Matches `CARD_W` / `CARD_H` in OrbitalSystem — center of card in physics space */
const CARD_W = 220
const CARD_H = 160
const HALF_W = CARD_W / 2
const HALF_H = CARD_H / 2

export interface OrbitalCardHandle {
  tick: (now: number) => void
  getVideoElement: () => HTMLVideoElement | null
}

const OrbitalCard = forwardRef<OrbitalCardHandle, OrbitalCardProps>(function OrbitalCard(
  {
    project,
    homeX,
    homeY,
    driftXAmp,
    driftYAmp,
    driftXSpeed,
    driftYSpeed,
    driftPhase,
    leftSlot,
    rightSlot,
    cardIndex,
    onPositionUpdate,
    positionsRef,
    onVideoHover,
    onVideoLeave,
  },
  ref
) {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Transform + z-index on cardRef; opacity must NOT wrap backdrop-filter (breaks blur in WebKit/Blink)
  const cardRef = useRef<HTMLDivElement>(null)
  const opacityLayerRef = useRef<HTMLDivElement>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const deactivateTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const activeRef = useRef(false)
  const hoveredRef = useRef(false)
  const chosenSlotRef = useRef<{ x: number; y: number } | null>(null)
  const startTimeRef = useRef<number | null>(null)
  // Velocity-based physics state — persists between frames, never triggers renders
  const posRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })
  const frameCountRef = useRef(0)

  // --- Activation signal ---

  useEffect(() => {
    function handleSignal(e: Event) {
      const event = e as CustomEvent<{ projectId: string }>
      if (event.detail.projectId === project.id) {
        const vwCenter = window.innerWidth / 2
        chosenSlotRef.current = homeX < vwCenter ? leftSlot : rightSlot
        activeRef.current = true
        setActive(true)
        if (opacityLayerRef.current) {
          opacityLayerRef.current.style.opacity = '1'
        }
        if (cardRef.current) {
          cardRef.current.style.zIndex = '15'
        }
        onVideoHover(cardIndex)
        clearTimeout(deactivateTimer.current)
        deactivateTimer.current = setTimeout(() => {
          activeRef.current = false
          setActive(false)
          chosenSlotRef.current = null
          if (opacityLayerRef.current) {
            opacityLayerRef.current.style.opacity = hoveredRef.current ? '0.85' : '0.6'
          }
          if (cardRef.current) {
            cardRef.current.style.zIndex = hoveredRef.current ? '12' : '5'
          }
          if (!hoveredRef.current) onVideoLeave(cardIndex)
        }, 4000)
      }
    }
    window.addEventListener('portfolio:project-active', handleSignal)
    return () => window.removeEventListener('portfolio:project-active', handleSignal)
  }, [project.id, homeX, leftSlot, rightSlot, cardIndex, onVideoHover, onVideoLeave])

  // --- Drift + velocity physics driven by OrbitalSystem single RAF (`tick`) — direct DOM, no setState per frame ---

  useImperativeHandle(
    ref,
    () => ({
      getVideoElement() {
        return videoRef.current
      },
      tick(now: number) {
        if (startTimeRef.current === null) startTimeRef.current = now
        const elapsed = now - startTimeRef.current
        frameCountRef.current += 1

        const vw = window.innerWidth
        const vh = window.innerHeight

        const driftX = Math.sin(elapsed * driftXSpeed + driftPhase) * driftXAmp
        const driftY = Math.cos(elapsed * driftYSpeed + driftPhase * 1.3) * driftYAmp
        const targetX = homeX + driftX
        const targetY = homeY + driftY

        if (posRef.current.x === 0 && posRef.current.y === 0) {
          posRef.current = { x: targetX, y: targetY }
        }

        let { x, y } = posRef.current
        let { x: vx, y: vy } = velRef.current

        if (!activeRef.current || !chosenSlotRef.current) {
          const SPRING = 0.018
          const DAMPING = 0.82

          vx += (targetX - x) * SPRING
          vy += (targetY - y) * SPRING
          vx *= DAMPING
          vy *= DAMPING
        }

        if (!activeRef.current && frameCountRef.current % 3 === cardIndex % 3) {
          const MIN_DIST = 240
          const MIN_DIST_SQ = MIN_DIST * MIN_DIST
          const REPULSE = 0.6

          const others = positionsRef.current
          for (let j = 0; j < others.length; j++) {
            if (j === cardIndex) continue
            const other = others[j]
            if (!other || (other.x === 0 && other.y === 0)) continue
            const dx = x - other.x
            const dy = y - other.y
            const distSq = dx * dx + dy * dy
            if (distSq >= MIN_DIST_SQ || distSq === 0) continue
            const dist = Math.sqrt(distSq)
            const force = ((MIN_DIST - dist) / MIN_DIST) * REPULSE
            vx += (dx / dist) * force
            vy += (dy / dist) * force
          }
        }

        if (!activeRef.current) {
          const EDGE_MARGIN = 130
          const EDGE_FORCE = 0.4

          if (x < EDGE_MARGIN) vx += (EDGE_MARGIN - x) / EDGE_MARGIN * EDGE_FORCE
          if (x > vw - EDGE_MARGIN) vx -= (x - (vw - EDGE_MARGIN)) / EDGE_MARGIN * EDGE_FORCE
          if (y < EDGE_MARGIN) vy += (EDGE_MARGIN - y) / EDGE_MARGIN * EDGE_FORCE
          if (y > vh - EDGE_MARGIN) vy -= (y - (vh - EDGE_MARGIN)) / EDGE_MARGIN * EDGE_FORCE
        }

        if (activeRef.current && chosenSlotRef.current) {
          const slot = chosenSlotRef.current
          x += (slot.x - x) * 0.06
          y += (slot.y - y) * 0.06
          vx *= 0.85
          vy *= 0.85
        } else {
          x += vx
          y += vy
        }

        const HARD_MARGIN = 20
        x = Math.max(HARD_MARGIN, Math.min(vw - HARD_MARGIN, x))
        y = Math.max(HARD_MARGIN, Math.min(vh - HARD_MARGIN, y))

        posRef.current = { x, y }
        velRef.current = { x: vx, y: vy }

        onPositionUpdate(cardIndex, x, y)

        if (cardRef.current) {
          cardRef.current.style.transform = `translate(${x - HALF_W}px, ${y - HALF_H}px)`
        }
      },
    }),
    [
      homeX,
      homeY,
      driftXAmp,
      driftYAmp,
      driftXSpeed,
      driftYSpeed,
      driftPhase,
      cardIndex,
      onPositionUpdate,
      positionsRef,
    ]
  )

  // --- Hover handlers ---

  function handleWrapperEnter() {
    hoveredRef.current = true
    if (!activeRef.current) {
      if (opacityLayerRef.current) {
        opacityLayerRef.current.style.opacity = '0.85'
      }
      if (cardRef.current) {
        cardRef.current.style.zIndex = '12'
      }
    }
    onVideoHover(cardIndex)
  }

  function handleWrapperLeave() {
    hoveredRef.current = false
    if (!activeRef.current) {
      if (opacityLayerRef.current) {
        opacityLayerRef.current.style.opacity = '0.6'
      }
      if (cardRef.current) {
        cardRef.current.style.zIndex = '5'
      }
    }
    if (!activeRef.current) onVideoLeave(cardIndex)
  }

  function handleClick() {
    if (project.url) {
      if (project.url.startsWith('http')) {
        window.open(project.url, '_blank', 'noopener noreferrer')
      } else {
        router.push(project.url)
      }
    } else {
      window.dispatchEvent(
        new CustomEvent('portfolio:query', {
          detail: { query: `tell me about ${project.name}` },
        })
      )
    }
  }

  return (
    <div
      ref={cardRef}
      className={`fixed pointer-events-auto orbital-card-root ${active ? 'orbital-card-root--active' : ''}`}
      style={{
        left: 0,
        top: 0,
        transform: `translate(${homeX - HALF_W}px, ${homeY - HALF_H}px)`,
        width: `${CARD_W}px`,
        zIndex: 5,
        willChange: 'transform',
        borderRadius: '8px',
      }}
      onMouseEnter={handleWrapperEnter}
      onMouseLeave={handleWrapperLeave}
    >
      {/* Blur + tint behind card content — not on transform node; pointer-events none so panel receives clicks */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          borderRadius: '8px',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(22, 26, 34, 0.92)',
          pointerEvents: 'none',
        }}
      />

      <div
        ref={opacityLayerRef}
        style={{
          position: 'relative',
          zIndex: 1,
          opacity: 0.6,
          transition: 'opacity 0.3s ease',
        }}
      >
        {/* Active beacon — static dot; visibility toggled via CSS (.orbital-card-root--active) */}
        <div
          className="orbital-card-beacon absolute -top-1 -right-1 z-10 h-2 w-2 rounded-full"
          style={{
            backgroundColor: '#00ff9f',
            boxShadow: '0 0 8px rgba(0,255,159,0.5)',
          }}
          aria-hidden
        />

        {/* Terminal window — border / shadow / hover scale from globals.css (no hover React state) */}
        <div
          className={`orbital-card-panel ${active ? 'orbital-card-panel--active' : ''}`}
          onClick={handleClick}
          style={{
            backgroundColor: 'transparent',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            width: '220px',
          }}
        >
        {/* Chrome header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '7px 10px',
            backgroundColor: 'rgba(14, 16, 21, 0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block', flexShrink: 0 }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block', flexShrink: 0 }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block', flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.5)',
              marginLeft: '6px',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.id}.exe
          </span>
        </div>

        {/* Image area */}
        {/* videoSrc: prefer project.video, fall back to project.image if it's an mp4 */}
        {(() => {
          const isVideoAsset = project.image?.endsWith('.mp4')
          const videoSrc = project.video ?? (isVideoAsset ? project.image : undefined)
          const staticSrc = !isVideoAsset ? project.image : undefined
          const showStatic = staticSrc && !imgError

          return (
            <div
              style={{
                width: '100%',
                height: '120px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {videoSrc ? (
                // metadata: must load first frame for at-rest thumbnail (preload="none" leaves video area blank)
                <video
                  ref={videoRef}
                  src={videoSrc}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  onLoadedMetadata={() => {
                    if (videoRef.current) videoRef.current.currentTime = 0
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    // Own compositor layer — video decode isolated from canvas
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                  }}
                />
              ) : showStatic ? (
                // Raw <img> intentional — fixed-size decorative thumbnail; next/image caused silent failures
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={staticSrc}
                  alt={project.name}
                  onError={() => setImgError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
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
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '9px',
                      color: 'rgba(255,255,255,0.15)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                    }}
                  >
                    {project.id}
                  </span>
                </div>
              )}
            </div>
          )
        })()}

        {/* One line of copy */}
        <div style={{ padding: '8px 10px 4px' }}>
          <p
            className="orbital-card-role"
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 300,
              margin: 0,
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.role}
          </p>
        </div>

        {/* Footer — click affordance */}
        <div
          style={{
            padding: '0 10px 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {project.url ? (
            <span className="orbital-card-footer-link">view case study →</span>
          ) : (
            <div style={{ position: 'relative', width: '100%', minHeight: 14 }}>
              <span className="orbital-card-footer-idle">case study coming soon</span>
              <span className="orbital-card-footer-prompt" aria-hidden>
                ask me about this →
              </span>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  )
})

export default OrbitalCard
