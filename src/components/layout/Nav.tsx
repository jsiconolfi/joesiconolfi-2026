'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import HiDotGrid from '@/components/ui/HiDotGrid'
import CaseStudiesDropdown from '@/components/ui/CaseStudiesDropdown'
import { useChatUI } from '@/context/ChatContext'
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

const MOBILE_SOCIAL_LINKS = [
  { label: 'linkedin', url: 'https://linkedin.com/in/joesiconolfi' },
  { label: 'github', url: 'https://github.com/joesiconolfi' },
] as const

export default function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { toggle } = useChatUI()
  const isMobile = useIsMobile()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    // Close menu when the route changes (including browser back/forward).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sync menu to Next pathname
    setMenuOpen(false)
  }, [pathname])

  if (isMobile) {
    return (
      <>
        <div
          style={{
            position: 'relative',
            zIndex: 46,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            backgroundColor: 'rgba(22,26,34,0.9)',
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
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 44,
              minHeight: 44,
            }}
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
              padding: 8,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 44,
              minHeight: 44,
              position: 'relative',
            }}
          >
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                backgroundColor: menuOpen ? '#00ff9f' : 'rgba(255,255,255,0.7)',
                borderRadius: 1,
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(3.75px) rotate(45deg)' : 'none',
                transition: 'transform 0.25s ease, background-color 0.2s ease',
              }}
            />
            <span
              style={{
                display: 'block',
                width: 20,
                height: 1.5,
                backgroundColor: menuOpen ? '#00ff9f' : 'rgba(255,255,255,0.7)',
                borderRadius: 1,
                transformOrigin: 'center',
                transform: menuOpen ? 'translateY(-3.75px) rotate(-45deg)' : 'none',
                transition: 'transform 0.25s ease, background-color 0.2s ease',
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
              minHeight: 44,
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

        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(14, 16, 21, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            zIndex: 45,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 40px',
            opacity: menuOpen ? 1 : 0,
            pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'opacity 0.25s ease',
          }}
        >
          {MOBILE_NAV_LINKS.map((link, i) => (
            <button
              key={link.href}
              type="button"
              onClick={() => {
                router.push(link.href)
                setMenuOpen(false)
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 32,
                fontWeight: 300,
                color: isActive(pathname, link.href) ? '#00ff9f' : 'rgba(255,255,255,0.5)',
                padding: '16px 0',
                textAlign: 'left',
                width: '100%',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                transform: menuOpen ? 'translateX(0)' : 'translateX(-16px)',
                opacity: menuOpen ? 1 : 0,
                transition: `transform 0.3s ease ${i * 60}ms, opacity 0.3s ease ${i * 60}ms, color 0.2s ease`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#00ff9f'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = isActive(pathname, link.href)
                  ? '#00ff9f'
                  : 'rgba(255,255,255,0.5)'
              }}
            >
              {link.label}
            </button>
          ))}

          <div
            style={{
              marginTop: 40,
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
              transition: `opacity 0.3s ease ${MOBILE_NAV_LINKS.length * 60 + 60}ms, transform 0.3s ease ${MOBILE_NAV_LINKS.length * 60 + 60}ms`,
              display: 'flex',
              gap: 24,
            }}
          >
            {MOBILE_SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11,
                  fontWeight: 300,
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(255,255,255,0.3)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#00ff9f'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.3)'
                }}
                onClick={() => setMenuOpen(false)}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
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
