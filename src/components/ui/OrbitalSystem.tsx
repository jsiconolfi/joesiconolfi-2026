'use client'

import { useEffect, useState } from 'react'
import OrbitalCard from './OrbitalCard'
import { PROJECTS } from '@/content/projects'

export default function OrbitalSystem() {
  const [center, setCenter] = useState({ x: 0, y: 0 })
  const [safeRadii, setSafeRadii] = useState({ x: 580, y: 300 })
  const [leftSlots, setLeftSlots] = useState<Array<{ x: number; y: number }>>([])
  const [rightSlots, setRightSlots] = useState<Array<{ x: number; y: number }>>([])
  const [stagingReady, setStagingReady] = useState(false)

  useEffect(() => {
    function measure() {
      const panel = document.getElementById('chat-panel')
      const vw = window.innerWidth
      const vh = window.innerHeight

      setCenter({ x: vw / 2, y: vh / 2 })

      if (panel) {
        const rect = panel.getBoundingClientRect()

        const CARD_W = 220
        const CARD_H = 130
        const GAP = 24
        const SLOT_GAP = 10

        const cardSlotHeight = CARD_H + SLOT_GAP
        const totalHeight = 4 * cardSlotHeight
        const panelMidY = rect.top + rect.height / 2
        const startY = panelMidY - totalHeight / 2

        const leftX = rect.left - CARD_W / 2 - GAP
        const left = Array.from({ length: 4 }, (_, i) => ({
          x: leftX,
          y: startY + i * cardSlotHeight + CARD_H / 2,
        }))

        const rightX = rect.right + CARD_W / 2 + GAP
        const right = Array.from({ length: 4 }, (_, i) => ({
          x: rightX,
          y: startY + i * cardSlotHeight + CARD_H / 2,
        }))

        setLeftSlots(left)
        setRightSlots(right)

        const minRadiusX = rect.width / 2 + CARD_W / 2 + 40
        const minRadiusY = rect.height / 2 + CARD_H / 2 + 40
        const maxRadiusX = vw / 2 - CARD_W / 2 - 16
        const maxRadiusY = vh / 2 - CARD_H / 2 - 16

        setSafeRadii({
          x: Math.min(maxRadiusX, Math.max(minRadiusX, minRadiusX * 1.2)),
          y: Math.min(maxRadiusY, Math.max(minRadiusY, minRadiusY * 1.2)),
        })

        setStagingReady(true)
      }
    }

    measure()

    let timeout: ReturnType<typeof setTimeout>
    function handleResize() {
      clearTimeout(timeout)
      timeout = setTimeout(measure, 200)
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeout)
    }
  }, [])

  // Variance added on top of the safe minimum — never subtracts
  const orbitalVariance = [
    { xVar: 20,  yVar: 10,  speed: 0.032, offset: 0 },
    { xVar: 35,  yVar: 0,   speed: 0.026, offset: 0.79 },
    { xVar: 10,  yVar: 20,  speed: 0.038, offset: 1.57 },
    { xVar: 25,  yVar: 5,   speed: 0.029, offset: 2.36 },
    { xVar: 20,  yVar: 15,  speed: 0.035, offset: 3.14 },
    { xVar: 30,  yVar: 5,   speed: 0.028, offset: 3.93 },
    { xVar: 15,  yVar: 10,  speed: 0.031, offset: 4.71 },
    { xVar: 28,  yVar: 8,   speed: 0.024, offset: 5.50 },
  ]

  if (center.x === 0 || !stagingReady) return null

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {PROJECTS.map((project, i) => {
        const v = orbitalVariance[i]
        const slotIndex = i % 4
        return (
          <OrbitalCard
            key={project.id}
            project={project}
            orbitAngle={0}
            orbitRadiusX={safeRadii.x + v.xVar}
            orbitRadiusY={safeRadii.y + v.yVar}
            orbitSpeed={v.speed}
            orbitOffset={v.offset}
            centerX={center.x}
            centerY={center.y}
            leftSlot={leftSlots[slotIndex] ?? { x: 120, y: center.y }}
            rightSlot={rightSlots[slotIndex] ?? { x: vw - 120, y: center.y }}
          />
        )
      })}
    </div>
  )
}
