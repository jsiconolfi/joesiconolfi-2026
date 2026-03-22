'use client'

import { useRef, useState } from 'react'
import type { FeaturedProject } from '@/content/featured-projects'

interface CaseStudyThumbnailProps {
  project: FeaturedProject
}

export default function CaseStudyThumbnail({ project }: CaseStudyThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)

  function handleLoadedMetadata() {
    if (videoRef.current) videoRef.current.currentTime = 0
  }

  function handleMouseEnter() {
    setHovered(true)
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.play().catch(() => {})
  }

  function handleMouseLeave() {
    setHovered(false)
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.currentTime = 0
  }

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: 64,
        height: 48,
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: hovered
          ? '1px solid rgba(255,255,255,0.15)'
          : '1px solid rgba(255,255,255,0.06)',
        transition: 'border 0.2s ease',
      }}
    >
      <video
        ref={videoRef}
        src={project.video}
        muted
        playsInline
        loop
        preload="metadata"
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />
    </div>
  )
}
