import type { Metadata } from 'next'
import TimelineView from '@/components/timeline/TimelineView'

export const metadata: Metadata = {
  title: 'Timeline',
  description:
    '15+ years of design and engineering work across AI, fintech, media, and frontier model research.',
  openGraph: {
    title: 'Timeline | Joe Siconolfi',
    description:
      '15+ years of design and engineering work across AI, fintech, media, and frontier model research.',
    url: 'https://joesiconolfi.com/timeline',
  },
}

export default function TimelinePage() {
  return <TimelineView />
}
