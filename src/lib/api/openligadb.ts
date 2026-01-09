import { cache } from './cache'

const BASE_URL = 'https://api.openligadb.de'
const CACHE_TTL = 300 // 5 minutes

export type LeagueShortcut = 'bl1' | 'bl3'

export interface TeamStanding {
    teamInfoId: number
    teamName: string
    shortName: string
    teamIconUrl: string
    points: number
    opponentGoals: number
    goals: number
    matches: number
    won: number
    lost: number
    draw: number
    goalDiff: number
}

export interface MatchResult {
    resultTypeID: number
    resultName: string
    pointsTeam1: number
    pointsTeam2: number
    resultOrderID: number
}

export interface Team {
    teamId: number
    teamName: string
    shortName: string
    teamIconUrl: string
}

export interface Match {
    matchID: number
    matchDateTime: string
    matchDateTimeUTC: string
    team1: Team
    team2: Team
    matchResults: MatchResult[]
    matchIsFinished: boolean
    goals: Goal[]
    group: {
        groupName: string
        groupOrderID: number
    }
    location?: {
        locationCity: string
        locationStadium: string
    }
}

export interface Goal {
    goalID: number
    scoreTeam1: number
    scoreTeam2: number
    matchMinute: number
    goalGetterName: string
    isPenalty: boolean
    isOwnGoal: boolean
}

// Helper to get current season
function getCurrentSeason(): number {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    // Season typically starts in August/September
    return month >= 7 ? year : year - 1
}

// Fetch with caching
async function fetchWithCache<T>(url: string, cacheKey: string): Promise<T> {
    const cached = cache.get<T>(cacheKey)
    if (cached) {
        return cached
    }

    const response = await fetch(url, {
        next: { revalidate: CACHE_TTL },
    })

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    cache.set(cacheKey, data, CACHE_TTL)
    return data
}

// Get league standings
export async function getStandings(league: LeagueShortcut): Promise<TeamStanding[]> {
    const season = getCurrentSeason()
    const cacheKey = `standings_${league}_${season}`
    const url = `${BASE_URL}/getbltable/${league}/${season}`

    return fetchWithCache<TeamStanding[]>(url, cacheKey)
}

// Get all matches for a league/season
export async function getMatches(league: LeagueShortcut): Promise<Match[]> {
    const season = getCurrentSeason()
    const cacheKey = `matches_${league}_${season}`
    const url = `${BASE_URL}/getmatchdata/${league}/${season}`

    return fetchWithCache<Match[]>(url, cacheKey)
}

// Get specific team matches
export async function getTeamMatches(league: LeagueShortcut, teamName: string): Promise<Match[]> {
    const allMatches = await getMatches(league)
    return allMatches.filter(
        (match) =>
            match.team1.teamName.includes(teamName) ||
            match.team2.teamName.includes(teamName)
    )
}

// Get completed matches for a team
export async function getCompletedMatches(league: LeagueShortcut, teamName: string): Promise<Match[]> {
    const teamMatches = await getTeamMatches(league, teamName)
    return teamMatches
        .filter((match) => match.matchIsFinished)
        .sort((a, b) => new Date(b.matchDateTime).getTime() - new Date(a.matchDateTime).getTime())
}

// Get last match for a team
export async function getLastMatch(league: LeagueShortcut, teamName: string): Promise<Match | null> {
    const completed = await getCompletedMatches(league, teamName)
    return completed[0] || null
}

// Get upcoming matches for a team
export async function getUpcomingMatches(league: LeagueShortcut, teamName: string): Promise<Match[]> {
    const teamMatches = await getTeamMatches(league, teamName)
    const now = new Date()

    return teamMatches
        .filter((match) => !match.matchIsFinished && new Date(match.matchDateTime) > now)
        .sort((a, b) => new Date(a.matchDateTime).getTime() - new Date(b.matchDateTime).getTime())
        .slice(0, 5)
}

// Get current matchday
export async function getCurrentMatchday(league: LeagueShortcut): Promise<number> {
    const cacheKey = `current_matchday_${league}`
    const cached = cache.get<{ groupOrderID: number }>(cacheKey)
    if (cached) {
        return cached.groupOrderID
    }

    const response = await fetch(`${BASE_URL}/getcurrentgroup/${league}`)
    if (!response.ok) {
        return 1
    }

    const data = await response.json()
    cache.set(cacheKey, data, CACHE_TTL)
    return data.groupOrderID || 1
}

// Team name mapping for searches
export const TEAM_NAMES = {
    fcb: 'Bayern',
    tsv: '1860',
} as const
