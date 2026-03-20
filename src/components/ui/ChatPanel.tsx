'use client'

import { useState, useRef, useEffect } from 'react'
import SwirlDotGrid from '@/components/ui/SwirlDotGrid'

interface Message {
  id: string
  role: 'assistant' | 'user'
  content: string
  chips?: string[]
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'greeting',
    role: 'assistant',
    content: "Hi! I'm Joe a design engineer by trade and a creative cosmonaut by nature. What would you like to explore?",
    chips: ['my work', 'my experience', 'about me', 'my resume', 'contact'],
  },
]

const AssistantAvatar = () => (
  <div
    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
    style={{ border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' }}
  >
    <svg
      viewBox="19 23 207 249"
      width="14"
      height="14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ opacity: 0.8 }}
    >
      <rect x="19.2" y="245.8" width="206.6" height="25.8" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
      <line x1="19.5" y1="219.5" x2="19.5" y2="49.1" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
      <circle cx="19.5" cy="36.2" r="12.9" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
      <line x1="161.2" y1="73.2" x2="118.2" y2="155" stroke="white" strokeWidth="8.61" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="225.8" y1="180.8" x2="122.5" y2="180.8" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
      <circle cx="122.5" cy="167.9" r="12.9" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
      <path d="M19.2,219.5h206.6v-51.7c0-57.1-46.2-103.3-103.3-103.3S19.2,110.8,19.2,167.9V219.5L19.2,219.5z" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
      <line x1="37.8" y1="222.9" x2="37.8" y2="245.8" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
      <line x1="207.2" y1="222.9" x2="207.2" y2="245.8" stroke="white" strokeWidth="8.61" strokeLinejoin="round"/>
    </svg>
  </div>
)

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idCounter = useRef(100)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: String(++idCounter.current),
      role: 'user',
      content: content.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    setTimeout(() => {
      const response: Message = {
        id: String(++idCounter.current),
        role: 'assistant',
        content: `got it — you asked about "${content.trim()}". AI integration coming next session.`,
        chips: ['tell me more', 'show me the work', 'something else'],
      }
      setMessages((prev) => [...prev, response])
      setIsLoading(false)
    }, 800)
  }

  const handleSubmit = () => sendMessage(input)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div
      className="w-full max-w-2xl h-[75vh] flex flex-col rounded-lg overflow-hidden"
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
        {messages.map((message) => (
          <div key={message.id}>
            {message.role === 'assistant' ? (
              <div className="flex gap-3 items-start">
                <AssistantAvatar />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-light text-text-secondary leading-relaxed">
                    {message.content}
                  </p>
                  {message.chips && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.chips.map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => sendMessage(chip)}
                          className="font-mono text-xs font-light text-text-secondary hover:text-accent-neon transition-colors duration-200 px-3 py-1.5"
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '20px',
                          }}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div
                  className="font-mono text-sm font-light text-white max-w-xs px-4 py-2"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
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

        {/* Thinking state */}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <AssistantAvatar />
            <div className="flex flex-col gap-2 pt-0.5">
              <SwirlDotGrid
                cols={6}
                rows={4}
                dotSize={4}
                gap={3}
                speed={0.055}
              />
              <p className="font-mono text-xs font-light text-text-hint">
                thinking...
              </p>
            </div>
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
          <span className="font-mono text-xs text-accent-warm flex-shrink-0 select-none">&gt;</span>
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
            className="flex-1 bg-transparent font-mono text-sm font-light text-white placeholder:text-text-hint focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim() || isLoading}
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
