import type { Metadata } from 'next'
import WorkGrid from '@/components/case-study/WorkGrid'

export const metadata: Metadata = {
  title: 'Case Studies',
  description:
    '12 projects across AI-native product, design systems, voice interfaces, and frontier model experiences.',
  openGraph: {
    title: 'Case Studies | Joe Siconolfi',
    description:
      '12 projects across AI-native product, design systems, voice interfaces, and frontier model experiences.',
    url: 'https://joesiconolfi.com/work',
  },
}

export default function WorkPage() {
  return <WorkGrid />
}
