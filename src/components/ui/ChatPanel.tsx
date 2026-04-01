'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import SwirlDotGrid from '@/components/ui/SwirlDotGrid'
import { PROJECTS } from '@/content/projects'
import { useChatMessages, useChatUI, type ChatCard, type Message } from '@/context/ChatContext'
import { useNavWidthContext } from '@/context/NavWidthContext'
import { useIsMobile } from '@/hooks/useIsMobile'

function detectProjectMention(text: string): string | null {
  const lower = text.toLowerCase()
  for (const project of PROJECTS) {
    if (project.keywords.some(kw => lower.includes(kw))) {
      return project.id
    }
  }
  return null
}

const CHIPS = [
  { label: 'my work', message: 'Tell me about your work' },
  { label: 'my experience', message: 'Walk me through your experience' },
  { label: 'about me', message: 'Tell me about yourself' },
  { label: 'my resume', message: 'I want to see your resume' },
  { label: 'contact', message: 'How can I get in touch with you?' },
] as const

const CARDS_STRIP_REGEX = /\s*\{"cards":\[.*?\]\}\s*$/

interface AssistantAvatarProps {
  thinking?: boolean
}

const THINKING_CHARS = 'thinking...'.split('')

const ThinkingText = () => (
  <span style={{ display: 'inline-flex' }}>
    {THINKING_CHARS.map((char, i) => (
      <span
        key={i}
        style={{
          animation: 'thinking-shimmer 1.6s ease-in-out infinite',
          animationDelay: `${i * 80}ms`,
        }}
      >
        {char}
      </span>
    ))}
  </span>
)

export type ChatPanelVariant = 'embedded' | 'overlay'

interface ChatPanelProps {
  /** `embedded` = homepage persistent panel (gray chrome). `overlay` = nav Chat overlay (colored chrome + close). */
  variant?: ChatPanelVariant
}

const AssistantAvatar = ({ thinking = false }: AssistantAvatarProps) => (
  <div
    className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden relative"
    style={{
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
    }}
  >
    {/* SwirlDotGrid — visible when thinking */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: thinking ? 1 : 0,
        transition: 'opacity 0.7s ease',
        pointerEvents: 'none',
      }}
    >
      <SwirlDotGrid cols={4} rows={4} dotSize={3} gap={2} speed={0.055} />
    </div>

    {/* Avatar icon — visible when not thinking */}
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: thinking ? 0 : 1,
        transition: 'opacity 0.7s ease',
      }}
    >
      <Image
        src="/logo-update.svg"
        alt="Assistant"
        width={18}
        height={18}
        style={{ opacity: 0.9 }}
      />
    </div>
  </div>
)

export default function ChatPanel({ variant = 'embedded' }: ChatPanelProps) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const { close: closeChatOverlay, isLimitReached, incrementMessageCount } = useChatUI()
  const {
    messages,
    setMessages,
    isLoading,
    streamingGreetingContent,
    resetConversation,
  } = useChatMessages()
  const { desktopNavWidthPx } = useNavWidthContext()
  const isOverlay = variant === 'overlay'
  const [input, setInput] = useState('')
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sendMessageRef = useRef<(content: string) => void>(() => {})
  const scrollRafRef = useRef(0)

  function scrollToBottom() {
    if (scrollRafRef.current) return
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  function handleInputFocus() {
    if (isMobile) {
      window.setTimeout(scrollToBottom, 300)
    }
  }

  const mobileTouch = isMobile ? ({ touchAction: 'manipulation' as const }) : {}

  useEffect(() => {
    function handleCardClick(e: Event) {
      const event = e as CustomEvent<{ query: string }>
      sendMessageRef.current(event.detail.query)
    }
    window.addEventListener('portfolio:query', handleCardClick)
    return () => window.removeEventListener('portfolio:query', handleCardClick)
  }, [])

  async function handleSend(text: string) {
    const trimmed = text.trim()
    if (!trimmed || isResponseLoading || isLoading || messages.length === 0 || isLimitReached)
      return

    incrementMessageCount()

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      cards: undefined,
      isStreaming: true,
    }

    setMessages(prev => [...prev, userMessage, assistantMessage])
    setInput('')
    setIsResponseLoading(true)

    const projectId = detectProjectMention(trimmed)
    if (projectId) {
      window.dispatchEvent(
        new CustomEvent('portfolio:project-active', {
          detail: { projectId },
        })
      )
    }

    const apiMessages = [...messages, userMessage]
      .filter(m => m.id !== 'greeting')
      .filter(
        m =>
          m.role === 'user' ||
          (m.role === 'assistant' && m.content.trim() !== '')
      )
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (response.status === 429) {
        setMessages(prev =>
          prev.map(m =>
            m.id === assistantMessage.id
              ? {
                  ...m,
                  content:
                    "You've sent a lot of messages. Take a break and try again in an hour.",
                  isStreaming: false,
                }
              : m
          )
        )
        return
      }

      if (!response.ok) throw new Error('Chat request failed')

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      // RAF-batch streaming text renders — at most 1 React update per display frame.
      // Tokens arrive faster than 60fps can display; accumulate in a plain ref and
      // flush via requestAnimationFrame so the render scheduler is not saturated.
      const msgId = assistantMessage.id
      let streamRafId = 0
      let pendingDisplayText = ''

      function flushStreamText() {
        streamRafId = 0
        const t = pendingDisplayText
        setMessages(prev =>
          prev.map(m => (m.id === msgId ? { ...m, content: t, isStreaming: true } : m))
        )
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.trim()) continue
          try {
            const parsed = JSON.parse(line) as {
              type?: string
              text?: string
              cards?: ChatCard[]
            }

            if (parsed.type === 'text' && typeof parsed.text === 'string') {
              fullText += parsed.text
              pendingDisplayText = fullText.replace(CARDS_STRIP_REGEX, '').trim()
              if (!streamRafId) {
                streamRafId = requestAnimationFrame(flushStreamText)
              }
            }

            if (parsed.type === 'cards' && Array.isArray(parsed.cards)) {
              const nextCards =
                parsed.cards.length > 0 ? (parsed.cards as ChatCard[]) : undefined
              setMessages(prev =>
                prev.map(m =>
                  m.id === assistantMessage.id ? { ...m, cards: nextCards } : m
                )
              )
            }
          } catch {
            // ignore malformed lines
          }
        }
      }

      // Cancel any pending RAF flush and commit the final text synchronously
      if (streamRafId) cancelAnimationFrame(streamRafId)

      const displayText = fullText.replace(CARDS_STRIP_REGEX, '').trim()
      // Cards already merged on this message from `cards` NDJSON lines — do not overwrite here
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id
            ? { ...m, content: displayText, isStreaming: false }
            : m
        )
      )
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev =>
        prev.map(m =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: 'Something went wrong. Try again.',
                cards: undefined,
                isStreaming: false,
              }
            : m
        )
      )
    } finally {
      setIsResponseLoading(false)
    }
  }

  sendMessageRef.current = handleSend

  const handleSubmit = () => handleSend(input)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const chipDisabled = isLoading || isResponseLoading || messages.length === 0

  function openCardHref(href: string) {
    if (href.startsWith('mailto') || href.endsWith('.pdf')) {
      window.open(href, '_blank')
    } else {
      router.push(href)
    }
  }

  return (
    <div
      id={isOverlay ? undefined : 'chat-panel'}
      className="flex flex-col rounded-lg overflow-hidden pointer-events-auto"
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        width: isMobile ? 'calc(100vw - 32px)' : `${desktopNavWidthPx}px`,
        maxWidth: '100%',
        height: isMobile ? 'calc(100dvh - 140px)' : '75vh',
        maxHeight: isMobile ? 'calc(100dvh - 140px)' : '80vh',
        backgroundColor: 'rgba(22, 26, 34, 0.92)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0,
          height: isMobile ? '100%' : '100%',
          maxHeight: isMobile ? '100%' : '100%',
          overflow: 'hidden',
        }}
      >
        {/* Terminal chrome — gray (embedded / not closeable) vs colored (overlay / dismissible) */}
        <div
          className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
          style={{
            backgroundColor: 'rgba(14, 16, 21, 0.8)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {isOverlay ? (
            <>
              <button
                type="button"
                title="Close"
                aria-label="Close chat"
                onClick={() => closeChatOverlay()}
                className="chat-dot"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#ff5f57',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...mobileTouch,
                }}
              >
                <span className="chat-dot-glyph" style={{ fontSize: 7, lineHeight: 1, color: 'rgba(0,0,0,0.65)', fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }}>×</span>
              </button>
              <span
                role="presentation"
                className="chat-dot"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#febc2e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span className="chat-dot-glyph" style={{ fontSize: 7, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }}>−</span>
              </span>
              <button
                type="button"
                title="New conversation"
                aria-label="New conversation"
                onClick={() => resetConversation()}
                className="chat-dot"
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#28c840',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  ...mobileTouch,
                }}
              >
                <span className="chat-dot-glyph" style={{ fontSize: 7, lineHeight: 1, color: 'rgba(0,0,0,0.5)', fontWeight: 500, userSelect: 'none', pointerEvents: 'none' }}>+</span>
              </button>
            </>
          ) : (
            <>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  display: 'block',
                  flexShrink: 0,
                }}
              />
              <button
                type="button"
                title="New conversation"
                aria-label="New conversation"
                onClick={() => resetConversation()}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'block',
                  flexShrink: 0,
                  ...mobileTouch,
                }}
              />
            </>
          )}
          <span className="font-mono text-xs text-text-hint ml-3 flex-1">
            portfolio.navigator
          </span>
        </div>

        {/* Messages */}
        <div
          className="px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10"
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Phases 1 + 2: mounted until greeting message lands — no gap between phases */}
          {messages.length === 0 && (
            <div className="flex gap-3 items-start">
              <AssistantAvatar thinking={isLoading} />
              <div className="flex-1 min-w-0 relative" style={{ minHeight: '1.25rem' }}>
                {/* "thinking..." — fades out as streaming begins */}
                <span
                  className="font-mono text-xs font-light text-text-hint absolute inset-0 flex items-center"
                  style={{
                    opacity: isLoading ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                    pointerEvents: 'none',
                  }}
                >
                  <ThinkingText />
                </span>
                {/* Streaming text — fades in */}
                <p
                  className="font-mono text-sm font-light text-text-secondary leading-relaxed"
                  style={{
                    opacity: streamingGreetingContent ? 1 : 0,
                    transition: 'opacity 0.6s ease',
                  }}
                >
                  {streamingGreetingContent || '\u00A0'}
                  {streamingGreetingContent && (
                    <span
                      style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '13px',
                        marginLeft: '2px',
                        verticalAlign: 'middle',
                        backgroundColor: '#00ff9f',
                        animation: 'blink 0.8s step-end infinite',
                      }}
                    />
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Phase 3: Full messages */}
          {messages.map(message =>
            message.role === 'assistant' ? (
              <div key={message.id} className="flex gap-3 items-start">
                <AssistantAvatar
                  thinking={!!message.isStreaming && !message.content}
                />
                <div className="flex-1 min-w-0">
                  {message.isStreaming && !message.content ? (
                    <p className="font-mono text-xs font-light text-text-hint">
                      <ThinkingText />
                    </p>
                  ) : (
                    <>
                      <p className="font-mono text-sm font-light text-text-secondary leading-relaxed">
                        {message.content}
                        {message.isStreaming && message.content ? (
                          <span
                            style={{
                              display: 'inline-block',
                              width: '2px',
                              height: '13px',
                              marginLeft: '2px',
                              verticalAlign: 'middle',
                              backgroundColor: '#00ff9f',
                              animation: 'blink 0.8s step-end infinite',
                            }}
                          />
                        ) : null}
                      </p>
                      {message.cards &&
                        message.cards.length > 0 &&
                        !message.isStreaming && (
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 6,
                              marginTop: 10,
                            }}
                          >
                            {message.cards.map(card => (
                              <div
                                key={card.key}
                                role="button"
                                tabIndex={0}
                                onClick={() => openCardHref(card.href)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault()
                                    openCardHref(card.href)
                                  }
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '8px 12px',
                                  backgroundColor: 'rgba(255,255,255,0.03)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  borderRadius: 6,
                                  cursor: 'pointer',
                                }}
                                onMouseEnter={e => {
                                  const el = e.currentTarget as HTMLElement
                                  const title = el.querySelector('.card-title') as HTMLElement | null
                                  const arrow = el.querySelector('.card-arrow') as HTMLElement | null
                                  if (title) title.style.color = '#00ff9f'
                                  if (arrow) arrow.style.color = '#00ff9f'
                                }}
                                onMouseLeave={e => {
                                  const el = e.currentTarget as HTMLElement
                                  const title = el.querySelector('.card-title') as HTMLElement | null
                                  const arrow = el.querySelector('.card-arrow') as HTMLElement | null
                                  if (title) title.style.color = 'rgba(255,255,255,0.7)'
                                  if (arrow) arrow.style.color = 'rgba(0,255,159,0.5)'
                                }}
                              >
                                <span
                                  className="card-title"
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 300,
                                    color: 'rgba(255,255,255,0.7)',
                                    fontFamily: 'var(--font-mono)',
                                    transition: 'color 0.15s ease',
                                  }}
                                >
                                  {card.label}
                                </span>
                                <span
                                  className="card-arrow"
                                  style={{
                                    fontSize: 11,
                                    color: 'rgba(0,255,159,0.5)',
                                    fontFamily: 'var(--font-mono)',
                                    flexShrink: 0,
                                    marginLeft: 12,
                                    transition: 'color 0.15s ease',
                                  }}
                                >
                                  →
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div key={message.id} className="flex justify-end">
                <div
                  className="font-mono text-sm font-light text-white max-w-xs px-4 py-2"
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '16px 16px 4px 16px',
                  }}
                >
                  {message.content}
                </div>
              </div>
            )
          )}

          <div ref={messagesEndRef} style={{ height: 1 }} />
        </div>

        {/* Input bar — pinned below scrollable messages */}
        <div
          className="flex-shrink-0 pt-3 flex flex-col gap-2.5 px-0"
          style={{
            flexShrink: 0,
            backgroundColor: 'rgba(14, 16, 21, 0.6)',
            borderTop: isLimitReached ? 'none' : '1px solid rgba(255, 255, 255, 0.06)',
            paddingBottom: isMobile ? 'calc(12px + env(safe-area-inset-bottom, 0px))' : 12,
          }}
        >
          {isLimitReached ? (
            <div
              style={{
                padding: '14px 16px',
                borderTop: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 300,
                  color: 'rgba(255,255,255,0.4)',
                  margin: 0,
                  fontFamily: 'var(--font-mono)',
                  lineHeight: 1.6,
                }}
              >
                You&apos;ve reached the message limit for this session. Refresh the page to start a new
                conversation.
              </p>
            </div>
          ) : (
            <>
              {/* Chips — always visible, never hidden */}
              <div
                className="flex flex-wrap"
                style={{
                  gap: 8,
                  padding: '10px 16px 0',
                }}
              >
                {CHIPS.map(chip => (
                  <button
                    key={chip.label}
                    type="button"
                    disabled={chipDisabled}
                    onClick={() => handleSend(chip.message)}
                    className="chip-button font-mono text-xs font-light px-3 py-1.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      ...mobileTouch,
                    }}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-4">
                <span
                  className="font-mono text-xs flex-shrink-0 select-none"
                  style={{ color: '#00ff9f' }}
                >
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value)
                    window.dispatchEvent(new CustomEvent('swirl:keypress'))
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={handleInputFocus}
                  placeholder="ask me anything..."
                  aria-label="Ask about Joe's work or approach"
                  autoFocus
                  className={
                    isMobile
                      ? 'flex-1 bg-transparent font-mono font-light text-white placeholder:text-text-hint focus:outline-none'
                      : 'flex-1 bg-transparent font-mono text-sm font-light text-white placeholder:text-text-hint focus:outline-none'
                  }
                  style={{
                    caretColor: '#00ff9f',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 300,
                    fontSize: isMobile ? '16px' : '13px',
                    ...mobileTouch,
                  }}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={
                    !input.trim() ||
                    isResponseLoading ||
                    isLoading ||
                    messages.length === 0
                  }
                  aria-label="Send message"
                  className="rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                  style={{
                    width: isMobile ? 44 : 28,
                    height: isMobile ? 44 : 28,
                    minWidth: isMobile ? 44 : undefined,
                    minHeight: isMobile ? 44 : undefined,
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    ...mobileTouch,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path
                      d="M6 10V2M2 6l4-4 4 4"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
