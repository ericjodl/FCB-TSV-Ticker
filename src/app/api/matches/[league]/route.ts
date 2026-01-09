import { NextResponse } from 'next/server'
import { getTeamMatches, type LeagueShortcut } from '@/lib/api/openligadb'

export async function GET(
    request: Request,
    { params }: { params: { league: string } }
) {
    try {
        const league = params.league as LeagueShortcut
        const { searchParams } = new URL(request.url)
        const team = searchParams.get('team') || ''

        if (league !== 'bl1' && league !== 'bl3') {
            return NextResponse.json(
                { error: 'Invalid league. Use bl1 or bl3' },
                { status: 400 }
            )
        }

        const matches = await getTeamMatches(league, team)
        return NextResponse.json(matches)
    } catch (error) {
        console.error('Error fetching matches:', error)
        return NextResponse.json(
            { error: 'Failed to fetch matches' },
            { status: 500 }
        )
    }
}
