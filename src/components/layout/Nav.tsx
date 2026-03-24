'use client'

import Image from 'next/image'
import Link from 'next/link'
import HiDotGrid from '@/components/ui/HiDotGrid'
import CaseStudiesDropdown from '@/components/ui/CaseStudiesDropdown'
import { useChatContext } from '@/context/ChatContext'

export default function Nav() {
  const { toggle } = useChatContext()
  return (
    <nav
      className="flex items-center gap-6 px-6 py-3 rounded-full"
      style={{
        backgroundColor: 'rgba(22, 26, 34, 0.7)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <Image
          src="/logo-update.svg"
          alt="Joe Siconolfi"
          width={26}
          height={26}
          style={{ opacity: 0.9, transition: 'opacity 0.2s ease' }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '0.9')}
        />
      </Link>
      <div className="w-px h-4 bg-white/20" />
      <CaseStudiesDropdown />
      <Link href="/about" className="font-mono text-xs font-light text-text-secondary hover:text-accent-neon transition-colors">
        about
      </Link>
      <Link href="/timeline" className="font-mono text-xs font-light text-text-secondary hover:text-accent-neon transition-colors">
        timeline
      </Link>
      <a href="#lab" className="font-mono text-xs font-light text-text-secondary hover:text-accent-neon transition-colors">
        the lab
      </a>
      <div className="w-px h-4 bg-white/20" />
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2.5 px-4 py-1.5 rounded-full font-mono text-xs font-light text-white hover:text-accent-neon transition-colors duration-200"
        style={{
          backgroundColor: 'rgba(22, 26, 34, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <span style={{ paddingLeft: '2px' }}>
          <HiDotGrid dotSize={2.5} gap={1.5} speed={1.2} />
        </span>
        Chat with me
      </button>
    </nav>
  )
}
