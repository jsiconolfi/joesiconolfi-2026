'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LAB_EXPERIMENTS } from '@/content/lab-experiments'
import { LAB_FEED } from '@/content/lab-feed'
import type { FeedEntryType } from '@/content/lab-feed'

const STATUS_COLORS: Record<string, string> = {
  'in progress': 'rgba(0,255,159,0.7)',
  'shipped':     'rgba(0,255,159,0.4)',
  'ongoing':     'rgba(0,255,159,0.7)',
  'archived':    'rgba(255,255,255,0.25)',
}

const TYPE_LABELS: Record<FeedEntryType, string> = {
  note:       'note',
  prompt:     'prompt',
  read:       'read',
  tool:       'tool',
  eval:       'eval',
  experiment: 'experiment',
}

const BELIEFS = [
  {
    belief: 'AI should make you more capable, not more dependent.',
    note: 'The measure of a good AI product is whether the user gets better at something through using it. If they can only do the thing with the AI present, the product failed.',
  },
  {
    belief: 'The best prompt is the one you never have to write.',
    note: 'Every prompt is evidence of an interface that did not do enough inference. The goal is to eliminate the prompt, not to perfect it.',
  },
  {
    belief: 'Design systems are infrastructure, not decoration.',
    note: 'A design system is the foundation that lets a team move fast without making things worse. When it is treated as a style guide, it becomes a constraint. When it is treated as infrastructure, it becomes leverage.',
  },
  {
    belief: 'Context is more valuable than capability.',
    note: 'A less capable model with full context will outperform a more capable model without it. Most AI products are solving the wrong problem.',
  },
  {
    belief: 'Voice is the most natural interface we keep ignoring.',
    note: 'We speak before we type. We speak faster than we type. We speak in contexts where typing is impossible. The industry has treated voice as a novelty. It is actually the default.',
  },
  {
    belief: 'The aha moment is a design problem, not a model problem.',
    note: 'Most users never experience what a model is actually capable of because the interface does not get them there. The model is ready. The design is not.',
  },
  {
    belief: "The interface is the model's first impression of itself.",
    note: 'How a model is presented shapes how people understand what it can do. A bad interface makes a good model look bad. A great interface makes the capability legible.',
  },
]

const THINKING = [
  'What does an interface look like when the model already knows the answer before you ask?',
  'How do you design a feedback loop that makes the model better without making the user feel like a trainer?',
  'At what point does a design system become self-modifying, where usage patterns inform what components should exist?',
  'If voice is the most natural input, why does every AI product still default to text?',
]

export default function LabView() {
  const router = useRouter()
  const [closeHovered, setCloseHovered] = useState(false)
  const [yellowHovered, setYellowHovered] = useState(false)
  const [greenHovered, setGreenHovered] = useState(false)
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [filterQuery, setFilterQuery] = useState('')

  const allTags = Array.from(
    new Set(LAB_FEED.flatMap(entry => entry.tags))
  ).sort()

  const filteredFeed = activeTags.length === 0
    ? LAB_FEED
    : LAB_FEED.filter(entry =>
        activeTags.some(tag => entry.tags.includes(tag))
      )

  const q = filterQuery.trim().toLowerCase()
  const suggestedTags = q.length > 0
    ? allTags.filter(tag =>
        tag.toLowerCase().includes(q) &&
        !activeTags.includes(tag)
      )
    : []

  return (
    <main style={{ minHeight: '100vh', fontFamily: 'var(--font-mono, monospace)' }}>

      {/* Terminal chrome */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        backgroundColor: 'rgba(10, 12, 16, 0.98)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <button
          onClick={() => router.push('/')}
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{
            width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57',
            border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {closeHovered && <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.65)', fontWeight: 700, userSelect: 'none' }}>x</span>}
        </button>
        <span
          onMouseEnter={() => setYellowHovered(true)}
          onMouseLeave={() => setYellowHovered(false)}
          style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          {yellowHovered && <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 700, userSelect: 'none' }}>-</span>}
        </span>
        <span
          onMouseEnter={() => setGreenHovered(true)}
          onMouseLeave={() => setGreenHovered(false)}
          style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          {greenHovered && <span style={{ fontSize: 8, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 700, userSelect: 'none' }}>+</span>}
        </span>
        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginLeft: 10, fontWeight: 300 }}>
          lab.exe
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '120px 48px 160px' }}>

        {/* Header */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 12px' }}>
            the lab
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.9)' }}>
            Open notebook
          </h1>
          <p style={{ fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.4)', margin: '0 0 6px', lineHeight: 1.6 }}>
            Running experiments. Recording findings. Working things out.
          </p>
          <p style={{ fontSize: 11, fontWeight: 300, color: 'rgba(255,255,255,0.2)', margin: 0, lineHeight: 1.6 }}>
            The best interface never asks.
          </p>
        </div>

        {/* Currently thinking about */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 20px' }}>
            currently thinking about
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {THINKING.map((question, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}>
                <span style={{ fontSize: 10, color: 'rgba(0,255,159,0.4)', flexShrink: 0 }}>{'→'}</span>
                <p style={{
                  fontSize: 13,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.55)',
                  margin: 0,
                  lineHeight: 1.6,
                }}>
                  {question}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 56 }} />

        {/* Beliefs */}
        <div style={{ marginBottom: 56 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 28px' }}>
            things I hold true
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {BELIEFS.map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '20px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 32,
                  alignItems: 'start',
                }}
              >
                <p style={{
                  fontSize: 13,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.85)',
                  margin: 0,
                  lineHeight: 1.5,
                }}>
                  {item.belief}
                </p>
                <p style={{
                  fontSize: 12,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  margin: 0,
                  lineHeight: 1.7,
                }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Featured experiments */}
        <div style={{ marginBottom: 72 }}>
          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 24px' }}>
            experiments
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {LAB_EXPERIMENTS.map(exp => (
              <div
                key={exp.id}
                style={{
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.06)',
                  backgroundColor: 'rgba(22,26,34,0.6)',
                  overflow: 'hidden',
                }}
              >
                {/* Card chrome — gray dots because this card is not interactive/closeable */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 14px',
                  backgroundColor: 'rgba(14,16,21,0.8)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block', flexShrink: 0 }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block', flexShrink: 0 }} />
                  <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'block', flexShrink: 0 }} />
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginLeft: 8 }}>{exp.id}.exe</span>
                  <span style={{
                    marginLeft: 'auto', fontSize: 9,
                    color: STATUS_COLORS[exp.status] ?? 'rgba(255,255,255,0.25)',
                    textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    {exp.status}
                  </span>
                </div>

                {/* Card content */}
                <div style={{ padding: '16px 14px 18px' }}>
                  <h3 style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.9)', margin: '0 0 12px' }}>
                    {exp.title}
                  </h3>
                  {exp.description.split('\n\n').map((para, i, arr) => (
                    <p key={i} style={{
                      fontSize: 12, fontWeight: 300, lineHeight: 1.75,
                      color: 'rgba(255,255,255,0.55)',
                      margin: i < arr.length - 1 ? '0 0 12px' : '0 0 14px',
                    }}>
                      {para}
                    </p>
                  ))}
                  {exp.notes && (
                    <p style={{
                      fontSize: 11, fontWeight: 300, lineHeight: 1.6,
                      color: 'rgba(0,255,159,0.45)',
                      margin: '0 0 14px',
                      paddingLeft: 10,
                      borderLeft: '2px solid rgba(0,255,159,0.2)',
                    }}>
                      {exp.notes}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {exp.tags.map(tag => (
                      <span key={tag} style={{
                        fontSize: 9, fontWeight: 300,
                        color: 'rgba(255,255,255,0.25)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 3, padding: '2px 6px',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginBottom: 56 }} />

        {/* Feed */}
        <div>
          {/* Feed header + tag search filter */}
          <div style={{ marginBottom: 32 }}>
            <p style={{
              fontSize: 10, color: 'rgba(255,255,255,0.25)',
              textTransform: 'uppercase', letterSpacing: '0.1em',
              margin: '0 0 14px',
            }}>
              feed
            </p>

            {activeTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {activeTags.map(tag => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => setActiveTags(prev => prev.filter(t => t !== tag))}
                    style={{
                      fontSize: 9,
                      fontWeight: 300,
                      fontFamily: 'var(--font-mono, monospace)',
                      color: '#00ff9f',
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(0,255,159,0.2)',
                      borderRadius: 3,
                      padding: '2px 8px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      transition: 'border-color 0.15s ease',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,159,0.35)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,159,0.2)' }}
                  >
                    {tag}
                    <span style={{ fontSize: 10, opacity: 0.6 }}>×</span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setActiveTags([])}
                  style={{
                    fontSize: 9, fontWeight: 300,
                    fontFamily: 'var(--font-mono, monospace)',
                    color: 'rgba(255,255,255,0.25)',
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 3,
                    padding: '2px 8px',
                    cursor: 'pointer',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#00ff9f' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)' }}
                >
                  clear all
                </button>
              </div>
            )}

            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder="filter by tag..."
                style={{
                  width: '100%',
                  maxWidth: 240,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 300,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'rgba(255,255,255,0.6)',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s ease',
                }}
                onFocus={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,159,0.3)' }}
                onBlur={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
              />

              {suggestedTags.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)',
                  left: 0,
                  minWidth: 180,
                  backgroundColor: 'rgba(14,16,21,0.98)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 4,
                  overflow: 'hidden',
                  zIndex: 10,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                }}>
                  {suggestedTags.slice(0, 6).map((tag, idx, arr) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        setActiveTags(prev => [...prev, tag])
                        setFilterQuery('')
                      }}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        fontSize: 11,
                        fontWeight: 300,
                        fontFamily: 'var(--font-mono, monospace)',
                        color: 'rgba(255,255,255,0.5)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        borderBottom: idx < arr.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        transition: 'color 0.15s ease, background 0.15s ease',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = '#00ff9f'
                        ;(e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(0,255,159,0.05)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'
                        ;(e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {filteredFeed.length === 0 ? (
              <p style={{
                fontSize: 12,
                fontWeight: 300,
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                No entries match these filters.
              </p>
            ) : (
              filteredFeed.map(entry => (
              <div key={entry.id}>
                {/* Entry header */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 300,
                    color: '#00ff9f',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    border: '1px solid rgba(0,255,159,0.2)',
                    borderRadius: 3,
                    padding: '1px 5px',
                    flexShrink: 0,
                  }}>
                    {TYPE_LABELS[entry.type]}
                  </span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 300 }}>
                    {entry.date}
                  </span>
                </div>

                {/* Title */}
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 13, fontWeight: 400,
                      color: 'rgba(255,255,255,0.85)',
                      textDecoration: 'none',
                      display: 'block', marginBottom: 8,
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#00ff9f')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.85)')}
                  >
                    {entry.title} {'→'}
                  </a>
                ) : (
                  <p style={{ fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.85)', margin: '0 0 8px' }}>
                    {entry.title}
                  </p>
                )}

                {/* Body — split on double newlines for multi-paragraph entries */}
                {entry.body.split('\n\n').map((para, i, arr) => (
                  <p key={i} style={{
                    fontSize: 12, fontWeight: 300, lineHeight: 1.8,
                    color: 'rgba(255,255,255,0.5)',
                    margin: i < arr.length - 1 ? '0 0 10px' : '0 0 12px',
                  }}>
                    {para}
                  </p>
                ))}

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {entry.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 9, fontWeight: 300,
                      color: 'rgba(255,255,255,0.2)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 3, padding: '2px 6px',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
