'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { usePathname } from 'next/navigation'
import OrbitalCard, { type OrbitalCardHandle } from './OrbitalCard'
import { PROJECTS } from '@/content/projects'
import { useIsMobile } from '@/hooks/useIsMobile'
import { ORBIT_STAGING_EVENT, type OrbitStagingDetail } from '@/lib/orbitalStaging'

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

// Session 94 — ambient float: slow cycles, small amplitude, index-based phases so cards never drift in sync
const DRIFT_PHASE_STEP = (Math.PI * 2) / 10
const DRIFT_CONFIGS = [
  { xAmp: 10, yAmp: 12, xSpeed: 0.0003, ySpeed: 0.00028, phase: 0 * DRIFT_PHASE_STEP },
  { xAmp: 12, yAmp: 10, xSpeed: 0.00032, ySpeed: 0.0003, phase: 1 * DRIFT_PHASE_STEP },
  { xAmp: 8, yAmp: 14, xSpeed: 0.00028, ySpeed: 0.00032, phase: 2 * DRIFT_PHASE_STEP },
  { xAmp: 14, yAmp: 8, xSpeed: 0.0003, ySpeed: 0.00029, phase: 3 * DRIFT_PHASE_STEP },
  { xAmp: 11, yAmp: 13, xSpeed: 0.00031, ySpeed: 0.00027, phase: 4 * DRIFT_PHASE_STEP },
  { xAmp: 13, yAmp: 9, xSpeed: 0.00029, ySpeed: 0.00031, phase: 5 * DRIFT_PHASE_STEP },
  { xAmp: 9, yAmp: 12, xSpeed: 0.0003, ySpeed: 0.0003, phase: 6 * DRIFT_PHASE_STEP },
  { xAmp: 12, yAmp: 11, xSpeed: 0.00027, ySpeed: 0.00033, phase: 7 * DRIFT_PHASE_STEP },
  { xAmp: 10, yAmp: 10, xSpeed: 0.00033, ySpeed: 0.00028, phase: 8 * DRIFT_PHASE_STEP },
  { xAmp: 14, yAmp: 11, xSpeed: 0.00028, ySpeed: 0.0003, phase: 9 * DRIFT_PHASE_STEP },
]

const CARD_W = 220
const CARD_H = 160
/** Session 93 — gap between chat panel edge and docked card's nearest edge (half card-width; was full CARD_W) */
const DOCK_GAP = CARD_W / 2
/** Session 93 — vertical spacing between stacked dock centers when multiple cards activate on the same side */
const STAGGER = CARD_H + 16
/**
 * Must match `VIEWPORT_MARGIN` in `OrbitalCard.tsx` — same center bounds as runtime `tick` clamp
 * (minY = MARGIN + CARD_H/2, maxY = vh - MARGIN - CARD_H/2, etc.)
 */
const HOME_MARGIN = 16

// Clamp a percentage-based position so the card stays fully on screen
function clampHome(xPct: number, yPct: number, vw: number, vh: number) {
  const rawX = xPct * vw
  const rawY = yPct * vh
  const minX = CARD_W / 2 + HOME_MARGIN
  const maxX = vw - CARD_W / 2 - HOME_MARGIN
  const minY = CARD_H / 2 + HOME_MARGIN
  const maxY = vh - CARD_H / 2 - HOME_MARGIN
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
  const [ready, setReady] = useState(false)

  /** Session 93 — batch `portfolio:project-active` in one microtask so multi-mention stagger works */
  const activationQueueRef = useRef<string[]>([])
  const activationFlushScheduledRef = useRef(false)

  // Shared positions for Session 93 staging (left/right dock from live card center x) — not collision.
  // Updated each frame via `onPositionUpdate`; ref (not state) so updates never trigger re-renders.
  const positionsRef = useRef<Array<{ x: number; y: number }>>(
    Array.from({ length: 10 }, () => ({ x: 0, y: 0 }))
  )

  /** Imperative `tick` targets — filled by each `OrbitalCard` ref; driven by one shared RAF below. */
  const cardTickRefs = useRef<Array<OrbitalCardHandle | null>>(new Array(10).fill(null))

  /** Session 90 — which card’s video is currently active for single-playback coordination */
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)
  /** Session 99 — delayed leave pause; cancel if pointer re-enters within 80ms (Session 102: never `video.style.opacity`) */
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isHome = pathname === '/'

  const handlePositionUpdate = useCallback((index: number, x: number, y: number) => {
    positionsRef.current[index].x = x
    positionsRef.current[index].y = y
  }, [])

  const handleOrbitalVideoHover = useCallback((index: number) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current)
      leaveTimerRef.current = null
    }

    const prevVideo = activeVideoRef.current
    const newVideo = cardTickRefs.current[index]?.getVideoElement() ?? null

    // Same card re-entered before delayed leave hide — still visible; keep playback
    if (prevVideo && prevVideo === newVideo) {
      return
    }

    if (prevVideo && prevVideo !== newVideo) {
      requestAnimationFrame(() => {
        prevVideo.pause()
      })
    }

    activeVideoRef.current = newVideo
    if (newVideo) {
      newVideo.currentTime = 0
      if (newVideo.readyState >= 2) {
        newVideo.play().catch(() => {})
      } else {
        newVideo.addEventListener('canplay', () => newVideo.play().catch(() => {}), { once: true })
      }
    }
  }, [])

  const handleOrbitalVideoLeave = useCallback((index: number) => {
    const vid = cardTickRefs.current[index]?.getVideoElement() ?? null
    if (!vid || activeVideoRef.current !== vid) return

    leaveTimerRef.current = setTimeout(() => {
      const video = activeVideoRef.current
      activeVideoRef.current = null
      if (video) {
        requestAnimationFrame(() => {
          video.pause()
          // Session 99: do not reset currentTime on leave
        })
      }
      leaveTimerRef.current = null
    }, 80)
  }, [])

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current)
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

  /** Session 93 — compute dock center targets in physics space (card center = posRef x/y), batch multi-mention stagger */
  useEffect(() => {
    function cardCenterXForIndex(idx: number, vw: number, vh: number): number {
      const pos = positionsRef.current[idx]
      if (pos.x !== 0 || pos.y !== 0) return pos.x
      const raw = HOME_POSITIONS[idx]
      const home = clampHome(raw.xPct, raw.yPct, vw, vh)
      return home.x
    }

    function flushActivationQueue() {
      const queued = activationQueueRef.current
      activationQueueRef.current = []
      if (queued.length === 0) return

      const vw = window.innerWidth
      const vh = window.innerHeight
      const panel = document.getElementById('chat-panel')
      if (!panel) return

      const rect = panel.getBoundingClientRect()
      const leftDockCenterX = rect.left - DOCK_GAP - CARD_W / 2
      const rightDockCenterX = rect.right + DOCK_GAP + CARD_W / 2
      const dockCY = vh / 2

      const seen = new Set<string>()
      const ids: string[] = []
      for (const id of queued) {
        if (seen.has(id)) continue
        seen.add(id)
        ids.push(id)
      }

      const leftIds: string[] = []
      const rightIds: string[] = []
      for (const projectId of ids) {
        const idx = shuffledProjects.findIndex(p => p.id === projectId)
        if (idx < 0) continue
        const cx = cardCenterXForIndex(idx, vw, vh)
        if (cx < vw / 2) leftIds.push(projectId)
        else rightIds.push(projectId)
      }

      function emitSide(group: string[], dockCenterX: number) {
        const n = group.length
        for (let i = 0; i < n; i++) {
          const centerY = dockCY + (i - (n - 1) / 2) * STAGGER
          window.dispatchEvent(
            new CustomEvent<OrbitStagingDetail>(ORBIT_STAGING_EVENT, {
              detail: { projectId: group[i], centerX: dockCenterX, centerY },
            })
          )
        }
      }

      emitSide(leftIds, leftDockCenterX)
      emitSide(rightIds, rightDockCenterX)
    }

    function onProjectActive(e: Event) {
      const ev = e as CustomEvent<{ projectId: string }>
      const id = ev.detail?.projectId
      if (!id) return
      activationQueueRef.current.push(id)
      if (activationFlushScheduledRef.current) return
      activationFlushScheduledRef.current = true
      queueMicrotask(() => {
        activationFlushScheduledRef.current = false
        flushActivationQueue()
      })
    }

    window.addEventListener('portfolio:project-active', onProjectActive)
    return () => window.removeEventListener('portfolio:project-active', onProjectActive)
  }, [shuffledProjects])

  if (isMobile) return null
  if (!ready || viewport.w === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {shuffledProjects.map((project, i) => {
        const raw = HOME_POSITIONS[i]
        const home = clampHome(raw.xPct, raw.yPct, viewport.w, viewport.h)
        const drift = DRIFT_CONFIGS[i]
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
            cardIndex={i}
            onPositionUpdate={handlePositionUpdate}
            onVideoHover={handleOrbitalVideoHover}
            onVideoLeave={handleOrbitalVideoLeave}
          />
        )
      })}
    </div>
  )
}
