'use client'

import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/content/projects'

interface OrbitalCardProps {
  project: Project
  orbitAngle: number
  orbitRadiusX: number
  orbitRadiusY: number
  orbitSpeed: number
  orbitOffset: number
  centerX: number
  centerY: number
  leftSlot: { x: number; y: number }
  rightSlot: { x: number; y: number }
}

export default function OrbitalCard({
  project,
  orbitAngle,
  orbitRadiusX,
  orbitRadiusY,
  orbitSpeed,
  orbitOffset,
  centerX,
  centerY,
  leftSlot,
  rightSlot,
}: OrbitalCardProps) {
  const [active, setActive] = useState(false)
  const [displayPos, setDisplayPos] = useState({ x: 0, y: 0 })
  const angleRef = useRef(orbitAngle + orbitOffset)
  const rafRef = useRef<number | undefined>(undefined)
  const deactivateTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const lerpRef = useRef(0)
  const activeRef = useRef(false)
  const chosenSlotRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    activeRef.current = active
  }, [active])

  useEffect(() => {
    function handleSignal(e: Event) {
      const event = e as CustomEvent<{ projectId: string }>
      if (event.detail.projectId === project.id) {
        // Pick side based on current orbital x position
        const currentX = centerX + Math.cos(angleRef.current) * orbitRadiusX
        chosenSlotRef.current = currentX < centerX ? leftSlot : rightSlot

        setActive(true)
        clearTimeout(deactivateTimer.current)
        deactivateTimer.current = setTimeout(() => {
          setActive(false)
          // Do NOT clear chosenSlotRef here — the frame loop drains lerpRef
          // back to 0 first, then clears it, producing a smooth return to orbit
        }, 4000)
      }
    }
    window.addEventListener('portfolio:project-active', handleSignal)
    return () => window.removeEventListener('portfolio:project-active', handleSignal)
  }, [project.id, centerX, orbitRadiusX, leftSlot, rightSlot])

  useEffect(() => {
    let lastTime = performance.now()

    function frame(now: number) {
      const delta = (now - lastTime) / 1000
      lastTime = now

      angleRef.current += orbitSpeed * delta

      const ox = centerX + Math.cos(angleRef.current) * orbitRadiusX
      const oy = centerY + Math.sin(angleRef.current) * orbitRadiusY

      // Drive lerp toward 1 when active, toward 0 when not
      const targetLerp = activeRef.current ? 1 : 0
      lerpRef.current += (targetLerp - lerpRef.current) * 0.06

      // Once the lerp has fully drained, release the chosen slot
      if (!activeRef.current && lerpRef.current < 0.005) {
        chosenSlotRef.current = null
        lerpRef.current = 0
      }

      // If a staging target exists, interpolate toward it — otherwise pure orbit
      const stagingTarget = chosenSlotRef.current
      const tx = stagingTarget ? stagingTarget.x : ox
      const ty = stagingTarget ? stagingTarget.y : oy

      const x = ox + (tx - ox) * lerpRef.current
      const y = oy + (ty - oy) * lerpRef.current

      setDisplayPos({ x, y })
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [centerX, centerY, orbitRadiusX, orbitRadiusY, orbitSpeed])

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: displayPos.x,
        top: displayPos.y,
        transform: 'translate(-50%, -50%)',
        width: '220px',
        opacity: active ? 1 : 0.45,
        transition: 'opacity 0.6s ease',
        zIndex: active ? 15 : 5,
      }}
    >
      {/* Active beacon */}
      {active && (
        <div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full z-10"
          style={{
            backgroundColor: '#00ff9f',
            boxShadow: '0 0 6px #00ff9f',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}

      {/* Terminal window card */}
      <div
        style={{
          backgroundColor: 'rgba(22, 26, 34, 0.85)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          boxShadow: active
            ? '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,255,159,0.2)'
            : '0 8px 32px rgba(0,0,0,0.3)',
          border: active
            ? '1px solid rgba(0,255,159,0.25)'
            : '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          overflow: 'hidden',
          transition: 'border 0.6s ease, box-shadow 0.6s ease',
        }}
      >
        {/* Terminal chrome header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 10px',
            backgroundColor: 'rgba(14, 16, 21, 0.8)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#ff5f57', opacity: 0.8, display: 'block', flexShrink: 0 }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#febc2e', opacity: 0.8, display: 'block', flexShrink: 0 }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#28c840', opacity: 0.8, display: 'block', flexShrink: 0 }} />
          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '11px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.6)',
              marginLeft: '6px',
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {project.name.toLowerCase().replace(/\s/g, '-')}.exe
          </span>
        </div>

        {/* Card body */}
        <div style={{ padding: '10px 12px' }}>
          <p
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 300,
              color: 'rgba(196,174,145,0.7)',
              margin: '0 0 8px 0',
            }}
          >
            {project.thesis}
          </p>

          <p
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '9px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 4px 0',
            }}
          >
            {project.artifactLabel}
          </p>

          <pre
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '10px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: active ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)',
              transition: 'color 0.6s ease',
              whiteSpace: 'pre',
              margin: 0,
              overflow: 'hidden',
            }}
          >
            {project.artifact}
          </pre>
        </div>
      </div>
    </div>
  )
}
