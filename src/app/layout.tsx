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
  title: {
    default: 'Joe Siconolfi — Designer, engineer, & creative cosmonaut.',
    template: '%s | Joe Siconolfi',
  },
  description:
    '15+ years designing and building AI-native products, design systems, and frontier model experiences.',
  keywords: [
    'design engineer',
    'AI product design',
    'design systems',
    'frontend engineering',
    'Cohere',
    'San Francisco',
  ],
  authors: [{ name: 'Joe Siconolfi', url: 'https://joesiconolfi.com' }],
  creator: 'Joe Siconolfi',
  metadataBase: new URL('https://joesiconolfi.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://joesiconolfi.com',
    siteName: 'Joe Siconolfi',
    title: 'Joe Siconolfi — Designer, engineer, & creative cosmonaut.',
    description:
      '15+ years designing and building AI-native products, design systems, and frontier model experiences.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Joe Siconolfi — Designer, engineer, & creative cosmonaut.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joe Siconolfi — Designer, engineer, & creative cosmonaut.',
    description:
      '15+ years designing and building AI-native products, design systems, and frontier model experiences.',
    images: ['/og-image.png'],
    creator: '@JoeSiggo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
