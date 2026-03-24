'use client'

import { useEffect, useRef } from 'react'
import ChatPanel from '@/components/ui/ChatPanel'
import { useChatContext } from '@/context/ChatContext'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function ChatOverlay() {
  const isMobile = useIsMobile()
  const { isOpen, close } = useChatContext()
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, close])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div
      aria-modal="true"
      aria-label="Chat panel"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-20"
      style={{
        opacity: isOpen ? 1 : 0,
        // visibility: hidden blocks pointer events on the entire subtree,
        // including children that re-declare pointer-events: auto.
        // Delay visibility on close so the opacity fade-out is visible first.
        visibility: isOpen ? 'visible' : 'hidden',
        transition: isOpen
          ? 'opacity 0.2s ease, visibility 0s linear 0s'
          : 'opacity 0.2s ease, visibility 0s linear 0.2s',
      }}
    >
      {/* Backdrop — click to close */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel — elevated above backdrop */}
      <div
        ref={panelRef}
        className={isMobile ? 'relative z-10 w-full' : 'relative z-10 w-full max-w-2xl'}
        style={{
          transform: isOpen ? 'translateY(0)' : 'translateY(12px)',
          transition: 'transform 0.25s ease',
        }}
      >
        <ChatPanel />
      </div>
    </div>
  )
}
