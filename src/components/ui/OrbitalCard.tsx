'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [active, setActive] = useState(false)
  const [displayPos, setDisplayPos] = useState({ x: homeX, y: homeY })
  const [imgError, setImgError] = useState(false)
  const rafRef = useRef<number | undefined>(undefined)
  const deactivateTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lerpRef = useRef(0)
  const activeRef = useRef(false)
  const chosenSlotRef = useRef<{ x: number; y: number } | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    function handleSignal(e: Event) {
      const event = e as CustomEvent<{ projectId: string }>
      if (event.detail.projectId === project.id) {
        const vwCenter = window.innerWidth / 2
        chosenSlotRef.current = homeX < vwCenter ? leftSlot : rightSlot
        setActive(true)
        clearTimeout(deactivateTimer.current)
        deactivateTimer.current = setTimeout(() => {
          setActive(false)
          chosenSlotRef.current = null
        }, 4000)
      }
    }
    window.addEventListener('portfolio:project-active', handleSignal)
    return () => window.removeEventListener('portfolio:project-active', handleSignal)
  }, [project.id, homeX, leftSlot, rightSlot])

  useEffect(() => {
    const MIN_DIST = 240
    const REPULSE_STRENGTH = 0.4

    function frame(now: number) {
      if (startTimeRef.current === null) startTimeRef.current = now
      const elapsed = now - startTimeRef.current

      const driftX = Math.sin(elapsed * driftXSpeed + driftPhase) * driftXAmp
      const driftY = Math.cos(elapsed * driftYSpeed + driftPhase * 1.3) * driftYAmp
      let px = homeX + driftX
      let py = homeY + driftY

      // Collision repulsion — only when not staged (staging overrides)
      if (!activeRef.current) {
        const others = positionsRef.current
        for (let j = 0; j < others.length; j++) {
          if (j === cardIndex) continue
          const other = others[j]
          if (!other || (other.x === 0 && other.y === 0)) continue

          const dx = px - other.x
          const dy = py - other.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < MIN_DIST && dist > 0) {
            const force = ((MIN_DIST - dist) / MIN_DIST) * REPULSE_STRENGTH
            px += (dx / dist) * force * MIN_DIST * 0.1
            py += (dy / dist) * force * MIN_DIST * 0.1
          }
        }

        // Clamp repelled position to viewport
        const hw = CARD_W / 2 + 8
        const hh = CARD_H / 2 + 8
        const vw = window.innerWidth
        const vh = window.innerHeight
        px = Math.max(hw, Math.min(vw - hw, px))
        py = Math.max(hh, Math.min(vh - hh, py))
      }

      // Report current position to the shared store
      onPositionUpdate(cardIndex, px, py)

      const targetSlot = activeRef.current && chosenSlotRef.current
        ? chosenSlotRef.current
        : null

      const targetLerp = targetSlot ? 1 : 0
      lerpRef.current += (targetLerp - lerpRef.current) * 0.06

      const tx = targetSlot ? targetSlot.x : px
      const ty = targetSlot ? targetSlot.y : py

      const x = px + (tx - px) * lerpRef.current
      const y = py + (ty - py) * lerpRef.current

      setDisplayPos({ x, y })
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [homeX, homeY, driftXAmp, driftYAmp, driftXSpeed, driftYSpeed, driftPhase, cardIndex, onPositionUpdate, positionsRef])

  const isVideo = project.image?.endsWith('.mp4')
  const showMedia = project.image && !imgError

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: displayPos.x,
        top: displayPos.y,
        transform: 'translate(-50%, -50%)',
        width: '220px',
        opacity: active ? 1 : 0.6,
        transition: 'opacity 0.5s ease',
        zIndex: active ? 15 : 5,
      }}
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
        onClick={() => {
          window.dispatchEvent(
            new CustomEvent('portfolio:query', {
              detail: { query: `tell me about ${project.name}` },
            })
          )
        }}
        style={{
          backgroundColor: 'rgba(22, 26, 34, 0.92)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          border: active
            ? '1px solid rgba(0,255,159,0.3)'
            : '1px solid rgba(255,255,255,0.08)',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          boxShadow: active
            ? '0 12px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,159,0.1)'
            : '0 8px 32px rgba(0,0,0,0.4)',
          transition: 'border 0.5s ease, box-shadow 0.5s ease',
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
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff5f57', display: 'block', flexShrink: 0 }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#febc2e', display: 'block', flexShrink: 0 }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#28c840', display: 'block', flexShrink: 0 }} />
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
        <div
          style={{
            width: '100%',
            height: '120px',
            backgroundColor: 'rgba(255,255,255,0.03)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {showMedia && isVideo ? (
            <video
              src={project.image}
              autoPlay
              muted
              loop
              playsInline
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: active ? 1 : 0.7,
                transition: 'opacity 0.5s ease',
                display: 'block',
              }}
            />
          ) : showMedia ? (
            // Raw <img> intentional — fixed-size decorative thumbnail, same context as <video> above
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.image}
              alt={project.name}
              onError={() => setImgError(true)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: active ? 1 : 0.7,
                transition: 'opacity 0.5s ease',
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

        {/* One line of copy */}
        <div style={{ padding: '8px 10px 10px' }}>
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
      </div>
    </div>
  )
}
