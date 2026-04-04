import type { Metadata } from 'next'
import LabView from '@/components/lab/LabView'

export const metadata: Metadata = {
  title: 'The Lab',
  description:
    'Experiments, thinking, and prototypes at the intersection of AI, design, and inference.',
  openGraph: {
    title: 'The Lab | Joe Siconolfi',
    description:
      'Experiments, thinking, and prototypes at the intersection of AI, design, and inference.',
    url: 'https://joesiconolfi.com/lab',
  },
}

export default function LabPage() {
  return <LabView />
}
