'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { motion, useAnimation } from 'framer-motion'
import ChatPanel from '@/components/ui/ChatPanel'
import { useChatUI } from '@/context/ChatContext'
import { useNavWidthContext } from '@/context/NavWidthContext'
import { useIsMobile } from '@/hooks/useIsMobile'

const PANEL_EASE = [0.25, 0.46, 0.45, 0.94] as const
const PANEL_DURATION = 0.45

export default function ChatOverlay() {
  const isMobile = useIsMobile()
  const { desktopNavWidthPx } = useNavWidthContext()
  const { isOpen, close } = useChatUI()
  const panelControls = useAnimation()
  const prevOpenRef = useRef(isOpen)

  useLayoutEffect(() => {
    void panelControls.set({ y: '-100vh', opacity: 0 })
  }, [panelControls])

  useEffect(() => {
    const wasOpen = prevOpenRef.current
    prevOpenRef.current = isOpen

    if (isOpen) {
      void panelControls.start({
        y: 0,
        opacity: 1,
        transition: { duration: PANEL_DURATION, ease: PANEL_EASE },
      })
      return
    }

    if (wasOpen) {
      void panelControls
        .start({
          y: '100vh',
          opacity: 0,
          transition: { duration: PANEL_DURATION, ease: PANEL_EASE },
        })
        .then(() => {
          void panelControls.start({ y: '-100vh', opacity: 0, transition: { duration: 0 } })
        })
    }
  }, [isOpen, panelControls])

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
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div
      aria-modal="true"
      aria-label="Chat panel"
      role="dialog"
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        paddingLeft: isMobile ? 16 : 0,
        paddingRight: isMobile ? 16 : 0,
        opacity: isOpen ? 1 : 0,
        visibility: isOpen ? 'visible' : 'hidden',
        transition: isOpen
          ? 'opacity 0.25s ease, visibility 0s linear 0s'
          : `opacity ${PANEL_DURATION}s ease, visibility 0s linear ${PANEL_DURATION}s`,
      }}
    >
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

      <motion.div
        animate={panelControls}
        className="relative z-10"
        style={{
          willChange: 'transform',
          width: isMobile ? 'calc(100vw - 32px)' : `${desktopNavWidthPx}px`,
        }}
      >
        <ChatPanel variant="overlay" />
      </motion.div>
    </div>
  )
}
