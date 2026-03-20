'use client'

import { useEffect, useRef } from 'react'
import ChatPanel from '@/components/ui/ChatPanel'
import { useChatContext } from '@/context/ChatContext'

export default function ChatOverlay() {
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
        pointerEvents: isOpen ? 'auto' : 'none',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.2s ease',
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
        className="relative z-10 w-full max-w-2xl"
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
