/** Session 93 — OrbitalSystem batches chat activations and dispatches staging targets in card-center (physics) space */
export const ORBIT_STAGING_EVENT = 'portfolio:orbit-staging' as const

export type OrbitStagingDetail = {
  projectId: string
  centerX: number
  centerY: number
}

/** Dispatched from ChatPanel when an assistant reply finishes streaming (success, rate limit, or error). Orbital cards wait 2s after this before returning to orbit. */
export const CHAT_RESPONSE_COMPLETE_EVENT = 'portfolio:chat-response-complete' as const
