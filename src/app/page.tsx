import type { Metadata } from 'next'
import HomePageClient from '@/components/home/HomePageClient'

export const metadata: Metadata = {
  title: {
    absolute: 'Joe Siconolfi — Designer, engineer, & creative cosmonaut.',
  },
  description:
    'Portfolio of Joe Siconolfi, designer, engineer, and creative cosmonaut building AI-native products, design systems, and frontier model experiences.',
  openGraph: {
    title: 'Joe Siconolfi — Designer, engineer, & creative cosmonaut.',
    description:
      'Portfolio of Joe Siconolfi, designer, engineer, and creative cosmonaut building AI-native products, design systems, and frontier model experiences.',
    url: 'https://joesiconolfi.com',
  },
}

export default function Home() {
  return <HomePageClient />
}
