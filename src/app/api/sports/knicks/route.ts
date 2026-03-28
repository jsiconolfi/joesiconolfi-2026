import { NextResponse } from 'next/server'
import {
  competitionState,
  getEventsFromSchedule,
  getPrimaryCompetition,
  parseCompetitorPoints,
  pickHomeAway,
  type EspnScheduleEvent,
} from '@/lib/espnSchedule'

export const revalidate = 60

const ESPN_NY_KNICKS_SCHEDULE =
  'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/18/schedule'

function isCompletedEvent(e: EspnScheduleEvent): boolean {
  const state = competitionState(e)
  const comp = getPrimaryCompetition(e)
  const t = comp?.status?.type as { state?: string; completed?: boolean } | undefined
  return state === 'post' || t?.completed === true
}

function getKnicksLastGame(events: EspnScheduleEvent[]) {
  const completedGames = events.filter(isCompletedEvent)
  const lastGame = completedGames[completedGames.length - 1] ?? null
  if (!lastGame) return null

  const comp = getPrimaryCompetition(lastGame)
  const { home, away } = pickHomeAway(comp)
  const isHome = home?.team?.abbreviation === 'NY'
  const knicks = isHome ? home : away
  const opponent = isHome ? away : home
  const knicksScore = parseCompetitorPoints(knicks)
  const opponentScore = parseCompetitorPoints(opponent)

  return {
    opponent: opponent?.team?.displayName ?? 'TBD',
    opponentAbbr: opponent?.team?.abbreviation ?? '???',
    knicksScore,
    opponentScore,
    won: knicksScore > opponentScore,
    isHome,
    date: lastGame.date,
  }
}

export async function GET() {
  try {
    const espnRes = await fetch(ESPN_NY_KNICKS_SCHEDULE, { next: { revalidate: 60 } })
    if (!espnRes.ok) {
      return NextResponse.json({ status: 'error' }, { status: 500 })
    }
    const raw: unknown = await espnRes.json()
    const events = getEventsFromSchedule(raw)
    const lastGame = getKnicksLastGame(events)
    const now = Date.now()

    const liveGame = events.find((e) => competitionState(e) === 'in')
    if (liveGame) {
      const comp = getPrimaryCompetition(liveGame)
      const { home, away } = pickHomeAway(comp)
      const knicks = home?.team?.abbreviation === 'NY' ? home : away
      const opponent = home?.team?.abbreviation === 'NY' ? away : home

      return NextResponse.json({
        status: 'live' as const,
        opponent: opponent?.team?.displayName ?? 'TBD',
        opponentAbbr: opponent?.team?.abbreviation ?? '???',
        knicks_score: parseCompetitorPoints(knicks),
        opponent_score: parseCompetitorPoints(opponent),
        period: comp?.status?.period ?? 1,
        clock: comp?.status?.displayClock ?? '12:00',
        isHome: home?.team?.abbreviation === 'NY',
        lastGame,
      })
    }

    const upcoming = events
      .filter((e) => {
        const gameTime = new Date(e.date).getTime()
        return gameTime > now && competitionState(e) === 'pre'
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const nextGame = upcoming[0]
    if (nextGame) {
      const comp = getPrimaryCompetition(nextGame)
      const { home, away } = pickHomeAway(comp)
      const isHome = home?.team?.abbreviation === 'NY'
      const opponent = isHome ? away : home

      return NextResponse.json({
        status: 'upcoming' as const,
        opponent: opponent?.team?.displayName ?? 'TBD',
        opponentAbbr: opponent?.team?.abbreviation ?? '???',
        date: nextGame.date,
        isHome,
        venue: comp?.venue?.fullName ?? '',
        lastGame,
      })
    }

    return NextResponse.json({ status: 'off_season' as const, lastGame })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 500 })
  }
}
