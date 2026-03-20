'use client'

import { useEffect, useState } from 'react'
import OrbitalCard from './OrbitalCard'
import { PROJECTS } from '@/content/projects'

const CARD_WIDTH = 220
const CARD_HEIGHT = 110
const MARGIN = 60

export default function OrbitalSystem() {
  const [center, setCenter] = useState({ x: 0, y: 0 })
  const [safeRadii, setSafeRadii] = useState({ x: 580, y: 300 })

  useEffect(() => {
    function measure() {
      const panel = document.getElementById('chat-panel')
      const vw = window.innerWidth
      const vh = window.innerHeight

      setCenter({ x: vw / 2, y: vh / 2 })

      const maxRadiusX = vw / 2 - CARD_WIDTH / 2 - 20
      const maxRadiusY = vh / 2 - CARD_HEIGHT / 2 - 20

      if (panel) {
        const rect = panel.getBoundingClientRect()
        const minRadiusX = rect.width / 2 + CARD_WIDTH / 2 + MARGIN
        const minRadiusY = rect.height / 2 + CARD_HEIGHT / 2 + MARGIN
        setSafeRadii({
          x: Math.min(maxRadiusX, Math.max(minRadiusX, maxRadiusX * 0.72)),
          y: Math.min(maxRadiusY, Math.max(minRadiusY, maxRadiusY * 0.72)),
        })
      } else {
        setSafeRadii({
          x: Math.min(maxRadiusX, vw * 0.36),
          y: Math.min(maxRadiusY, vh * 0.36),
        })
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

  if (center.x === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {PROJECTS.map((project, i) => {
        const v = orbitalVariance[i]
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
          />
        )
      })}
    </div>
  )
}
