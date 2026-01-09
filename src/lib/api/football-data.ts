// Football-Data.org API Client
// Free tier: 10 requests/minute, Bundesliga included
// Docs: https://www.football-data.org/documentation/api

const FOOTBALL_DATA_BASE_URL = 'https://api.football-data.org/v4'

// Competition codes
const COMPETITIONS = {
    bundesliga: 'BL1',    // 1. Bundesliga
    liga3: '3L',          // 3. Liga (might not be available in free tier)
} as const

// Team IDs for football-data.org
export const TEAM_IDS = {
    fcb: 5,      // FC Bayern München
    tsv: 1860,   // TSV 1860 München (ID may differ, 3. Liga might not be covered)
} as const

export interface PlayerLineup {
    id: number
    name: string
    position: string
    shirtNumber: number
}

export interface TeamLineupData {
    id: number
    name: string
    shortName: string
    crest: string
    formation: string
    lineup: PlayerLineup[]
    bench: PlayerLineup[]
    coach: {
        id: number
        name: string
    }
}

export interface MatchWithLineup {
    id: number
    homeTeam: TeamLineupData
    awayTeam: TeamLineupData
    score: {
        fullTime: { home: number; away: number }
    }
    utcDate: string
    status: string
}

export interface LineupResponse {
    homeTeam: TeamLineupData | null
    awayTeam: TeamLineupData | null
    matchId: number | null
    matchDate: string | null
    error?: string
}

// Get API key from environment
function getApiKey(): string | null {
    const key = process.env.FOOTBALL_DATA_API_KEY
    if (!key) {
        console.error('[Football-Data] FOOTBALL_DATA_API_KEY ist nicht gesetzt!')
        return null
    }
    console.log('[Football-Data] API Key gefunden ✓')
    return key
}

// Fetch from Football-Data.org API
async function fetchFromFootballData<T>(endpoint: string): Promise<T | null> {
    const apiKey = getApiKey()
    if (!apiKey) {
        return null
    }

    const url = `${FOOTBALL_DATA_BASE_URL}${endpoint}`
    console.log(`[Football-Data] Anfrage: ${url}`)

    try {
        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': apiKey,
            },
            cache: 'no-store',
        })

        console.log(`[Football-Data] Status: ${response.status}`)

        if (!response.ok) {
            const text = await response.text()
            console.error(`[Football-Data] Fehler: ${response.status} - ${text}`)
            return null
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('[Football-Data] Netzwerk-Fehler:', error)
        return null
    }
}

// Get the last finished match for a team
export async function getLastMatchWithLineup(teamId: number, club: 'fcb' | 'tsv'): Promise<LineupResponse> {
    console.log(`[Football-Data] === Suche letztes Spiel für Team ${teamId} ===`)

    try {
        // Get finished matches for the team
        const data = await fetchFromFootballData<{
            matches: MatchWithLineup[]
        }>(`/teams/${teamId}/matches?status=FINISHED&limit=5`)

        if (!data?.matches || data.matches.length === 0) {
            console.log('[Football-Data] Keine beendeten Spiele gefunden')
            return {
                homeTeam: null,
                awayTeam: null,
                matchId: null,
                matchDate: null,
                error: 'Keine beendeten Spiele gefunden'
            }
        }

        // Get the most recent match
        const lastMatch = data.matches[0]
        console.log(`[Football-Data] Letztes Spiel gefunden: ID ${lastMatch.id}`)

        // Now get the match details with lineup
        const matchDetails = await fetchFromFootballData<MatchWithLineup>(
            `/matches/${lastMatch.id}`
        )

        if (!matchDetails) {
            return {
                homeTeam: null,
                awayTeam: null,
                matchId: lastMatch.id,
                matchDate: lastMatch.utcDate,
                error: 'Konnte Spieldetails nicht laden'
            }
        }

        // Check if lineup data is available
        const hasLineup = matchDetails.homeTeam?.lineup?.length > 0

        if (!hasLineup) {
            console.log('[Football-Data] Keine Aufstellungsdaten in diesem Spiel')
            return {
                homeTeam: matchDetails.homeTeam || null,
                awayTeam: matchDetails.awayTeam || null,
                matchId: lastMatch.id,
                matchDate: lastMatch.utcDate,
                error: 'Keine Aufstellungsdaten verfügbar'
            }
        }

        console.log(`[Football-Data] === Erfolg: Aufstellungen geladen ===`)
        return {
            homeTeam: matchDetails.homeTeam,
            awayTeam: matchDetails.awayTeam,
            matchId: lastMatch.id,
            matchDate: lastMatch.utcDate,
        }
    } catch (error) {
        console.error('[Football-Data] Fehler:', error)
        return {
            homeTeam: null,
            awayTeam: null,
            matchId: null,
            matchDate: null,
            error: String(error)
        }
    }
}
