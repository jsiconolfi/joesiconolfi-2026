'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

/** Fallback before / if nav measure fails — matches prior fixed chat width. */
export const DEFAULT_DESKTOP_NAV_WIDTH_PX = 560

interface NavWidthContextValue {
  desktopNavWidthPx: number
  setDesktopNavWidthPx: (w: number) => void
}

const NavWidthContext = createContext<NavWidthContextValue | null>(null)

export function NavWidthProvider({ children }: { children: ReactNode }) {
  const [desktopNavWidthPx, setState] = useState(DEFAULT_DESKTOP_NAV_WIDTH_PX)

  const setDesktopNavWidthPx = useCallback((w: number) => {
    setState(w > 0 ? Math.round(w) : DEFAULT_DESKTOP_NAV_WIDTH_PX)
  }, [])

  return (
    <NavWidthContext.Provider value={{ desktopNavWidthPx, setDesktopNavWidthPx }}>
      {children}
    </NavWidthContext.Provider>
  )
}

export function useNavWidthContext() {
  const ctx = useContext(NavWidthContext)
  if (!ctx) throw new Error('useNavWidthContext must be used within NavWidthProvider')
  return ctx
}
