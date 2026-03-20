'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { HeroTextProps } from '@/types/hero'

type Phase = 'name' | 'role' | 'thesis' | 'done'

const CHAR_DELAY_NAME = 40
const CHAR_DELAY_THESIS = 55
const ROLE_FADE_DELAY = 0.3
const THESIS_PAUSE_AFTER_ROLE = 600

export default function HeroText({ name, role, thesis }: HeroTextProps) {
  const [displayedName, setDisplayedName] = useState('')
  const [displayedThesis, setDisplayedThesis] = useState('')
  const [phase, setPhase] = useState<Phase>('name')
  const [prefersReduced, setPrefersReduced] = useState(false)
  const nameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const thesisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mq.matches)

    if (mq.matches) {
      setDisplayedName(name)
      setDisplayedThesis(thesis)
      setPhase('done')
      return
    }

    let nameIdx = 0

    function typeNextNameChar() {
      setDisplayedName(name.slice(0, nameIdx + 1))
      nameIdx++
      if (nameIdx < name.length) {
        nameTimerRef.current = setTimeout(typeNextNameChar, CHAR_DELAY_NAME)
      } else {
        setTimeout(() => {
          setPhase('role')
          setTimeout(() => {
            setPhase('thesis')
            let thesisIdx = 0
            function typeNextThesisChar() {
              setDisplayedThesis(thesis.slice(0, thesisIdx + 1))
              thesisIdx++
              if (thesisIdx < thesis.length) {
                thesisTimerRef.current = setTimeout(
                  typeNextThesisChar,
                  CHAR_DELAY_THESIS
                )
              } else {
                setPhase('done')
              }
            }
            typeNextThesisChar()
          }, THESIS_PAUSE_AFTER_ROLE)
        }, ROLE_FADE_DELAY * 1000 + 400)
      }
    }

    nameTimerRef.current = setTimeout(typeNextNameChar, 300)

    return () => {
      if (nameTimerRef.current) clearTimeout(nameTimerRef.current)
      if (thesisTimerRef.current) clearTimeout(thesisTimerRef.current)
    }
  }, [name, thesis])

  return (
    <div className="relative z-10 flex flex-col">
      {/* Name — largest, IBM Plex Mono, confident */}
      <h1 className="font-mono text-5xl md:text-6xl font-normal text-white tracking-tight leading-none mb-3">
        {displayedName}
        {phase === 'name' && !prefersReduced && (
          <span
            className="inline-block w-0.5 h-[0.85em] bg-accent-warm ml-0.5 align-middle animate-pulse"
            aria-hidden="true"
          />
        )}
      </h1>

      {/* Role — smallest, uppercase label, quiet */}
      {(phase === 'role' || phase === 'thesis' || phase === 'done') && (
        <motion.p
          className="font-mono text-xs font-light text-text-hint uppercase tracking-[0.2em] mb-5"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {role}
        </motion.p>
      )}

      {/* Thesis — Playfair Display, the one editorial moment */}
      {(phase === 'thesis' || phase === 'done') && (
        <motion.p
          className="font-mono text-lg md:text-xl font-light text-text-secondary leading-relaxed max-w-lg mb-8"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {displayedThesis}
          {phase === 'thesis' && !prefersReduced && (
            <span
              className="inline-block w-0.5 h-[0.85em] bg-accent-warm ml-0.5 align-middle animate-pulse"
              aria-hidden="true"
            />
          )}
        </motion.p>
      )}
    </div>
  )
}
