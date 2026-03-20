'use client'

import { useEffect, useRef, useState } from 'react'
import type { Project } from '@/content/projects'

const CARD_WIDTH = 220
const CARD_HEIGHT_EST = 110

interface OrbitalCardProps {
  project: Project
  orbitAngle: number
  orbitRadiusX: number
  orbitRadiusY: number
  orbitSpeed: number
  orbitOffset: number
  centerX: number
  centerY: number
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
}: OrbitalCardProps) {
  const [active, setActive] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const angleRef = useRef(orbitAngle + orbitOffset)
  const rafRef = useRef<number | undefined>(undefined)
  const deactivateTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    function handleSignal(e: Event) {
      const event = e as CustomEvent<{ projectId: string }>
      if (event.detail.projectId === project.id) {
        setActive(true)
        clearTimeout(deactivateTimer.current)
        deactivateTimer.current = setTimeout(() => setActive(false), 4000)
      }
    }
    window.addEventListener('portfolio:project-active', handleSignal)
    return () => window.removeEventListener('portfolio:project-active', handleSignal)
  }, [project.id])

  useEffect(() => {
    let lastTime = performance.now()

    function frame(now: number) {
      const delta = (now - lastTime) / 1000
      lastTime = now
      angleRef.current += orbitSpeed * delta

      const radiusMultiplier = active ? 0.85 : 1
      let x = centerX + Math.cos(angleRef.current) * orbitRadiusX * radiusMultiplier
      let y = centerY + Math.sin(angleRef.current) * orbitRadiusY * radiusMultiplier

      // When active: clamp to viewport so card is always visible
      if (active) {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const halfW = CARD_WIDTH / 2 + 12
        const halfH = CARD_HEIGHT_EST / 2 + 12
        x = Math.max(halfW, Math.min(vw - halfW, x))
        y = Math.max(halfH, Math.min(vh - halfH, y))
      }

      setPosition({ x, y })
      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current !== undefined) cancelAnimationFrame(rafRef.current)
    }
  }, [centerX, centerY, orbitRadiusX, orbitRadiusY, orbitSpeed, active])

  return (
    <div
      className="absolute pointer-events-auto"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        width: '220px',
        opacity: active ? 1 : 0.22,
        transition: 'opacity 0.6s ease',
        zIndex: active ? 15 : 5,
      }}
    >
      {active && (
        <div
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{
            backgroundColor: '#00ff9f',
            boxShadow: '0 0 6px #00ff9f',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      )}

      <div
        className="rounded-lg overflow-hidden"
        style={{
          backgroundColor: 'rgba(22, 26, 34, 0.75)',
          backdropFilter: 'blur(5px)',
          WebkitBackdropFilter: 'blur(5px)',
          boxShadow: active
            ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,255,159,0.25)'
            : '0 8px 32px rgba(0,0,0,0.3)',
          border: active
            ? '1px solid rgba(0,255,159,0.3)'
            : '1px solid rgba(255,255,255,0.06)',
          transition: 'border 0.6s ease, box-shadow 0.6s ease',
        }}
      >
        <div
          className="px-3 py-2 flex items-center justify-between gap-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="font-mono text-xs font-normal text-white truncate">
            {project.name}
          </span>
          <span
            className="font-mono text-xs font-light truncate"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {project.thesis}
          </span>
        </div>

        <div className="px-3 py-2.5">
          <p
            className="font-mono text-xs font-light mb-1.5"
            style={{ color: 'rgba(196,174,145,0.5)' }}
          >
            {project.artifactLabel}
          </p>
          <pre
            className="font-mono text-xs font-light leading-relaxed"
            style={{
              color: active ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.35)',
              transition: 'color 0.6s ease',
              whiteSpace: 'pre',
              margin: 0,
            }}
          >
            {project.artifact}
          </pre>
        </div>
      </div>
    </div>
  )
}
