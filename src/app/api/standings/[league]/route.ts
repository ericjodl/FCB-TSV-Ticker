import { NextResponse } from 'next/server'
import { getStandings, type LeagueShortcut } from '@/lib/api/openligadb'

export async function GET(
    request: Request,
    { params }: { params: { league: string } }
) {
    try {
        const league = params.league as LeagueShortcut

        if (league !== 'bl1' && league !== 'bl3') {
            return NextResponse.json(
                { error: 'Invalid league. Use bl1 or bl3' },
                { status: 400 }
            )
        }

        const standings = await getStandings(league)
        return NextResponse.json(standings)
    } catch (error) {
        console.error('Error fetching standings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch standings' },
            { status: 500 }
        )
    }
}
