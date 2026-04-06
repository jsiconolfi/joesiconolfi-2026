'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export interface ChatCard {
  key: string
  label: string
  description: string
  href: string
  type: 'case-study' | 'page' | 'action'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  cards?: ChatCard[]
  isStreaming?: boolean
}

export const INITIAL_MESSAGE: Message = {
  id: 'greeting',
  role: 'assistant',
  content:
    "Hi! I'm Joe, a designer and engineer by trade and a creative cosmonaut by nature. What would you like to explore?",
  cards: [
    {
      key: 'work',
      label: 'Case Studies',
      description: '10 projects across AI, design systems, and product',
      href: '/work',
      type: 'page',
    },
    {
      key: 'about',
      label: 'About',
      description: 'Background, approach, and outside the terminal',
      href: '/about',
      type: 'page',
    },
  ],
}

/** Fresh greeting row for React state — never store the `INITIAL_MESSAGE` module singleton. */
export function cloneGreetingMessage(): Message {
  return {
    ...INITIAL_MESSAGE,
    cards: INITIAL_MESSAGE.cards?.map(c => ({ ...c })),
  }
}

/** ms between greeting characters (API reply drain uses separate constants in `ChatPanel.tsx`). */
export const STREAM_SPEED = 28

/** User sends per browser session; refresh resets. Not reset by `resetConversation()`. */
const MESSAGE_LIMIT = 30

/** Stable UI state — consumed by Nav, ChatOverlay, etc. Does not change on each streaming token. */
export interface ChatUIContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  isLimitReached: boolean
  messageCount: number
  incrementMessageCount: () => void
}

/** Message thread — changes frequently during streaming; consume only from ChatPanel. */
export interface ChatMessagesContextValue {
  messages: Message[]
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  streamingGreetingContent: string
  resetConversation: () => void
}

export type ChatContextValue = ChatUIContextValue & ChatMessagesContextValue

const ChatUIContext = createContext<ChatUIContextValue | null>(null)
const ChatMessagesContext = createContext<ChatMessagesContextValue | null>(null)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [streamingGreetingContent, setStreamingGreetingContent] = useState('')
  const [messageCount, setMessageCount] = useState(0)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  const resetConversation = useCallback(() => {
    setMessages([cloneGreetingMessage()])
    setIsLoading(false)
    setStreamingGreetingContent('')
  }, [])

  const incrementMessageCount = useCallback(() => {
    setMessageCount(prev => prev + 1)
  }, [])

  const isLimitReached = messageCount >= MESSAGE_LIMIT

  /** Single greeting sequence for the whole app — avoids duplicate timers when embedded + overlay panels mount. */
  useEffect(() => {
    if (messages.length > 0) {
      setIsLoading(false)
      return
    }

    let cancelled = false
    let streamInterval: number | undefined

    const thinkingTimer = window.setTimeout(() => {
      if (cancelled) return
      setIsLoading(false)

      let i = 0
      const text = INITIAL_MESSAGE.content
      streamInterval = window.setInterval(() => {
        if (cancelled) return
        i++
        setStreamingGreetingContent(text.slice(0, i))

        if (i >= text.length) {
          clearInterval(streamInterval)
          streamInterval = undefined

          window.setTimeout(() => {
            if (cancelled) return
            setMessages([cloneGreetingMessage()])
            setStreamingGreetingContent('')
          }, 300)
        }
      }, STREAM_SPEED)
    }, 1500)

    return () => {
      cancelled = true
      clearTimeout(thinkingTimer)
      if (streamInterval !== undefined) clearInterval(streamInterval)
    }
  }, [messages.length])

  const uiValue = useMemo(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      isLimitReached,
      messageCount,
      incrementMessageCount,
    }),
    [isOpen, open, close, toggle, isLimitReached, messageCount, incrementMessageCount]
  )

  const messagesValue = useMemo(
    () => ({
      messages,
      setMessages,
      isLoading,
      setIsLoading,
      streamingGreetingContent,
      resetConversation,
    }),
    [messages, isLoading, streamingGreetingContent, resetConversation]
  )

  return (
    <ChatUIContext.Provider value={uiValue}>
      <ChatMessagesContext.Provider value={messagesValue}>{children}</ChatMessagesContext.Provider>
    </ChatUIContext.Provider>
  )
}

export function useChatUI(): ChatUIContextValue {
  const ctx = useContext(ChatUIContext)
  if (!ctx) throw new Error('useChatUI must be used within ChatProvider')
  return ctx
}

export function useChatMessages(): ChatMessagesContextValue {
  const ctx = useContext(ChatMessagesContext)
  if (!ctx) throw new Error('useChatMessages must be used within ChatProvider')
  return ctx
}

/** Backwards-compatible: full chat surface API (UI + messages). Prefer `useChatUI` / `useChatMessages` where split helps. */
export function useChatContext(): ChatContextValue {
  return { ...useChatUI(), ...useChatMessages() }
}

/** Alias of `useChatContext` — merged UI + messages API. */
export function useChat(): ChatContextValue {
  return useChatContext()
}
