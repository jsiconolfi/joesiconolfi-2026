'use client'

import { useEffect, useRef } from 'react'

interface SwirlDotGridProps {
  cols?: number
  rows?: number
  dotSize?: number
  gap?: number
  speed?: number
  className?: string
}

export default function SwirlDotGrid({
  cols = 5,
  rows = 5,
  dotSize = 5,
  gap = 3,
  speed = 0.04,
  className,
}: SwirlDotGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const tickRef = useRef(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    const n = cols * rows
    const cx = (cols - 1) / 2
    const cy = (rows - 1) / 2

    // Pre-compute angle and radius for each dot
    const angles = Array.from({ length: n }, (_, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      return Math.atan2(row - cy, col - cx)
    })

    const radii = Array.from({ length: n }, (_, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      return Math.sqrt((col - cx) ** 2 + (row - cy) ** 2)
    })

    const maxRadius = Math.max(...radii)

    const dots: HTMLSpanElement[] = []
    container.innerHTML = ''

    for (let i = 0; i < n; i++) {
      const dot = document.createElement('span')
      dot.style.cssText = `
        display: block;
        width: ${dotSize}px;
        height: ${dotSize}px;
        border-radius: 50%;
        background: rgba(196,174,145,0.08);
        will-change: background, transform;
      `
      container.appendChild(dot)
      dots.push(dot)
    }

    if (prefersReducedMotion) {
      dots.forEach((dot, i) => {
        const alpha = 0.08 + (1 - radii[i] / maxRadius) * 0.12
        dot.style.background = `rgba(196,174,145,${alpha.toFixed(2)})`
      })
      return
    }

    const TRAIL = 1.8

    function frame() {
      rafRef.current = requestAnimationFrame(frame)
      tickRef.current += speed

      const sweepAngle = tickRef.current % (Math.PI * 2)

      for (let i = 0; i < n; i++) {
        let diff = angles[i] - sweepAngle
        while (diff < -Math.PI) diff += Math.PI * 2
        while (diff > Math.PI) diff -= Math.PI * 2

        const inTrail = diff > -TRAIL && diff < 0.3
        const distFade = Math.max(0.2, 1 - radii[i] / (maxRadius + 0.5))

        let alpha: number

        if (inTrail) {
          const intensity = Math.max(0, 1 - (diff + TRAIL) / TRAIL * 0.4)
          alpha = 0.12 + intensity * 0.88 * distFade

          const hue = ((angles[i] / (Math.PI * 2)) * 240 + tickRef.current * 30) % 360
          dots[i].style.background = `hsla(${hue | 0},55%,68%,${alpha.toFixed(2)})`
          dots[i].style.transform = intensity > 0.6
            ? `scale(${(0.95 + intensity * 0.35).toFixed(3)})`
            : 'scale(1)'
        } else {
          dots[i].style.background = 'rgba(196,174,145,0.06)'
          dots[i].style.transform = 'scale(1)'
        }
      }
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [cols, rows, dotSize, speed])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, ${dotSize}px)`,
        gap: `${gap}px`,
      }}
      aria-hidden="true"
    />
  )
}
