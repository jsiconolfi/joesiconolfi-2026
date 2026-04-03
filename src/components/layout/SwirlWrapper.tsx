'use client'

import { useEffect, useRef } from 'react'
import Swirl from '@/components/ui/Swirl'
import {
  clearSwirlPointerShieldTimer,
  setSwirlWrapperElement,
} from '@/lib/swirlPointerShield'

/** Wraps Swirl so pointer-events can be toggled without editing Swirl.tsx */
export default function SwirlWrapper() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSwirlWrapperElement(ref.current)
    return () => {
      clearSwirlPointerShieldTimer()
      setSwirlWrapperElement(null)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-0 h-screen w-screen"
      style={{ pointerEvents: 'auto' }}
    >
      <Swirl className="h-full w-full" />
    </div>
  )
}
