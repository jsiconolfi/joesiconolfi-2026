'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import HiDotGrid from '@/components/ui/HiDotGrid'
import CaseStudiesDropdown from '@/components/ui/CaseStudiesDropdown'
import { useChatContext } from '@/context/ChatContext'
import { useIsMobile } from '@/hooks/useIsMobile'

function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

function NavTextLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <Link
      href={href}
      className="font-mono text-xs font-light transition-colors"
      style={{ color: active || hovered ? '#00ff9f' : 'rgba(255,255,255,0.6)' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </Link>
  )
}

const MOBILE_NAV_LINKS = [
  { label: 'case studies', href: '/work' },
  { label: 'about', href: '/about' },
  { label: 'timeline', href: '/timeline' },
  { label: 'the lab', href: '/lab' },
] as const

export default function Nav() {
  const pathname = usePathname()
  const { toggle } = useChatContext()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  if (isMobile) {
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 20px',
            backgroundColor: 'rgba(22,26,34,0.85)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 100,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center' }}
            aria-label="Home"
          >
            <Image
              src="/logo-update.svg"
              alt=""
              width={24}
              height={24}
              style={{ opacity: 0.9 }}
            />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 18,
                height: 1.5,
                backgroundColor: menuOpen ? '#00ff9f' : 'rgba(255,255,255,0.6)',
                transition: 'background-color 0.2s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 18,
                height: 1.5,
                backgroundColor: menuOpen ? '#00ff9f' : 'rgba(255,255,255,0.6)',
                transition: 'background-color 0.2s ease',
              }}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              toggle()
              setMenuOpen(false)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              backgroundColor: 'rgba(196,174,145,0.08)',
              border: '1px solid rgba(196,174,145,0.2)',
              borderRadius: 100,
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 300,
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <HiDotGrid dotSize={3} gap={2} speed={1.2} />
            Chat
          </button>
        </div>

        {menuOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(14,16,21,0.97)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              zIndex: 45,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              style={{
                position: 'absolute',
                top: 24,
                right: 24,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ×
            </button>

            {MOBILE_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 28,
                  fontWeight: 300,
                  color: isActive(pathname, link.href) ? '#00ff9f' : 'rgba(255,255,255,0.5)',
                  padding: '12px 0',
                  transition: 'color 0.2s ease',
                  textDecoration: 'none',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </>
    )
  }

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
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.9')}
        />
      </Link>
      <div className="w-px h-4 bg-white/20" />
      <CaseStudiesDropdown />
      <NavTextLink href="/about" active={isActive(pathname, '/about')}>
        about
      </NavTextLink>
      <NavTextLink href="/timeline" active={isActive(pathname, '/timeline')}>
        timeline
      </NavTextLink>
      <NavTextLink href="/lab" active={isActive(pathname, '/lab')}>
        the lab
      </NavTextLink>
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
