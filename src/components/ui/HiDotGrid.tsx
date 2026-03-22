'use client'

import { useEffect, useRef } from 'react'

interface HiDotGridProps {
  dotSize?: number
  gap?: number
  speed?: number
  className?: string
}

// 5×5 grid — 1 = active (part of H or I letterform), 0 = inactive
// H: left leg col 0, crossbar col 1 (row 2 only), right leg col 2
// I: col 4 — col 3 is the gap
const HI_PATTERN = [
  1, 0, 1, 0, 1,
  1, 0, 1, 0, 0,
  1, 1, 1, 0, 1,
  1, 0, 1, 0, 1,
  1, 0, 1, 0, 1,
]

const COLS = 5
const ROWS = 5
const N = COLS * ROWS

export default function HiDotGrid({
  dotSize = 5,
  gap = 3,
  speed = 1.2,
  className,
}: HiDotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const tickRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Build dot elements imperatively — avoids React re-render on every frame
    const dots: HTMLSpanElement[] = []
    container.innerHTML = ''

    for (let i = 0; i < N; i++) {
      const dot = document.createElement('span')
      dot.style.cssText = `
        display: block;
        width: ${dotSize}px;
        height: ${dotSize}px;
        border-radius: 50%;
        will-change: background, transform;
        transition: background 0.06s ease;
      `
      container.appendChild(dot)
      dots.push(dot)
    }

    if (prefersReducedMotion) {
      dots.forEach((dot, i) => {
        dot.style.background = HI_PATTERN[i]
          ? 'rgba(196,174,145,0.7)'
          : 'rgba(196,174,145,0.08)'
      })
      return
    }

    function frame() {
      rafRef.current = requestAnimationFrame(frame)
      tickRef.current += 0.016

      dots.forEach((dot, i) => {
        if (!HI_PATTERN[i]) {
          dot.style.background = 'rgba(196,174,145,0.06)'
          dot.style.transform = ''
          return
        }

        const col = i % COLS

        // Phase: wave drifts left to right across the letterform
        const phase = col * 0.6 - tickRef.current * speed
        const v = 0.5 + 0.5 * Math.sin(phase)

        // Opacity: 0.15 at trough, 0.95 at peak
        const alpha = 0.15 + 0.8 * v

        // Hue: warm amber/gold range — clamped to 20–80deg, no full rainbow
        const hue = (20 + col * 10 + tickRef.current * 18) % 60 + 20
        const sat = 45 + v * 15   // 45–60% saturation
        const lit = 65 + v * 10   // 65–75% lightness

        dot.style.background = `hsla(${hue | 0},${sat | 0}%,${lit | 0}%,${alpha.toFixed(2)})`
        dot.style.transform = v > 0.75 ? `scale(${(1 + v * 0.15).toFixed(2)})` : 'scale(1)'
      })
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [dotSize, speed])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, ${dotSize}px)`,
        gap: `${gap}px`,
      }}
      aria-hidden="true"
    />
  )
}
