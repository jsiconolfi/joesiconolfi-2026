'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import OrbitalCard, { type OrbitalCardHandle } from './OrbitalCard'
import { PROJECTS } from '@/content/projects'
import { useIsMobile } from '@/hooks/useIsMobile'

// Fisher-Yates shuffle — runs once, result is stable for the session
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Home positions as percentage of viewport (vw%, vh%)
// These are carefully chosen to surround the centered chat panel
// without overlapping it. Panel is roughly 45% wide, centered.
// Left edge of panel ≈ 27.5vw, right edge ≈ 72.5vw
const HOME_POSITIONS = [
  // Left column — 3 cards staggered vertically
  { xPct: 0.08, yPct: 0.18 },  // Waypoint       — top left
  { xPct: 0.06, yPct: 0.50 },  // Sherpa         — mid left
  { xPct: 0.10, yPct: 0.80 },  // waypoint-sync  — bottom left

  // Right column — 3 cards staggered vertically
  { xPct: 0.88, yPct: 0.18 },  // Channel        — top right
  { xPct: 0.90, yPct: 0.50 },  // Statespace     — mid right
  { xPct: 0.86, yPct: 0.80 },  // Mushroom       — bottom right

  // Top strip — 2 cards above the panel
  { xPct: 0.25, yPct: 0.06 },  // Seudo          — top center-left
  { xPct: 0.72, yPct: 0.06 },  // Kernel         — top center-right

  // Bottom strip — 2 cards below the panel
  { xPct: 0.25, yPct: 0.92 },  // Wafer          — bottom center-left
  { xPct: 0.72, yPct: 0.92 },  // Cohere Labs    — bottom center-right
]

// Drift parameters — each card drifts with unique phase and amplitude
// Drift is purely visual, small enough that cards never leave their quadrant
const DRIFT_CONFIGS = [
  { xAmp: 18, yAmp: 22, xSpeed: 0.0008, ySpeed: 0.0006, phase: 0.0 },
  { xAmp: 22, yAmp: 16, xSpeed: 0.0007, ySpeed: 0.0009, phase: 1.1 },
  { xAmp: 14, yAmp: 20, xSpeed: 0.0009, ySpeed: 0.0007, phase: 2.2 },
  { xAmp: 20, yAmp: 18, xSpeed: 0.0006, ySpeed: 0.0008, phase: 3.3 },
  { xAmp: 16, yAmp: 24, xSpeed: 0.0010, ySpeed: 0.0006, phase: 4.4 },
  { xAmp: 24, yAmp: 14, xSpeed: 0.0007, ySpeed: 0.0010, phase: 5.5 },
  { xAmp: 20, yAmp: 18, xSpeed: 0.0008, ySpeed: 0.0007, phase: 0.7 },
  { xAmp: 16, yAmp: 22, xSpeed: 0.0009, ySpeed: 0.0008, phase: 1.8 },
  { xAmp: 22, yAmp: 16, xSpeed: 0.0007, ySpeed: 0.0009, phase: 2.9 },
  { xAmp: 18, yAmp: 20, xSpeed: 0.0008, ySpeed: 0.0007, phase: 4.0 },
]

const CARD_W = 220
const CARD_H = 160
const STAGE_GAP = 12
const EDGE_PAD = 12

// Clamp a percentage-based position so the card stays fully on screen
function clampHome(xPct: number, yPct: number, vw: number, vh: number) {
  const rawX = xPct * vw
  const rawY = yPct * vh
  const minX = CARD_W / 2 + EDGE_PAD
  const maxX = vw - CARD_W / 2 - EDGE_PAD
  const minY = CARD_H / 2 + EDGE_PAD
  const maxY = vh - CARD_H / 2 - EDGE_PAD
  return {
    x: Math.max(minX, Math.min(maxX, rawX)),
    y: Math.max(minY, Math.min(maxY, rawY)),
  }
}

export default function OrbitalSystem() {
  const isMobile = useIsMobile()
  const shuffledProjects = useMemo(() => shuffleArray(PROJECTS), [])
  const pathname = usePathname()
  const [viewport, setViewport] = useState({ w: 0, h: 0 })
  const [leftSlots, setLeftSlots] = useState<Array<{ x: number; y: number }>>([])
  const [rightSlots, setRightSlots] = useState<Array<{ x: number; y: number }>>([])
  const [ready, setReady] = useState(false)

  // Shared mutable ref — updated every frame by each card.
  // Using a ref (not state) so updates never trigger re-renders.
  const positionsRef = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: 10 }, () => ({ x: 0, y: 0 }))
  )

  /** Imperative `tick` targets — filled by each `OrbitalCard` ref; driven by one shared RAF below. */
  const cardTickRefs = useRef<Array<OrbitalCardHandle | null>>(new Array(10).fill(null))

  /** Session 90 — at most one orbital MP4 decoding at a time */
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)

  const isHome = pathname === '/'

  const handlePositionUpdate = useCallback((index: number, x: number, y: number) => {
    positionsRef.current[index].x = x
    positionsRef.current[index].y = y
  }, [])

  const handleOrbitalVideoHover = useCallback((index: number) => {
    const next = cardTickRefs.current[index]?.getVideoElement() ?? null
    if (activeVideoRef.current && activeVideoRef.current !== next) {
      activeVideoRef.current.pause()
      activeVideoRef.current.currentTime = 0
    }
    if (next) {
      activeVideoRef.current = next
      next.currentTime = 0
      if (next.readyState >= 2) {
        next.play().catch(() => {})
      } else {
        next.addEventListener('canplay', () => next.play().catch(() => {}), { once: true })
      }
    } else {
      activeVideoRef.current = null
    }
  }, [])

  const handleOrbitalVideoLeave = useCallback((index: number) => {
    const vid = cardTickRefs.current[index]?.getVideoElement() ?? null
    if (vid && activeVideoRef.current === vid) {
      vid.pause()
      vid.currentTime = 0
      activeVideoRef.current = null
    }
  }, [])

  /** Session 87 — single RAF schedules all cards; Session 90 — pause off homepage */
  useEffect(() => {
    if (isMobile || !isHome || !ready || viewport.w === 0) return

    let rafId = 0
    function loop() {
      const now = performance.now()
      const refs = cardTickRefs.current
      for (let i = 0; i < refs.length; i++) {
        refs[i]?.tick(now)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [isMobile, isHome, ready, viewport.w])

  useEffect(() => {
    function measure() {
      const vw = window.innerWidth
      const vh = window.innerHeight
      setViewport({ w: vw, h: vh })

      const panel = document.getElementById('chat-panel')
      if (panel) {
        const rect = panel.getBoundingClientRect()
        const panelMidY = rect.top + rect.height / 2
        const slotH = CARD_H + STAGE_GAP
        const totalH = 5 * slotH
        const startY = panelMidY - totalH / 2

        const lx = rect.left - CARD_W / 2 - 16
        const rx = rect.right + CARD_W / 2 + 16

        setLeftSlots(
          Array.from({ length: 5 }, (_, i) => ({
            x: lx,
            y: startY + i * slotH + CARD_H / 2,
          }))
        )
        setRightSlots(
          Array.from({ length: 5 }, (_, i) => ({
            x: rx,
            y: startY + i * slotH + CARD_H / 2,
          }))
        )
        setReady(true)
      }
    }

    // Immediate measure — works on homepage first load and on resize
    measure()

    // Delayed measure to catch chat-panel after page transition animation completes
    // (AnimatePresence mode="wait" delays the enter animation by ~450ms)
    const delayedMeasure = setTimeout(measure, 600)

    let t: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(t)
      t = setTimeout(measure, 200)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(t)
      clearTimeout(delayedMeasure)
    }
  }, [pathname])

  if (isMobile) return null
  if (!ready || viewport.w === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {shuffledProjects.map((project, i) => {
        const raw = HOME_POSITIONS[i]
        const home = clampHome(raw.xPct, raw.yPct, viewport.w, viewport.h)
        const drift = DRIFT_CONFIGS[i]
        const slotIndex = i % 5
        return (
          <OrbitalCard
            key={project.id}
            ref={el => {
              cardTickRefs.current[i] = el
            }}
            project={project}
            homeX={home.x}
            homeY={home.y}
            driftXAmp={drift.xAmp}
            driftYAmp={drift.yAmp}
            driftXSpeed={drift.xSpeed}
            driftYSpeed={drift.ySpeed}
            driftPhase={drift.phase}
            leftSlot={leftSlots[slotIndex] ?? { x: 140, y: viewport.h / 2 }}
            rightSlot={rightSlots[slotIndex] ?? { x: viewport.w - 140, y: viewport.h / 2 }}
            cardIndex={i}
            onPositionUpdate={handlePositionUpdate}
            positionsRef={positionsRef}
            onVideoHover={handleOrbitalVideoHover}
            onVideoLeave={handleOrbitalVideoLeave}
          />
        )
      })}
    </div>
  )
}
