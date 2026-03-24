'use client'

import { useRouter } from 'next/navigation'
import { useIsMobile } from '@/hooks/useIsMobile'
import type { CaseStudy } from '@/content/case-studies'

interface Props {
  caseStudy: CaseStudy
}

export default function CaseStudyView({ caseStudy }: Props) {
  const router = useRouter()
  const isMobile = useIsMobile()

  return (
    <main
      style={{
        minHeight: '100vh',
        color: '#ffffff',
        fontFamily: 'var(--font-mono, monospace)',
        overflowX: 'hidden',
      }}
    >
      {/* Content — tab bar + nav; padding tuned for mobile (Session 67) */}
      <div
        style={{
          maxWidth: isMobile ? '100%' : 720,
          margin: '0 auto',
          padding: isMobile ? '20px 20px 80px' : '64px 24px 120px',
          boxSizing: 'border-box',
          width: '100%',
        }}
      >
        {/* Hero asset */}
        {caseStudy.heroAsset && (
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: 8,
              overflow: 'hidden',
              marginBottom: 48,
              border: '1px solid rgba(255,255,255,0.06)',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            {caseStudy.heroAsset.endsWith('.mp4') ? (
              <video
                src={caseStudy.heroAsset}
                autoPlay={!isMobile}
                muted
                loop
                playsInline
                preload="metadata"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={caseStudy.heroAsset}
                alt={caseStudy.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </div>
        )}

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p
            style={{
              fontSize: 11,
              color: 'rgba(255,255,255,0.3)',
              margin: '0 0 8px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            {caseStudy.year}
          </p>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 500,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
            }}
          >
            {caseStudy.name}
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.5)',
              margin: '0 0 16px',
              fontWeight: 300,
            }}
          >
            {caseStudy.tagline}
          </p>
          <p
            style={{
              fontSize: 12,
              color: 'rgba(0,255,159,0.7)',
              margin: 0,
              fontWeight: 300,
            }}
          >
            {caseStudy.role}
          </p>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            marginBottom: 48,
          }}
        />

        {/* Hook */}
        <Section label="the problem">
          <p style={bodyStyle}>{caseStudy.hook}</p>
        </Section>

        {/* Hard part — full only */}
        {caseStudy.type === 'full' && caseStudy.hardPart && (
          <Section label="the hard part">
            <p style={bodyStyle}>{caseStudy.hardPart}</p>
          </Section>
        )}

        {/* Decisions */}
        <Section label={caseStudy.type === 'full' ? 'key decisions' : 'what I did'}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {caseStudy.decisions.map((decision, i) => (
              <div key={i}>
                <h3
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    margin: '0 0 8px',
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {decision.title}
                </h3>
                <p style={bodyStyle}>{decision.body}</p>
                {decision.artifact && (
                  <div
                    style={{
                      marginTop: 16,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid rgba(255,255,255,0.06)',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {decision.artifact.endsWith('.mp4') ? (
                      <video
                        src={decision.artifact}
                        autoPlay={!isMobile}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        style={{ width: '100%', display: 'block' }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={decision.artifact}
                        alt={decision.title}
                        style={{ width: '100%', display: 'block' }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Outcome */}
        <Section label="outcome">
          <p style={bodyStyle}>{caseStudy.outcome}</p>
        </Section>

        {/* Next case study */}
        {caseStudy.nextSlug && (
          <div
            style={{
              marginTop: 80,
              paddingTop: 40,
              borderTop: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: 'rgba(255,255,255,0.25)',
                margin: '0 0 8px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              next
            </p>
            <button
              type="button"
              onClick={() => router.push(`/work/${caseStudy.nextSlug}`)}
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 6,
                padding: '12px 16px',
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                transition: 'border-color 0.2s ease, color 0.2s ease',
                width: isMobile ? '100%' : undefined,
                justifyContent: isMobile ? 'center' : undefined,
                minHeight: isMobile ? 44 : undefined,
                touchAction: 'manipulation',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
                ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'
              }}
            >
              {caseStudy.nextSlug}.exe →
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 300,
          color: 'rgba(255,255,255,0.25)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          margin: '0 0 16px',
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}

const bodyStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 300,
  lineHeight: 1.8,
  color: 'rgba(255,255,255,0.65)',
  margin: 0,
  wordBreak: 'break-word',
}
