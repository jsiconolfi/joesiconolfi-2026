/** Minimal shapes for ESPN site API team schedule JSON (no API key). */

export interface EspnStatusType {
  state?: string
  shortDetail?: string
}

export interface EspnCompetitionStatus {
  period?: number
  displayClock?: string
  type?: EspnStatusType
}

export interface EspnTeamRef {
  abbreviation?: string
  displayName?: string
}

export interface EspnCompetitorScore {
  value?: number
  displayValue?: string
}

export interface EspnCompetitor {
  homeAway?: string
  score?: EspnCompetitorScore | string
  team?: EspnTeamRef
}

export interface EspnVenue {
  fullName?: string
}

export interface EspnCompetition {
  status?: EspnCompetitionStatus
  venue?: EspnVenue
  competitors?: EspnCompetitor[]
}

export interface EspnScheduleEvent {
  date: string
  competitions?: EspnCompetition[]
}

export interface EspnSchedulePayload {
  events?: EspnScheduleEvent[]
}

export function getEventsFromSchedule(data: unknown): EspnScheduleEvent[] {
  if (typeof data !== 'object' || data === null) return []
  const payload = data as EspnSchedulePayload
  return Array.isArray(payload.events) ? payload.events : []
}

export function getPrimaryCompetition(event: EspnScheduleEvent): EspnCompetition | undefined {
  return event.competitions?.[0]
}

export function competitionState(event: EspnScheduleEvent): string | undefined {
  return getPrimaryCompetition(event)?.status?.type?.state
}

export function parseCompetitorPoints(competitor: EspnCompetitor | undefined): number {
  if (!competitor?.score) return 0
  const s = competitor.score
  if (typeof s === 'string') {
    const n = parseInt(s, 10)
    return Number.isFinite(n) ? n : 0
  }
  if (typeof s.value === 'number' && Number.isFinite(s.value)) return Math.round(s.value)
  if (s.displayValue !== undefined) {
    const n = parseInt(s.displayValue, 10)
    return Number.isFinite(n) ? n : 0
  }
  return 0
}

export function pickHomeAway(comp: EspnCompetition | undefined): {
  home: EspnCompetitor | undefined
  away: EspnCompetitor | undefined
} {
  const competitors = comp?.competitors ?? []
  return {
    home: competitors.find((c) => c.homeAway === 'home'),
    away: competitors.find((c) => c.homeAway === 'away'),
  }
}
