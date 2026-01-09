import { NextResponse } from 'next/server'
import { getLastMatchWithLineup, TEAM_IDS } from '@/lib/api/football-data'

export async function GET(request: Request) {
    // Debug logging
    console.log('[Lineups API] Checking environment variables...')
    console.log('[Lineups API] FOOTBALL_DATA_API_KEY exists:', !!process.env.FOOTBALL_DATA_API_KEY)

    const { searchParams } = new URL(request.url)
    const club = searchParams.get('club') as 'fcb' | 'tsv' | null

    if (!club || !TEAM_IDS[club]) {
        return NextResponse.json(
            { error: 'Invalid club. Use fcb or tsv' },
            { status: 400 }
        )
    }

    try {
        const teamId = TEAM_IDS[club]
        console.log(`[Lineups API] Fetching lineups for ${club} (Team ID: ${teamId})`)

        const lineupData = await getLastMatchWithLineup(teamId, club)

        // Transform to match the component's expected format
        const response = {
            team1: lineupData.homeTeam ? {
                team: {
                    id: lineupData.homeTeam.id,
                    name: lineupData.homeTeam.name,
                    logo: lineupData.homeTeam.crest,
                },
                formation: lineupData.homeTeam.formation || 'N/A',
                startXI: lineupData.homeTeam.lineup?.map(p => ({
                    player: {
                        id: p.id,
                        name: p.name,
                        number: p.shirtNumber,
                        pos: p.position,
                    }
                })) || [],
                coach: lineupData.homeTeam.coach,
            } : null,
            team2: lineupData.awayTeam ? {
                team: {
                    id: lineupData.awayTeam.id,
                    name: lineupData.awayTeam.name,
                    logo: lineupData.awayTeam.crest,
                },
                formation: lineupData.awayTeam.formation || 'N/A',
                startXI: lineupData.awayTeam.lineup?.map(p => ({
                    player: {
                        id: p.id,
                        name: p.name,
                        number: p.shirtNumber,
                        pos: p.position,
                    }
                })) || [],
                coach: lineupData.awayTeam.coach,
            } : null,
            matchId: lineupData.matchId,
            matchDate: lineupData.matchDate,
            error: lineupData.error,
        }

        return NextResponse.json(response)
    } catch (error) {
        console.error('Error fetching lineups:', error)
        return NextResponse.json(
            { error: 'Failed to fetch lineups', team1: null, team2: null },
            { status: 500 }
        )
    }
}
