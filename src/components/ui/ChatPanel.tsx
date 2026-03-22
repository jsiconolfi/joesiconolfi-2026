'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import SwirlDotGrid from '@/components/ui/SwirlDotGrid'
import { PROJECTS } from '@/content/projects'

function detectProjectMention(text: string): string | null {
  const lower = text.toLowerCase()
  for (const project of PROJECTS) {
    if (project.keywords.some(kw => lower.includes(kw))) {
      return project.id
    }
  }
  return null
}

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const GREETING = "Hi! I'm Joe a design engineer by trade and a creative cosmonaut by nature. What would you like to explore?"

// ms per character — 28ms matches Claude's streaming feel
const STREAM_SPEED = 28

interface AssistantAvatarProps {
  thinking?: boolean
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

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [streamingContent, setStreamingContent] = useState('')
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idCounter = useRef(100)
  const sendMessageRef = useRef<(content: string) => void>(() => {})

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Phase 1: show thinking state for 1.5s
    const thinkingTimer = setTimeout(() => {
      setIsLoading(false)

      // Phase 2: stream greeting in character by character
      let i = 0
      const streamInterval = setInterval(() => {
        i++
        setStreamingContent(GREETING.slice(0, i))

        if (i >= GREETING.length) {
          clearInterval(streamInterval)

          // Phase 3: streaming complete — add full message with chips
          // Small delay so the cursor doesn't vanish instantly
          setTimeout(() => {
            setMessages([{
              id: 'greeting',
              role: 'assistant',
              content: GREETING,
            }])
            setStreamingContent('')
          }, 300)
        }
      }, STREAM_SPEED)

      return () => clearInterval(streamInterval)
    }, 1500)

    return () => clearTimeout(thinkingTimer)
  }, [])

  useEffect(() => {
    function handleCardClick(e: Event) {
      const event = e as CustomEvent<{ query: string }>
      sendMessageRef.current(event.detail.query)
    }
    window.addEventListener('portfolio:query', handleCardClick)
    return () => window.removeEventListener('portfolio:query', handleCardClick)
  }, [])

  const sendMessage = (content: string) => {
    if (!content.trim() || isResponseLoading) return

    const userMessage: Message = {
      id: String(++idCounter.current),
      role: 'user',
      content: content.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsResponseLoading(true)

    const projectId = detectProjectMention(content)
    if (projectId) {
      window.dispatchEvent(
        new CustomEvent('portfolio:project-active', {
          detail: { projectId },
        })
      )
    }

    setTimeout(() => {
      const response: Message = {
        id: String(++idCounter.current),
        role: 'assistant',
        content: `got it — you asked about "${content.trim()}". AI integration coming next session.`,
      }
      setMessages((prev) => [...prev, response])
      setIsResponseLoading(false)
    }, 800)
  }

  // Keep ref current so the portfolio:query event handler always calls the latest version
  sendMessageRef.current = sendMessage

  const handleSubmit = () => sendMessage(input)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      id="chat-panel"
      className="w-full max-w-2xl h-[75vh] flex flex-col rounded-lg overflow-hidden pointer-events-auto"
      style={{
        backgroundColor: 'rgba(22, 26, 34, 0.7)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Terminal chrome header */}
      <div
        className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
        style={{
          backgroundColor: 'rgba(14, 16, 21, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="w-3 h-3 rounded-full bg-white/15" />
        <span className="font-mono text-xs text-text-hint ml-3 flex-1">
          portfolio.navigator
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
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
                thinking...
              </span>
              {/* Streaming text — fades in */}
              <p
                className="font-mono text-sm font-light text-text-secondary leading-relaxed"
                style={{
                  opacity: streamingContent ? 1 : 0,
                  transition: 'opacity 0.6s ease',
                }}
              >
                {streamingContent || '\u00A0'}
                {streamingContent && (
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
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'assistant' ? (
              <div className="flex gap-3 items-start">
                <AssistantAvatar thinking={false} />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-light text-text-secondary leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
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
            )}
          </div>
        ))}

        {/* Subsequent AI responses loading state */}
        {!isLoading && messages.length > 0 && isResponseLoading && (
          <div className="flex gap-3 items-center">
            <AssistantAvatar thinking={true} />
            <p className="font-mono text-xs font-light text-text-hint">thinking...</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        className="flex-shrink-0 px-4 pt-3 pb-3 flex flex-col gap-2.5"
        style={{
          backgroundColor: 'rgba(14, 16, 21, 0.6)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Persistent suggestion chips */}
        <div className="flex flex-wrap gap-2">
          {['my work', 'my experience', 'about me', 'my resume', 'contact'].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => sendMessage(chip)}
              className="font-mono text-xs font-light text-text-secondary hover:text-accent-neon transition-colors duration-200 px-3 py-1.5"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
              }}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs flex-shrink-0 select-none" style={{ color: '#00ff9f' }}>&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              window.dispatchEvent(new CustomEvent('swirl:keypress'))
            }}
            onKeyDown={handleKeyDown}
            placeholder="ask me anything..."
            aria-label="Ask about Joe's work or approach"
            autoFocus
            className="flex-1 bg-transparent font-mono text-sm font-light text-white placeholder:text-text-hint focus:outline-none"
            style={{ caretColor: '#00ff9f' }}
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim() || isResponseLoading}
            aria-label="Send message"
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
            style={{ border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'
            }}
            onMouseLeave={(e) => {
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
      </div>
    </div>
  )
}
