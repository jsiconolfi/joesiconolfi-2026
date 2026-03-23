'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/content/projects'

const CARD_W = 220
const CARD_H = 160

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
}

export default function OrbitalCard({
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
}: OrbitalCardProps) {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  // DOM ref for imperative position + opacity + zIndex updates
  const cardRef = useRef<HTMLDivElement>(null)

  const rafRef = useRef<number | undefined>(undefined)
  const videoRef = useRef<HTMLVideoElement>(null)
  const deactivateTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const activeRef = useRef(false)
  const hoveredRef = useRef(false)
  const chosenSlotRef = useRef<{ x: number; y: number } | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const videoPlayingRef = useRef(false)
  // Velocity-based physics state — persists between frames, never triggers renders
  const posRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })

  // --- Imperative video helpers ---

  function playVideo() {
    const video = videoRef.current
    const hasVideo = !!(project.video || project.image?.endsWith('.mp4'))
    if (!video || !hasVideo || videoPlayingRef.current) return
    videoPlayingRef.current = true
    if (video.readyState >= 2) {
      video.play().catch(() => {})
    } else {
      video.addEventListener('canplay', () => video.play().catch(() => {}), { once: true })
    }
  }

  function pauseVideo() {
    const video = videoRef.current
    const hasVideo = !!(project.video || project.image?.endsWith('.mp4'))
    if (!video || !hasVideo) return
    videoPlayingRef.current = false
    video.pause()
    requestAnimationFrame(() => {
      if (!videoPlayingRef.current) video.currentTime = 0
    })
  }

  // --- Activation signal ---

  useEffect(() => {
    function handleSignal(e: Event) {
      const event = e as CustomEvent<{ projectId: string }>
      if (event.detail.projectId === project.id) {
        const vwCenter = window.innerWidth / 2
        chosenSlotRef.current = homeX < vwCenter ? leftSlot : rightSlot
        activeRef.current = true
        setActive(true)
        if (cardRef.current) {
          cardRef.current.style.opacity = '1'
          cardRef.current.style.zIndex = '15'
        }
        playVideo()
        clearTimeout(deactivateTimer.current)
        deactivateTimer.current = setTimeout(() => {
          activeRef.current = false
          setActive(false)
          chosenSlotRef.current = null
          if (cardRef.current) {
            cardRef.current.style.opacity = hoveredRef.current ? '0.85' : '0.6'
            cardRef.current.style.zIndex = hoveredRef.current ? '12' : '5'
          }
          if (!hoveredRef.current) pauseVideo()
        }, 4000)
      }
    }
    window.addEventListener('portfolio:project-active', handleSignal)
    return () => window.removeEventListener('portfolio:project-active', handleSignal)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id, homeX, leftSlot, rightSlot])

  // --- RAF drift + velocity-based physics (direct DOM, no setState) ---

  useEffect(() => {
    function frame(now: number) {
      if (startTimeRef.current === null) startTimeRef.current = now
      const elapsed = now - startTimeRef.current

      const vw = window.innerWidth
      const vh = window.innerHeight

      // Drift: gentle sine wave around home position
      const driftX = Math.sin(elapsed * driftXSpeed + driftPhase) * driftXAmp
      const driftY = Math.cos(elapsed * driftYSpeed + driftPhase * 1.3) * driftYAmp
      const targetX = homeX + driftX
      const targetY = homeY + driftY

      // Initialize position to drift target on first frame
      if (posRef.current.x === 0 && posRef.current.y === 0) {
        posRef.current = { x: targetX, y: targetY }
      }

      let { x, y } = posRef.current
      let { x: vx, y: vy } = velRef.current

      // Spring toward drift target (bypassed while staged — slot lerp handles it)
      if (!activeRef.current || !chosenSlotRef.current) {
        const SPRING = 0.018   // how strongly card follows drift target
        const DAMPING = 0.82   // velocity decay per frame — kills oscillation

        vx += (targetX - x) * SPRING
        vy += (targetY - y) * SPRING
        vx *= DAMPING
        vy *= DAMPING
      }

      // Collision repulsion — force added to velocity, not position
      if (!activeRef.current) {
        const MIN_DIST = 240
        const REPULSE = 0.6   // impulse magnitude; decays each frame via DAMPING

        const others = positionsRef.current
        for (let j = 0; j < others.length; j++) {
          if (j === cardIndex) continue
          const other = others[j]
          if (!other || (other.x === 0 && other.y === 0)) continue
          const dx = x - other.x
          const dy = y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MIN_DIST && dist > 0) {
            const force = ((MIN_DIST - dist) / MIN_DIST) * REPULSE
            vx += (dx / dist) * force
            vy += (dy / dist) * force
          }
        }
      }

      // Soft edge repulsion — additive to velocity so it damps naturally
      if (!activeRef.current) {
        const EDGE_MARGIN = 130   // px from viewport edge where force starts
        const EDGE_FORCE = 0.4    // impulse magnitude

        if (x < EDGE_MARGIN)       vx += (EDGE_MARGIN - x) / EDGE_MARGIN * EDGE_FORCE
        if (x > vw - EDGE_MARGIN)  vx -= (x - (vw - EDGE_MARGIN)) / EDGE_MARGIN * EDGE_FORCE
        if (y < EDGE_MARGIN)       vy += (EDGE_MARGIN - y) / EDGE_MARGIN * EDGE_FORCE
        if (y > vh - EDGE_MARGIN)  vy -= (y - (vh - EDGE_MARGIN)) / EDGE_MARGIN * EDGE_FORCE
      }

      // Staging lerp — overrides physics while active and slot is chosen
      if (activeRef.current && chosenSlotRef.current) {
        const slot = chosenSlotRef.current
        x += (slot.x - x) * 0.06
        y += (slot.y - y) * 0.06
        // Bleed velocity so return-to-orbit is smooth
        vx *= 0.85
        vy *= 0.85
      } else {
        x += vx
        y += vy
      }

      // Hard safety clamp — last resort only, fires only if card exits viewport entirely
      const HARD_MARGIN = 20
      x = Math.max(HARD_MARGIN, Math.min(vw - HARD_MARGIN, x))
      y = Math.max(HARD_MARGIN, Math.min(vh - HARD_MARGIN, y))

      // Persist state for next frame
      posRef.current = { x, y }
      velRef.current = { x: vx, y: vy }

      // Report to shared positions store
      onPositionUpdate(cardIndex, x, y)

      // Direct DOM update — bypasses React reconciler entirely
      if (cardRef.current) {
        cardRef.current.style.left = `${x}px`
        cardRef.current.style.top = `${y}px`
      }

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [homeX, homeY, driftXAmp, driftYAmp, driftXSpeed, driftYSpeed, driftPhase, cardIndex, onPositionUpdate, positionsRef])

  // --- Hover handlers ---

  function handleWrapperEnter() {
    hoveredRef.current = true
    setHovered(true)
    if (!activeRef.current && cardRef.current) {
      cardRef.current.style.opacity = '0.85'
      cardRef.current.style.zIndex = '12'
    }
    playVideo()
  }

  function handleWrapperLeave() {
    hoveredRef.current = false
    setHovered(false)
    if (!activeRef.current && cardRef.current) {
      cardRef.current.style.opacity = '0.6'
      cardRef.current.style.zIndex = '5'
    }
    if (!activeRef.current) pauseVideo()
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
      className="absolute pointer-events-auto"
      style={{
        left: homeX,
        top: homeY,
        transform: 'translate(-50%, -50%)',
        width: '220px',
        opacity: 0.6,
        transition: 'opacity 0.3s ease',
        zIndex: 5,
        // Promote to compositor layer — position updates bypass paint entirely
        willChange: 'transform, left, top',
      }}
      onMouseEnter={handleWrapperEnter}
      onMouseLeave={handleWrapperLeave}
    >
      {/* Active beacon — static dot, no animation */}
      {active && (
        <div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full z-10"
          style={{
            backgroundColor: '#00ff9f',
            boxShadow: '0 0 8px rgba(0,255,159,0.5)',
          }}
        />
      )}

      {/* Terminal window */}
      <div
        onClick={handleClick}
        style={{
          backgroundColor: 'rgba(22, 26, 34, 0.92)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          border: active
            ? '1px solid rgba(0,255,159,0.3)'
            : hovered
            ? '1px solid rgba(255,255,255,0.2)'
            : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: active
            ? '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,159,0.1)'
            : '0 8px 32px rgba(0,0,0,0.4)',
          transform: hovered && !active ? 'scale(1.02)' : 'scale(1)',
          transition: 'border 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
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
                // preload="metadata" loads first frame for display at rest; play() fires on hover/active
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
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 300,
              color: active ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.5)',
              margin: 0,
              lineHeight: 1.4,
              transition: 'color 0.5s ease',
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
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '9px',
                color: hovered ? '#00ff9f' : 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'color 0.2s ease',
              }}
            >
              view case study →
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '9px',
                color: hovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                transition: 'color 0.2s ease',
              }}
            >
              {hovered ? 'ask me about this →' : 'case study coming soon'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
