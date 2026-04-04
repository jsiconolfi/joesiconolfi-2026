/** Minimal shapes for ESPN site API team schedule JSON (no API key). */

/** League scoreboard includes live scores; team schedule often omits them for `state: in`. */
export const ESPN_NBA_SCOREBOARD =
  'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard'
export const ESPN_MLB_SCOREBOARD =
  'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard'

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

/** Per-period or per-inning rows when total `score` is absent (some responses). */
export interface EspnLineScore {
  value?: number
  displayValue?: string
  period?: number
}

export interface EspnCompetitor {
  homeAway?: string
  score?: EspnCompetitorScore | string
  linescores?: EspnLineScore[]
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
  id?: string
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

function sumLinescorePoints(linescores: EspnLineScore[] | undefined): number {
  if (!Array.isArray(linescores) || linescores.length === 0) return 0
  let sum = 0
  for (const row of linescores) {
    const v = row?.value
    if (typeof v === 'number' && Number.isFinite(v)) sum += Math.round(v)
  }
  return sum
}

/** Returns null when `score` is missing or not parseable (try linescores next). */
function parseScoreField(score: EspnCompetitor['score']): number | null {
  if (score === undefined || score === null) return null
  if (typeof score === 'string') {
    const n = parseInt(score, 10)
    return Number.isFinite(n) ? n : null
  }
  if (typeof score === 'object') {
    if (typeof score.value === 'number' && Number.isFinite(score.value)) return Math.round(score.value)
    if (score.displayValue !== undefined) {
      const n = parseInt(String(score.displayValue), 10)
      return Number.isFinite(n) ? n : null
    }
    return null
  }
  return null
}

export function parseCompetitorPoints(competitor: EspnCompetitor | undefined): number {
  if (!competitor) return 0
  const fromScore = parseScoreField(competitor.score)
  if (fromScore !== null) return fromScore
  return sumLinescorePoints(competitor.linescores)
}

/**
 * ESPN scoreboards use US Eastern calendar days for `dates=YYYYMMDD`. Without it, "today's"
 * default scoreboard can omit games from other days, so event id lookup fails.
 */
function formatEspnScoreboardDatesParam(isoDate: string): string | undefined {
  const d = new Date(isoDate)
  if (Number.isNaN(d.getTime())) return undefined
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(d)
  const y = parts.find((p) => p.type === 'year')?.value
  const m = parts.find((p) => p.type === 'month')?.value
  const day = parts.find((p) => p.type === 'day')?.value
  if (!y || !m || !day) return undefined
  return `${y}${m}${day}`
}

function buildScoreboardUrlForEvent(scoreboardUrl: string, eventDateIso?: string): string {
  const dates = eventDateIso ? formatEspnScoreboardDatesParam(eventDateIso) : undefined
  if (!dates) return scoreboardUrl
  const sep = scoreboardUrl.includes('?') ? '&' : '?'
  return `${scoreboardUrl}${sep}dates=${dates}`
}

/**
 * Team schedule responses often omit competitor scores for in-progress games; the league
 * scoreboard includes the same event id with full scores.
 *
 * @param eventDateIso - Pass `event.date` from the schedule so `?dates=` matches the slate that contains this game (MLB/NBA).
 */
export async function getPrimaryCompetitionFromScoreboard(
  eventId: string,
  scoreboardUrl: string,
  eventDateIso?: string,
): Promise<EspnCompetition | undefined> {
  if (!eventId) return undefined
  try {
    const url = buildScoreboardUrlForEvent(scoreboardUrl, eventDateIso)
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) return undefined
    const raw: unknown = await res.json()
    const events = getEventsFromSchedule(raw)
    const match = events.find((e) => e.id === eventId)
    return match ? getPrimaryCompetition(match) : undefined
  } catch {
    return undefined
  }
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
