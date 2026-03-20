import type { Metadata } from 'next'
import { IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import { ChatProvider } from '@/context/ChatContext'
import ChatOverlay from '@/components/ui/ChatOverlay'

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Joe Siconolfi — Staff Design Engineer',
  description:
    'Building the interfaces where humans and AI figure out how to work together.',
  openGraph: {
    title: 'Joe Siconolfi — Staff Design Engineer',
    description:
      'Building the interfaces where humans and AI figure out how to work together.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={ibmPlexMono.variable}>
      <body className="antialiased">
        <ChatProvider>
          {children}
          <ChatOverlay />
        </ChatProvider>
      </body>
    </html>
  )
}
