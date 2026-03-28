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
  "I'm a designer, engineer, and self-proclaimed creative cosmonaut based in San Francisco, originally from New York. With pizza in my blood, punk in my veins, and users in my heart. I've been on the West Coast and the SF Bay since 2022. For 15+ years I've been doing both: conceiving the experience and building it, in the same session, without handing off.",
  "Most of my work has been at companies where the product didn't exist yet. That's where the duality matters most. When you're figuring out what something should be, you can't separate how it feels from how it works. The design is the product. The code is the design. I've never thought of them as different jobs.",
  "My focus now is AI-native product. Not AI as a feature bolted onto something, but experiences built from the ground up around what AI actually makes possible. I care deeply about the human side of that: how do you make a system that learns feel empowering rather than opaque? How do you design for capability without designing away agency? How do you get someone to the moment where the product just gets them, and make that moment happen faster? That's the problem I keep returning to.",
  "When I'm not building I'm digging through record bins or watching the Knicks and Mets find new ways to break my heart. I started with MySpace CSS in middle school and the habit never left. Fifteen years later the tools are different, the problems are bigger, and I still can't stop making things.",
]

const FACTS = [
  { label: 'hometown', value: 'Huntington, NY' },
  { label: 'based', value: 'San Francisco Bay' },
  { label: 'years in tech', value: '15+' },
  { label: 'mindset', value: 'Designer + engineer, no handoff' },
  { label: 'record collection', value: 'Growing, never finished' },
  { label: 'sports', value: 'Knicks. Mets. Send help.' },
  { label: 'education', value: 'MBA + BS Computer Science, Full Sail' },
  { label: 'reading', value: 'Genesis: Artificial Intelligence, Hope, and the Human Spirit' },
  { label: 'building', value: 'Waypoint, Sherpa + frontier model UX at Cohere' },
]

const LINKS = [
  { label: 'linkedin', url: 'https://www.linkedin.com/in/joe-siconolfi/' },
  { label: 'github', url: 'https://github.com/Jsiconolfi' },
  { label: 'email', url: 'mailto:jsiconolfi@gmail.com' },
]

/** Last completed game from `/api/sports/knicks` or `/api/sports/mets` (Session 88). */
type SportsLastGame = {
  opponent: string
  opponentAbbr: string
  opponentScore: number
  won: boolean
  isHome: boolean
  date: string
  knicksScore?: number
  metsScore?: number
}

type SportsScheduleClientPayload =
  | {
      status: 'live'
      opponent: string
      opponentAbbr: string
      opponent_score: number
      isHome: boolean
      knicks_score?: number
      mets_score?: number
      period?: number
      clock?: string
      inning?: number
      inningHalf?: string
      lastGame?: SportsLastGame | null
    }
  | {
      status: 'upcoming'
      opponent: string
      opponentAbbr: string
      date: string
      isHome: boolean
      venue: string
      lastGame?: SportsLastGame | null
    }
  | { status: 'off_season'; lastGame?: SportsLastGame | null }
  | { status: 'error' }

interface SportsWidgetProps {
  team: 'knicks' | 'mets'
  apiPath: string
}

function SportsWidget({ team, apiPath }: SportsWidgetProps) {
  const [data, setData] = useState<SportsScheduleClientPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(apiPath)
        const json: unknown = await res.json()
        setData(json as SportsScheduleClientPayload)
      } catch {
        setData({ status: 'error' })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 60_000)
    return () => clearInterval(interval)
  }, [apiPath])

  const isNba = team === 'knicks'

  function formatGameTime(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const isTomorrow = date.toDateString() === tomorrow.toDateString()

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
    })

    if (isToday) return `Today · ${timeStr}`
    if (isTomorrow) return `Tomorrow · ${timeStr}`
    return (
      date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }) + ` · ${timeStr}`
    )
  }

  const teamScore =
    data?.status === 'live'
      ? isNba
        ? (data.knicks_score ?? 0)
        : (data.mets_score ?? 0)
      : 0

  const lastGameRow =
    !loading && data && data.status !== 'error' && data.lastGame ? data.lastGame : null

  return (
    <div
      style={{
        padding: '12px 14px',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 6,
        fontFamily: 'var(--font-mono)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 300,
            color: 'rgba(255,255,255,0.75)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {team}
        </span>
        {data?.status === 'live' && (
          <span
            style={{
              fontSize: 9,
              color: '#00ff9f',
              border: '1px solid rgba(0,255,159,0.3)',
              borderRadius: 3,
              padding: '1px 5px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            live
          </span>
        )}
      </div>

      {loading && (
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, fontWeight: 300 }}>
          loading...
        </p>
      )}

      {!loading && data?.status === 'upcoming' && (
        <div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '0 0 3px', fontWeight: 300 }}>
            {data.isHome ? 'vs' : '@'} {data.opponent}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0, fontWeight: 300 }}>
            {formatGameTime(data.date)}
          </p>
        </div>
      )}

      {!loading && data?.status === 'live' && (
        <div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: '0 0 3px', fontWeight: 300 }}>
            {teamScore} – {data.opponent_score} vs {data.opponentAbbr}
          </p>
          <p style={{ fontSize: 10, color: 'rgba(0,255,159,0.6)', margin: 0, fontWeight: 300 }}>
            {isNba ? `Q${data.period ?? 1} · ${data.clock ?? ''}` : (data.inningHalf ?? '')}
          </p>
        </div>
      )}

      {!loading && data?.status === 'off_season' && (
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, fontWeight: 300 }}>
          no games scheduled
        </p>
      )}

      {!loading && data?.status === 'error' && (
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0, fontWeight: 300 }}>
          unavailable
        </p>
      )}

      {/* Last game result — single line (Session 88 data, Session 89 layout) */}
      {lastGameRow && (
        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 9,
              color: 'rgba(255,255,255,0.2)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontFamily: 'var(--font-mono)',
              fontWeight: 300,
              flexShrink: 0,
            }}
          >
            last result
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: 'flex-end', minWidth: 0 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: lastGameRow.won ? 'rgba(0,255,159,0.7)' : 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {lastGameRow.won ? 'W' : 'L'}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {isNba
                ? `${lastGameRow.knicksScore ?? 0}–${lastGameRow.opponentScore}`
                : `${lastGameRow.metsScore ?? 0}–${lastGameRow.opponentScore}`}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {lastGameRow.isHome ? 'vs' : '@'} {lastGameRow.opponentAbbr}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

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

      {/* Terminal chrome - colored traffic lights; red → home (Session 71) */}
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
              fontWeight: 500, userSelect: 'none',
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
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }}>−</span>
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
            <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }}>+</span>
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

        {/* Facts + connect | Spotify + sports widgets (Session 83) */}
        <div style={{
          display: isMobile ? 'flex' : 'grid',
          flexDirection: isMobile ? 'column' : undefined,
          gridTemplateColumns: isMobile ? undefined : '1fr 1fr',
          gap: 48,
        }}>

          {/* Facts + connect */}
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

            <div style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}>
              <p style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.25)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                margin: '0 0 12px',
                fontFamily: 'var(--font-mono)',
              }}>
                connect
              </p>
              <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
                {LINKS.map(link => (
                  <a
                    key={link.label}
                    href={link.url}
                    target={link.url.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.url.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    style={{
                      fontSize: 11,
                      fontWeight: 300,
                      color: 'rgba(255,255,255,0.4)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-mono)',
                      transition: 'color 0.2s ease',
                      minHeight: isMobile ? 44 : undefined,
                      display: 'inline-flex',
                      alignItems: 'center',
                      touchAction: 'manipulation',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#00ff9f')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Spotify + Knicks + Mets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

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

            <div>
              <p
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.25)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 8px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                knicks
              </p>
              <SportsWidget team="knicks" apiPath="/api/sports/knicks" />
            </div>

            <div>
              <p
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.25)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 8px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                mets
              </p>
              <SportsWidget team="mets" apiPath="/api/sports/mets" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
