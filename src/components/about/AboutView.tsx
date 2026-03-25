'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/useIsMobile'

interface NowPlaying {
  isPlaying: boolean
  title: string | null
  artist?: string
  album?: string
  albumArt?: string
  url?: string
}

const BIO = [
  "I'm a design engineer based in San Francisco, originally from Long Island. Pizza in my veins, West Coast since 22. For 15+ years I've been building where design and engineering overlap, mostly at companies where the product didn't exist yet and someone had to figure out what it should be.",
  "My focus is AI-native product. Not AI as a feature bolted onto something, but experiences built from the ground up around what AI actually makes possible. I care about the human side of that: how do you make a system that learns feel empowering rather than opaque? How do you design for capability without designing away agency? That's the problem I keep returning to.",
  "When I'm not building, I'm digging through record bins or watching the Knicks and Mets find new ways to break my heart. I started with MySpace CSS in middle school and the habit never left. Fifteen years later the tools are different, the problems are bigger, and I still can't stop making things.",
]

const FACTS = [
  { label: 'hometown', value: 'Huntington, NY' },
  { label: 'based', value: 'San Francisco, CA' },
  { label: 'years in tech', value: '15+' },
  { label: 'first code', value: 'MySpace CSS, circa 2004' },
  { label: 'record collection', value: 'growing, never finished' },
  { label: 'sports', value: 'Knicks. Mets. Send help.' },
  { label: 'education', value: 'MBA + BS Computer Science, Full Sail' },
  { label: 'currently building', value: 'Waypoint at Cohere' },
]

const LINKS = [
  { label: 'linkedin', url: 'https://www.linkedin.com/in/joe-siconolfi/' },
  { label: 'github', url: 'https://github.com/Jsiconolfi' },
  { label: 'email', url: 'mailto:jsiconolfi@gmail.com' },
]

export default function AboutView() {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [closeHovered, setCloseHovered] = useState(false)
  const [yellowHovered, setYellowHovered] = useState(false)
  const [greenHovered, setGreenHovered] = useState(false)
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null)
  const [spotifyLoading, setSpotifyLoading] = useState(true)
  const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    async function fetchNowPlaying() {
      try {
        const res = await fetch('/api/spotify/now-playing')
        const data = await res.json()
        setNowPlaying(data)
      } catch {
        setNowPlaying({ isPlaying: false, title: null })
      } finally {
        setSpotifyLoading(false)
      }
    }
    fetchNowPlaying()
    pollRef.current = setInterval(fetchNowPlaying, 30000)
    return () => clearInterval(pollRef.current)
  }, [])

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'var(--font-mono, monospace)', overflowX: 'hidden' }}>

      {/* Terminal chrome — colored traffic lights; red → home (Session 71) */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: 'rgba(10, 12, 16, 0.98)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <button
          type="button"
          title="Home"
          onClick={() => router.push('/')}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: '#ff5f57',
            border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            touchAction: 'manipulation',
          }}
        >
          {closeHovered && (
            <span style={{
              fontSize: 8, lineHeight: 1,
              color: 'rgba(0,0,0,0.65)',
              fontWeight: 700, userSelect: 'none',
              pointerEvents: 'none',
            }}>×</span>
          )}
        </button>
        <span
          onMouseEnter={() => setYellowHovered(true)}
          onMouseLeave={() => setYellowHovered(false)}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: '#febc2e',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'default',
          }}
        >
          {yellowHovered && (
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 700, userSelect: 'none', pointerEvents: 'none' }}>−</span>
          )}
        </span>
        <span
          onMouseEnter={() => setGreenHovered(true)}
          onMouseLeave={() => setGreenHovered(false)}
          style={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: '#28c840',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, cursor: 'default',
          }}
        >
          {greenHovered && (
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 700, userSelect: 'none', pointerEvents: 'none' }}>+</span>
          )}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 10, fontWeight: 300 }}>
          about.exe
        </span>
      </div>

      {/* Page content */}
      <div style={{
        maxWidth: 880,
        margin: '0 auto',
        padding: isMobile ? '100px 20px 80px' : '120px 48px 160px',
        boxSizing: 'border-box',
        width: '100%',
      }}>

        {/* Photo + bio */}
        <div style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : '200px 1fr',
          gap: isMobile ? 32 : 48,
          marginBottom: 72,
          alignItems: 'start',
        }}>

          {/* Photo column */}
          <div>
            <div style={{
              width: isMobile ? 120 : 200,
              height: isMobile ? 120 : 200,
              margin: isMobile ? '0 auto' : undefined,
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/joe.png" alt="Joe Siconolfi" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ marginTop: 12, textAlign: isMobile ? 'center' : 'left' }}>
              <p style={{ fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.9)', margin: '0 0 4px' }}>Joe Siconolfi</p>
              <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(0,255,159,0.7)', margin: '0 0 4px' }}>Staff Design Engineer</p>
              <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Cohere · San Francisco Bay</p>
            </div>
          </div>

          {/* Bio column */}
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>
              about
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {BIO.map((para, i) => (
                <p key={i} style={{ fontSize: 13, fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.65)', margin: 0, wordBreak: 'break-word' }}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 56 }} />

        {/* Facts + Spotify + Connect */}
        <div style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
          gap: 48,
        }}>

          {/* Facts */}
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24px' }}>
              outside the terminal
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FACTS.map(item => (
                <div key={item.label} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0, width: isMobile ? 100 : 120 }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.65)', wordBreak: 'break-word', minWidth: 0 }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spotify + Connect */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

            {/* Spotify widget */}
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
                {nowPlaying?.isPlaying ? 'now playing' : 'last played'}
              </p>

              {spotifyLoading ? (
                <div style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>loading...</p>
                </div>
              ) : nowPlaying?.title ? (
                <a
                  href={nowPlaying.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px', borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    textDecoration: 'none',
                    transition: 'border-color 0.2s ease, background 0.2s ease',
                    maxWidth: isMobile ? '100%' : undefined,
                    width: isMobile ? '100%' : undefined,
                    boxSizing: 'border-box',
                    minHeight: isMobile ? 44 : undefined,
                    touchAction: 'manipulation',
                  }}
                  onMouseEnter={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(30,215,96,0.3)'
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(30,215,96,0.04)'
                  }}
                  onMouseLeave={e => {
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'
                    ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.02)'
                  }}
                >
                  {nowPlaying.albumArt && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={nowPlaying.albumArt} alt={nowPlaying.album} style={{ width: 48, height: 48, borderRadius: 4, flexShrink: 0, objectFit: 'cover' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      {nowPlaying.isPlaying && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#1ed760', display: 'block', flexShrink: 0, boxShadow: '0 0 6px rgba(30,215,96,0.6)' }} />
                      )}
                      <p style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.85)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {nowPlaying.title}
                      </p>
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {nowPlaying.artist}
                    </p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#1ed760" style={{ flexShrink: 0, opacity: 0.7 }}>
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              ) : (
                <div style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>not playing anything right now</p>
                </div>
              )}
            </div>

            {/* Connect */}
            <div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px' }}>
                connect
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {LINKS.map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 12, fontWeight: 300, color: 'rgba(255,255,255,0.4)',
                      textDecoration: 'none', transition: 'color 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: 8,
                      minHeight: isMobile ? 44 : undefined,
                      touchAction: 'manipulation',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#00ff9f')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >
                    <span style={{ color: '#00ff9f', fontSize: 10 }}>→</span>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
