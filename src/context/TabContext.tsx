'use client'

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'

export interface Tab {
  slug: string
  name: string  // display name e.g. "Waypoint"
  exe: string   // e.g. "waypoint.exe"
}

interface TabContextValue {
  tabs: Tab[]
  activeSlug: string | null
  openTab: (tab: Tab) => void
  closeTab: (slug: string) => void
  setActiveSlug: (slug: string) => void
}

const TabContext = createContext<TabContextValue>({
  tabs: [],
  activeSlug: null,
  openTab: () => {},
  closeTab: () => {},
  setActiveSlug: () => {},
})

export function TabProvider({ children }: { children: React.ReactNode }) {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [activeSlug, setActiveSlugState] = useState<string | null>(null)
  const historyRef = useRef<string[]>([])
  const router = useRouter()

  const setActiveSlug = useCallback((slug: string) => {
    setActiveSlugState(slug)
    historyRef.current = [
      slug,
      ...historyRef.current.filter(s => s !== slug),
    ].slice(0, 20)
  }, [])

  const openTab = useCallback((tab: Tab) => {
    setTabs(prev => {
      if (prev.find(t => t.slug === tab.slug)) return prev
      if (prev.length >= 10) return prev
      return [...prev, tab]
    })
    setActiveSlug(tab.slug)
  }, [setActiveSlug])

  const closeTab = useCallback((slug: string) => {
    setTabs(prev => {
      const next = prev.filter(t => t.slug !== slug)

      if (next.length === 0) {
        setActiveSlugState(null)
        historyRef.current = []
        // Schedule navigation outside the updater
        setTimeout(() => router.push('/work'), 0)
        return next
      }

      const nextSlug = historyRef.current.find(
        s => s !== slug && next.find(t => t.slug === s)
      ) ?? next[next.length - 1].slug

      setActiveSlugState(nextSlug)
      historyRef.current = historyRef.current.filter(s => s !== slug)
      // Schedule navigation outside the updater
      setTimeout(() => router.push(`/work/${nextSlug}`), 0)
      return next
    })
  }, [router])

  return (
    <TabContext.Provider value={{ tabs, activeSlug, openTab, closeTab, setActiveSlug }}>
      {children}
    </TabContext.Provider>
  )
}

export function useTabs() {
  return useContext(TabContext)
}
