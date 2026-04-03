/**
 * Blocks pointer events on the Swirl wrapper during orbital card hover and for 600ms
 * after hover-off so Swirl mouse handlers do not run during compositor stutter.
 * Module-level timer so rapid card-to-card hovers coalesce correctly.
 */

let swirlWrapperEl: HTMLElement | null = null
let pointerRestoreTimeout: ReturnType<typeof setTimeout> | null = null

const RESTORE_MS = 600

export function setSwirlWrapperElement(el: HTMLElement | null) {
  swirlWrapperEl = el
}

export function onOrbitalCardPointerEnter() {
  if (pointerRestoreTimeout) {
    clearTimeout(pointerRestoreTimeout)
    pointerRestoreTimeout = null
  }
  if (swirlWrapperEl) {
    swirlWrapperEl.style.pointerEvents = 'none'
  }
}

export function onOrbitalCardPointerLeave() {
  if (pointerRestoreTimeout) {
    clearTimeout(pointerRestoreTimeout)
    pointerRestoreTimeout = null
  }
  pointerRestoreTimeout = setTimeout(() => {
    pointerRestoreTimeout = null
    if (swirlWrapperEl) {
      swirlWrapperEl.style.pointerEvents = 'auto'
    }
  }, RESTORE_MS)
}

export function clearSwirlPointerShieldTimer() {
  if (pointerRestoreTimeout) {
    clearTimeout(pointerRestoreTimeout)
    pointerRestoreTimeout = null
  }
}
