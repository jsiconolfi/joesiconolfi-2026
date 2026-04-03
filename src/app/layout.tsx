import type { Metadata, Viewport } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import SwirlWrapper from '@/components/layout/SwirlWrapper'
import OrbitalSystem from '@/components/ui/OrbitalSystem'
import NavWrapper from '@/components/layout/NavWrapper'
import TabBar from '@/components/layout/TabBar'
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper'
import { ChatProvider } from '@/context/ChatContext'
import { NavWidthProvider } from '@/context/NavWidthContext'
import { TabProvider } from '@/context/TabContext'
import ChatOverlay from '@/components/ui/ChatOverlay'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Joe Siconolfi — Design + Engineering',
  description: 'Design engineer by trade and a creative cosmonaut by nature',
  openGraph: {
    title: 'Joe Siconolfi — Design + Engineering',
    description: 'Design engineer by trade and a creative cosmonaut by nature',
    type: 'website',
  },
}

/** iOS: prevents input-focus zoom + stuck zoom after keyboard (Session 70). */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body
        className="antialiased"
        style={{ backgroundColor: '#161a22', margin: 0, overflow: 'hidden' }}
      >
        <TabProvider>
          {/* Persistent background — never unmounts across navigation */}
          <SwirlWrapper />
          <OrbitalSystem />

          {/* Tab bar — case study tabs on /work/[slug]; window chrome on /work, /about, /timeline, /lab */}
          <TabBar />

          <ChatProvider>
            <NavWidthProvider>
              {/* Nav — shifts down when tab bar is visible */}
              <NavWrapper />

              {/* Page content — transitions in/out per route */}
              <PageTransitionWrapper>{children}</PageTransitionWrapper>

              {/* Chat overlay — triggered from Nav "Chat with me" button */}
              <ChatOverlay />
            </NavWidthProvider>
          </ChatProvider>
        </TabProvider>
      </body>
    </html>
  )
}
