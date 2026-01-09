// API-Football client (Direct API, not RapidAPI)
// Free tier: 100 requests/day
// Dashboard: https://dashboard.api-football.com

const API_FOOTBALL_HOST = 'v3.football.api-sports.io'
const API_FOOTBALL_BASE_URL = `https://${API_FOOTBALL_HOST}`

// Team IDs for API-Football (these are correct for the direct API)
// Bayern München = 157, 1860 München = 176
export const TEAM_IDS = {
    fcb: 157,
    tsv: 176,
} as const

// League IDs
const LEAGUE_IDS = {
    bundesliga: 78,    // 1. Bundesliga
    liga3: 80,         // 3. Liga
} as const

export interface Player {
    id: number
    name: string
    number: number
    pos: string
    grid: string | null
}

export interface TeamLineup {
    team: {
        id: number
        name: string
        logo: string
    }
    formation: string
    startXI: Array<{ player: Player }>
    substitutes: Array<{ player: Player }>
    coach: {
        id: number
        name: string
        photo: string
    }
}

export interface LineupResponse {
    team1: TeamLineup | null
    team2: TeamLineup | null
    fixtureId: number | null
    error?: string
}

// Get API key from environment (accepts both names for compatibility)
function getApiKey(): string | null {
    const key = process.env.API_FOOTBALL_KEY || process.env.RAPIDAPI_KEY
    if (!key) {
        console.error('[API-Football] API Key ist nicht gesetzt!')
        return null
    }
    return key
}

// Fetch with API-Football headers
async function fetchFromAPIFootball<T>(endpoint: string): Promise<T | null> {
    const apiKey = getApiKey()
    if (!apiKey) {
        return null
    }

    const url = `${API_FOOTBALL_BASE_URL}${endpoint}`
    console.log(`[API-Football] Anfrage: ${url}`)

    try {
        const response = await fetch(url, {
            headers: {
                'x-apisports-key': apiKey,
            },
            cache: 'no-store',
        })

        console.log(`[API-Football] Status: ${response.status}`)

        if (!response.ok) {
            const text = await response.text()
            console.error(`[API-Football] Fehler: ${response.status} - ${text}`)
            return null
        }

        const data = await response.json()
        console.log(`[API-Football] Antwort erhalten, ${data.response?.length || 0} Ergebnisse`)
        return data
    } catch (error) {
        console.error('[API-Football] Netzwerk-Fehler:', error)
        return null
    }
}

// Get the last fixture ID for a team using league search
export async function getLastFixtureId(teamId: number, club: 'fcb' | 'tsv'): Promise<number | null> {
    console.log(`[API-Football] Suche letztes Spiel für Team ${teamId}`)

    // Determine the correct league
    const leagueId = club === 'fcb' ? LEAGUE_IDS.bundesliga : LEAGUE_IDS.liga3
    const season = 2024  // Current season

    // Try to get fixtures for the team in the current season
    const data = await fetchFromAPIFootball<{
        response: Array<{ fixture: { id: number, date: string }, teams: { home: { id: number }, away: { id: number } } }>
    }>(`/fixtures?league=${leagueId}&season=${season}&team=${teamId}&last=5`)

    if (data?.response && data.response.length > 0) {
        // Get the most recent finished fixture
        const fixture = data.response[0]
        const fixtureId = fixture.fixture.id
        console.log(`[API-Football] Fixture gefunden: ${fixtureId}`)
        return fixtureId
    }

    console.log('[API-Football] Kein Fixture in Liga gefunden, versuche ohne Liga-Filter...')

    // Fallback: try without league filter
    const fallbackData = await fetchFromAPIFootball<{
        response: Array<{ fixture: { id: number } }>
    }>(`/fixtures?team=${teamId}&last=1`)

    if (fallbackData?.response && fallbackData.response.length > 0) {
        const fixtureId = fallbackData.response[0].fixture.id
        console.log(`[API-Football] Fallback Fixture gefunden: ${fixtureId}`)
        return fixtureId
    }

    console.log('[API-Football] Kein Fixture gefunden')
    return null
}

// Get lineups for a specific fixture
export async function getLineups(fixtureId: number): Promise<TeamLineup[]> {
    console.log(`[API-Football] Lade Aufstellungen für Fixture ${fixtureId}`)

    const data = await fetchFromAPIFootball<{
        response: TeamLineup[]
    }>(`/fixtures/lineups?fixture=${fixtureId}`)

    if (data?.response) {
        console.log(`[API-Football] ${data.response.length} Aufstellungen geladen`)
        return data.response
    }

    return []
}

// Get lineups for a team's last match
export async function getLastMatchLineups(teamId: number, club: 'fcb' | 'tsv' = 'fcb'): Promise<LineupResponse> {
    console.log(`[API-Football] === Start Lineup-Abfrage für Team ${teamId} ===`)

    try {
        const fixtureId = await getLastFixtureId(teamId, club)

        if (!fixtureId) {
            return {
                team1: null,
                team2: null,
                fixtureId: null,
                error: 'Kein Spiel gefunden'
            }
        }

        const lineups = await getLineups(fixtureId)

        if (lineups.length === 0) {
            return {
                team1: null,
                team2: null,
                fixtureId,
                error: 'Keine Aufstellungen für dieses Spiel verfügbar'
            }
        }

        console.log(`[API-Football] === Erfolg: ${lineups.length} Teams geladen ===`)
        return {
            team1: lineups[0] || null,
            team2: lineups[1] || null,
            fixtureId,
        }
    } catch (error) {
        console.error('[API-Football] Fehler:', error)
        return {
            team1: null,
            team2: null,
            fixtureId: null,
            error: String(error)
        }
    }
}
