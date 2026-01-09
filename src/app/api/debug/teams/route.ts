import { NextResponse } from 'next/server'

const API_FOOTBALL_HOST = 'v3.football.api-sports.io'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const name = searchParams.get('name') || 'Bayern'

    const apiKey = process.env.API_FOOTBALL_KEY || process.env.RAPIDAPI_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'API Key not set' }, { status: 500 })
    }

    try {
        // Search for team by name
        const response = await fetch(
            `https://${API_FOOTBALL_HOST}/teams?search=${encodeURIComponent(name)}`,
            {
                headers: { 'x-apisports-key': apiKey },
            }
        )

        const data = await response.json()
        console.log('[Team Search] Results:', JSON.stringify(data, null, 2))

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error searching teams:', error)
        return NextResponse.json({ error: 'Failed to search teams' }, { status: 500 })
    }
}
