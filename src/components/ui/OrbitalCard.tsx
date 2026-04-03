'use client'

import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'
import { useRouter } from 'next/navigation'
import type { Project } from '@/content/projects'
import {
  CHAT_RESPONSE_COMPLETE_EVENT,
  ORBIT_STAGING_EVENT,
  type OrbitStagingDetail,
} from '@/lib/orbitalStaging'
import {
  onOrbitalCardPointerEnter,
  onOrbitalCardPointerLeave,
} from '@/lib/swirlPointerShield'

interface OrbitalCardProps {
  project: Project
  homeX: number
  homeY: number
  driftXAmp: number
  driftYAmp: number
  driftXSpeed: number
  driftYSpeed: number
  driftPhase: number
  cardIndex: number
  onPositionUpdate: (index: number, x: number, y: number) => void
  /** Parent coordinates single active MP4 — pause others before play */
  onVideoHover: (index: number) => void
  onVideoLeave: (index: number) => void
}

/** Matches `CARD_W` / `CARD_H` in OrbitalSystem */
const CARD_W = 220
const CARD_H = 160
const HALF_W = CARD_W / 2
const HALF_H = CARD_H / 2
/**
 * Physics space: `posRef` is the card **center** in CSS pixels (same as staging `centerX` / `centerY`).
 * DOM: `translate(centerX - HALF_W, centerY - HALF_H)` with `fixed; left:0; top:0` — not top-left.
 * Session 97 — hard clamp uses center bounds (not top-left):
 *   minX = MARGIN + CARD_W/2,  maxX = vw - MARGIN - CARD_W/2
 *   minY = MARGIN + CARD_H/2,  maxY = vh - MARGIN - CARD_H/2
 */
const VIEWPORT_MARGIN = 16
/** After assistant streaming finishes, card returns to orbit after this delay */
const POST_STREAM_RELEASE_MS = 2000

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
    cardIndex,
    onPositionUpdate,
    onVideoHover,
    onVideoLeave,
  },
  ref
) {
  const router = useRouter()
  const [active, setActive] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Transform on cardRef (tick); z-index + opacity via globals.css :hover / --active (Session 102 — no inline hover styles)
  const cardRef = useRef<HTMLDivElement>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const postStreamReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const activeRef = useRef(false)
  const hoveredRef = useRef(false)
  const chosenSlotRef = useRef<{ x: number; y: number } | null>(null)
  const startTimeRef = useRef<number | null>(null)
  // Velocity-based physics state — persists between frames, never triggers renders
  const posRef = useRef({ x: 0, y: 0 })
  const velRef = useRef({ x: 0, y: 0 })

  // --- Dock on staging; release 2s after assistant reply finishes streaming (ChatPanel event) ---

  useEffect(() => {
    function releaseDockedCard() {
      activeRef.current = false
      setActive(false)
      chosenSlotRef.current = null
      if (!hoveredRef.current) onVideoLeave(cardIndex)
    }

    function handleStaging(e: Event) {
      const event = e as CustomEvent<OrbitStagingDetail>
      if (event.detail.projectId !== project.id) return
      clearTimeout(postStreamReleaseTimerRef.current)
      postStreamReleaseTimerRef.current = undefined
      chosenSlotRef.current = { x: event.detail.centerX, y: event.detail.centerY }
      activeRef.current = true
      setActive(true)
      onVideoHover(cardIndex)
    }

    function handleChatResponseComplete() {
      if (!activeRef.current) return
      clearTimeout(postStreamReleaseTimerRef.current)
      postStreamReleaseTimerRef.current = setTimeout(() => {
        postStreamReleaseTimerRef.current = undefined
        releaseDockedCard()
      }, POST_STREAM_RELEASE_MS)
    }

    window.addEventListener(ORBIT_STAGING_EVENT, handleStaging)
    window.addEventListener(CHAT_RESPONSE_COMPLETE_EVENT, handleChatResponseComplete)
    return () => {
      window.removeEventListener(ORBIT_STAGING_EVENT, handleStaging)
      window.removeEventListener(CHAT_RESPONSE_COMPLETE_EVENT, handleChatResponseComplete)
      clearTimeout(postStreamReleaseTimerRef.current)
    }
  }, [project.id, cardIndex, onVideoHover, onVideoLeave])

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

        const vw = window.innerWidth
        const vh = window.innerHeight

        // Same center bounds as `clampHome` in OrbitalSystem (HOME_MARGIN === VIEWPORT_MARGIN)
        const minX = VIEWPORT_MARGIN + HALF_W
        const maxX = vw - VIEWPORT_MARGIN - HALF_W
        const minY = VIEWPORT_MARGIN + HALF_H
        const maxY = vh - VIEWPORT_MARGIN - HALF_H

        const driftX = Math.sin(elapsed * driftXSpeed + driftPhase) * driftXAmp
        const driftY = Math.cos(elapsed * driftYSpeed + driftPhase * 1.3) * driftYAmp
        const targetX = Math.max(minX, Math.min(maxX, homeX + driftX))
        const targetY = Math.max(minY, Math.min(maxY, homeY + driftY))

        if (posRef.current.x === 0 && posRef.current.y === 0) {
          posRef.current = { x: targetX, y: targetY }
        }

        let { x, y } = posRef.current
        let { x: vx, y: vy } = velRef.current

        if (!activeRef.current || !chosenSlotRef.current) {
          // Session 94 — soft spring + high damping: weightless drift, long settle (idle only; staging lerp unchanged below)
          const SPRING = 0.004
          const DAMPING = 0.96

          vx += (targetX - x) * SPRING
          vy += (targetY - y) * SPRING
          vx *= DAMPING
          vy *= DAMPING
        }

        // Staging lerp runs here, then viewport clamp below (never clamp before lerp)
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

        // Session 97 — hard clamp on card *center* (not a force; zero velocity on boundary hit)
        const xUnclamped = x
        const yUnclamped = y
        x = Math.max(minX, Math.min(maxX, x))
        y = Math.max(minY, Math.min(maxY, y))
        if (x !== xUnclamped) vx = 0
        if (y !== yUnclamped) vy = 0

        posRef.current.x = x
        posRef.current.y = y
        velRef.current.x = vx
        velRef.current.y = vy

        onPositionUpdate(cardIndex, x, y)

        if (cardRef.current) {
          cardRef.current.style.transform = `translate(${x - HALF_W}px, ${y - HALF_H}px) translateZ(0)`
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
    ]
  )

  // --- Hover handlers ---

  function handleWrapperEnter() {
    hoveredRef.current = true
    onOrbitalCardPointerEnter()
    if (process.env.NODE_ENV === 'development') {
      // Session 102 — card wrapper: only transform (+ willChange/geometry) is set via inline style; hover z-index/opacity are CSS (:hover / --active)
      console.log(
        '[OrbitalCard] mouseenter: card wrapper — no opacity/zIndex inline writes; globals.css .orbital-card-root:hover + .orbital-card-opacity-layer'
      )
    }
    onVideoHover(cardIndex)
  }

  function handleWrapperLeave() {
    hoveredRef.current = false
    onOrbitalCardPointerLeave()
    if (process.env.NODE_ENV === 'development') {
      console.log(
        '[OrbitalCard] mouseleave: card wrapper — no opacity/zIndex inline writes; CSS :hover off restores idle layers'
      )
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
        transform: `translate(${homeX - HALF_W}px, ${homeY - HALF_H}px) translateZ(0)`,
        width: `${CARD_W}px`,
        willChange: 'transform',
        borderRadius: '8px',
      }}
      onMouseEnter={handleWrapperEnter}
      onMouseLeave={handleWrapperLeave}
    >
      {/* Session 100 — solid dark fill only (no backdrop-filter: avoids sampling animated Swirl every frame) */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          borderRadius: '8px',
          backgroundColor: 'rgba(14, 16, 21, 0.88)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="orbital-card-opacity-layer"
        style={{
          position: 'relative',
          zIndex: 1,
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

        {/* Terminal window — border / shadow from globals.css (no hover React state; Session 94 — no hover scale) */}
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
