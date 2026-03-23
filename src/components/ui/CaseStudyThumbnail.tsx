'use client'

import { useRef, useEffect } from 'react'
import type { FeaturedProject } from '@/content/featured-projects'

export default function CaseStudyThumbnail({ project }: { project: FeaturedProject }) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playingRef = useRef(false)
  const seekingRef = useRef(false)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current
    if (!wrapper || !video) return

    function onEnter() {
      if (playingRef.current) return
      playingRef.current = true

      // Update border directly — no React re-render
      wrapper!.style.borderColor = 'rgba(255,255,255,0.15)'

      // Only seek if not already at start
      if (!seekingRef.current && video!.currentTime > 0.1) {
        seekingRef.current = true
        video!.currentTime = 0
        video!.addEventListener('seeked', () => {
          seekingRef.current = false
          video!.play().catch(() => {})
        }, { once: true })
      } else {
        video!.play().catch(() => {})
      }
    }

    function onLeave() {
      playingRef.current = false
      wrapper!.style.borderColor = 'rgba(255,255,255,0.06)'
      video!.pause()
      // Defer reset to avoid seek collision when switching quickly
      requestAnimationFrame(() => {
        if (!playingRef.current) {
          video!.currentTime = 0
        }
      })
    }

    wrapper.addEventListener('mouseenter', onEnter, { passive: true })
    wrapper.addEventListener('mouseleave', onLeave, { passive: true })
    return () => {
      wrapper.removeEventListener('mouseenter', onEnter)
      wrapper.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        width: 64,
        height: 48,
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.06)',
        // Promote to compositor layer — isolates from swirl canvas compositing
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      <video
        ref={videoRef}
        src={project.video}
        muted
        playsInline
        loop
        preload="metadata"
        onLoadedMetadata={() => {
          if (videoRef.current) videoRef.current.currentTime = 0
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          // Own compositor layer — video decode isolated from canvas
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  )
}
