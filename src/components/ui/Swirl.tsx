'use client'

import { useEffect, useRef } from 'react'

interface SwirlProps {
  className?: string
}

// Constants that never vary per-particle — no reason to store on each object
const ANG_SPEED = 0.04
const INC_SPEED = 2.5
const CELL = 10 // grid cell size in px
const CHARS = ['0', '1'] // pre-allocated, no inline ternary allocation per draw

// Canvas background that callers should set via CSS on the parent element:
// bg-[#161a22] — extracted from the existing site CSS.
// The canvas itself is transparent; the background lives in the DOM behind it.

// How quickly old characters fade out each frame.
// destination-out composite erases toward transparency rather than painting
// a dark color — lets the CSS background show through cleanly.
// 0.07 clears ghost characters fast enough that only the active colored
// spiral arms are visible. Lower values (e.g. 0.012) leave a gray residue
// across the whole canvas. Raise toward 0.15 for even shorter trails,
// lower toward 0.03 for longer persistence.
const FADE_ALPHA = 0.18

// Particle cap scales with device capability.
// Mobile CPUs are significantly weaker — half the particle count keeps it smooth.
const MAX_PARTICLES = typeof window !== 'undefined' && window.innerWidth < 768 ? 50 : 100

interface ParticleState {
  radian: number
  radius: number
  x: number
  y: number
}

function createParticle(): ParticleState {
  return {
    radian: Math.random() * Math.PI * 2,
    radius: 0,
    x: 0,
    y: 0,
  }
}

function resetParticle(p: ParticleState): void {
  p.radian = Math.random() * Math.PI * 2
  p.radius = 0
  p.x = 0
  p.y = 0
}

export default function Swirl({ className }: SwirlProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // willReadFrequently: false — we never read pixels back, hint to browser
    // to keep the canvas on GPU rather than CPU-accessible memory
    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // devicePixelRatio — makes the canvas crisp on retina/HiDPI screens.
    // We scale the canvas backing store up by dpr, then scale the context
    // down so all draw calls still use CSS pixel units.
    const dpr = window.devicePixelRatio ?? 1

    let animFrameId: number
    let resizeTimeout: ReturnType<typeof setTimeout>
    let tick = 0
    let lastTime = 0
    let hidden = false // tracks Page Visibility API state

    // Energy level — 0 = idle, 1 = fully active. Decays each frame.
    // Driven by 'swirl:keypress' CustomEvents from the chat input.
    let energy = 0
    const ENERGY_DECAY = 0.018   // how fast energy falls per frame — tune this
    const ENERGY_BOOST = 0.8     // how much each keypress adds

    let w = window.innerWidth
    let h = window.innerHeight
    let maxRadius = Math.sqrt((w * w) / 4 + (h * h) / 4)

    function setupCanvas(): void {
      // Physical pixels = CSS pixels × dpr
      // Non-null assertions: canvas/ctx are guaranteed non-null by the early-return
      // guards above, but TypeScript doesn't narrow across inner function declarations.
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      // Scale down so draw calls use CSS px coordinates throughout
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.font = `${CELL}px monospace`
    }

    setupCanvas()

    function handleKeyInput(): void {
      energy = Math.min(1, energy + ENERGY_BOOST)
    }
    window.addEventListener('swirl:keypress', handleKeyInput)

    // --- Particle step — inlined for minimal call overhead in hot path ---

    function stepParticle(p: ParticleState): void {
      const prevX = p.x
      const prevY = p.y

      p.radian += ANG_SPEED
      p.radius += INC_SPEED
      p.x = p.radius * Math.cos(p.radian)
      p.y = p.radius * Math.sin(p.radian)

      const dx = p.x - prevX
      const dy = p.y - prevY
      const len = Math.sqrt(dx * dx + dy * dy)

      // cx/cy cached outside the inner loop — avoids two divisions per cell
      const cx = w / 2
      const cy = h / 2

      for (let i = 0; i <= len; i += CELL) {
        const px = Math.trunc((prevX + (dx * i) / len) / CELL) * CELL
        const py = Math.trunc((prevY + (dy * i) / len) / CELL) * CELL

        // Character — hue drifts with position + tick for the colour cycle.
        // Under energy, hue shifts toward 157 (#00ff9f), sat → 100%, lit → 50%.
        // naturalHue is unbounded (tick accumulates), so normalize to 0–360
        // before lerping — otherwise the lerp overshoots to wrong intermediate hues.
        const rawHue = (px / w) * 240 + (py / h) * 240 + tick
        const baseHue = ((rawHue % 360) + 360) % 360
        // Short-path lerp around the color wheel so we always go the nearest way
        let delta = 157 - baseHue
        if (delta > 180) delta -= 360
        if (delta < -180) delta += 360
        const hue = baseHue + delta * energy
        const sat = 70 + energy * 30   // 70% idle → 100% active
        const lit = 70 - energy * 20   // 70% idle → 50% active (#00ff9f target)
        const alpha = 0.45 + energy * 0.40  // 0.45 idle → 0.85 active
        ctx!.fillStyle = `hsla(${hue | 0},${sat | 0}%,${lit | 0}%,${alpha.toFixed(2)})`
        ctx!.fillText(CHARS[(Math.random() * 2) | 0], cx + px, cy + py)
      }

      if (p.radius >= maxRadius) resetParticle(p)
    }

    // --- Reduced motion: static snapshot, no RAF ---

    if (prefersReducedMotion) {
      const staticCount = 40
      for (let i = 0; i < staticCount; i++) {
        const p = createParticle()
        p.radius = Math.random() * maxRadius * 0.8
        p.x = p.radius * Math.cos(p.radian)
        p.y = p.radius * Math.sin(p.radian)
        const px = Math.trunc(p.x / CELL) * CELL
        const py = Math.trunc(p.y / CELL) * CELL
        const hue = (px / w) * 240 + (py / h) * 240
        ctx.fillStyle = `hsla(${hue | 0},70%,70%,.45)`
        ctx.fillText(CHARS[(Math.random() * 2) | 0], w / 2 + px, h / 2 + py)
      }

      return
    }

    // --- Live animation ---

    const particles: ParticleState[] = []

    function anim(currentTime: number): void {
      animFrameId = window.requestAnimationFrame(anim)

      // Skip frames when tab is not visible — saves CPU/battery entirely
      if (hidden) return

      // ~60fps cap — avoids running faster on high-refresh displays
      if (currentTime - lastTime < 16) return
      lastTime = currentTime

      tick++

      // Decay energy toward 0 each frame
      if (energy > 0) {
        energy = Math.max(0, energy - ENERGY_DECAY)
      }

      // Fade existing characters toward transparent using destination-out.
      // This erases canvas content rather than painting over it with a dark color,
      // so the CSS background shows through. source-over is restored immediately
      // after so character draws composite normally on top.
      ctx!.globalCompositeOperation = 'destination-out'
      ctx!.fillStyle = `rgba(0,0,0,${FADE_ALPHA})`
      ctx!.fillRect(0, 0, w, h)
      ctx!.globalCompositeOperation = 'source-over'

      if (particles.length < MAX_PARTICLES && Math.random() < 0.3) {
        particles.push(createParticle())
      }

      // for loop is marginally faster than forEach in tight animation loops
      for (let i = 0; i < particles.length; i++) {
        stepParticle(particles[i])
      }
    }

    animFrameId = window.requestAnimationFrame(anim)

    // --- Page Visibility API — pause when tab is hidden ---

    function handleVisibilityChange(): void {
      hidden = document.hidden
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // --- Resize ---

    function handleResize(): void {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        w = window.innerWidth
        h = window.innerHeight
        maxRadius = Math.sqrt((w * w) / 4 + (h * h) / 4)
        setupCanvas()
      }, 250)
    }

    window.addEventListener('resize', handleResize)

    // --- Cleanup ---

    return () => {
      window.cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('swirl:keypress', handleKeyInput)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearTimeout(resizeTimeout)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}
