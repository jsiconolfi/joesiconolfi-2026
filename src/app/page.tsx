'use client'

import ChatPanel from '@/components/ui/ChatPanel'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function Home() {
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: isMobile ? 80 : 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          paddingTop: isMobile ? 16 : 0,
          paddingLeft: isMobile ? 16 : 0,
          paddingRight: isMobile ? 16 : 0,
          paddingBottom: isMobile ? 16 : 0,
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <ChatPanel />
      </div>

      <div
        className="font-mono z-10 pointer-events-none"
        style={{
          position: 'fixed',
          bottom: isMobile ? 100 : 32,
          left: isMobile ? 16 : 32,
        }}
      >
        <p className="text-sm font-normal text-white">Joe Siconolfi</p>
        <p className="text-xs font-light text-text-hint mt-0.5">Design + Engineering</p>
      </div>
    </div>
  )
}
