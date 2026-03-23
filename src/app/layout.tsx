import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import Swirl from '@/components/ui/Swirl'
import OrbitalSystem from '@/components/ui/OrbitalSystem'
import NavWrapper from '@/components/layout/NavWrapper'
import TabBar from '@/components/layout/TabBar'
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper'
import { ChatProvider } from '@/context/ChatContext'
import { TabProvider } from '@/context/TabContext'
import ChatOverlay from '@/components/ui/ChatOverlay'
import './globals.css'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body
        className="antialiased"
        style={{ backgroundColor: '#161a22', margin: 0, overflow: 'hidden' }}
      >
        <TabProvider>
          {/* Persistent background — never unmounts across navigation */}
          <Swirl className="fixed inset-0 w-screen h-screen z-0" />
          <OrbitalSystem />

          {/* Tab bar — appears at top on /work/* pages */}
          <TabBar />

          <ChatProvider>
            {/* Nav — shifts down when tab bar is visible */}
            <NavWrapper />

            {/* Page content — transitions in/out per route */}
            <PageTransitionWrapper>{children}</PageTransitionWrapper>

            {/* Chat overlay — triggered from Nav "Chat with me" button */}
            <ChatOverlay />
          </ChatProvider>
        </TabProvider>
      </body>
    </html>
  )
}
