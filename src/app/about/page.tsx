import type { Metadata } from 'next'
import AboutView from '@/components/about/AboutView'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Designer, engineer, and self-proclaimed creative cosmonaut based in San Francisco. 15+ years conceiving and building products in the same session, without handing off.',
  openGraph: {
    title: 'About | Joe Siconolfi',
    description:
      'Designer, engineer, and self-proclaimed creative cosmonaut based in San Francisco. 15+ years conceiving and building products in the same session, without handing off.',
    url: 'https://joesiconolfi.com/about',
  },
}

export default function AboutPage() {
  return <AboutView />
}
