'use client'

import { useEffect, useRef } from 'react'
import type { FeaturedProject } from '@/content/featured-projects'

interface CaseStudyThumbnailProps {
  project: FeaturedProject
  active: boolean  // driven by parent row hover — plays when true, pauses when false
}

export default function CaseStudyThumbnail({ project, active }: CaseStudyThumbnailProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const seekingRef = useRef(false)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const video = videoRef.current
    if (!wrapper || !video) return

    wrapper.style.borderColor = active
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(255,255,255,0.06)'

    if (active) {
      if (!seekingRef.current && video.currentTime > 0.1) {
        seekingRef.current = true
        video.currentTime = 0
        video.addEventListener('seeked', () => {
          seekingRef.current = false
          video.play().catch(() => {})
        }, { once: true })
      } else {
        video.play().catch(() => {})
      }
    } else {
      video.pause()
      requestAnimationFrame(() => {
        if (!active) video.currentTime = 0
      })
    }
  }, [active])

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
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  )
}
