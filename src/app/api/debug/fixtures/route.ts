import { NextResponse } from 'next/server'

const API_FOOTBALL_HOST = 'v3.football.api-sports.io'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const teamId = searchParams.get('team') || '157'

    const apiKey = process.env.API_FOOTBALL_KEY || process.env.RAPIDAPI_KEY
    if (!apiKey) {
        return NextResponse.json({ error: 'API Key not set' }, { status: 500 })
    }

    const results: Record<string, unknown> = {}

    try {
        // Test 1: Get fixtures for team (last 5)
        console.log('[Debug] Testing fixtures for team', teamId)
        const fixturesRes = await fetch(
            `https://${API_FOOTBALL_HOST}/fixtures?team=${teamId}&last=5`,
            { headers: { 'x-apisports-key': apiKey } }
        )
        const fixturesData = await fixturesRes.json()
        results.fixtures_last5 = {
            count: fixturesData.response?.length || 0,
            data: fixturesData.response?.slice(0, 2) || [],
            errors: fixturesData.errors
        }

        // Test 2: Get fixtures for Bundesliga 2024
        console.log('[Debug] Testing Bundesliga 2024 fixtures')
        const blRes = await fetch(
            `https://${API_FOOTBALL_HOST}/fixtures?league=78&season=2024&team=${teamId}`,
            { headers: { 'x-apisports-key': apiKey } }
        )
        const blData = await blRes.json()
        results.bundesliga_2024 = {
            count: blData.response?.length || 0,
            errors: blData.errors
        }

        // Test 3: Check available leagues for team
        console.log('[Debug] Testing leagues for team')
        const leaguesRes = await fetch(
            `https://${API_FOOTBALL_HOST}/leagues?team=${teamId}`,
            { headers: { 'x-apisports-key': apiKey } }
        )
        const leaguesData = await leaguesRes.json()
        results.leagues = {
            count: leaguesData.response?.length || 0,
            leagues: leaguesData.response?.map((l: any) => ({
                id: l.league.id,
                name: l.league.name,
                seasons: l.seasons?.map((s: any) => s.year).slice(-3)
            })).slice(0, 5) || [],
            errors: leaguesData.errors
        }

        // Test 4: Check account status
        console.log('[Debug] Checking account status')
        const statusRes = await fetch(
            `https://${API_FOOTBALL_HOST}/status`,
            { headers: { 'x-apisports-key': apiKey } }
        )
        const statusData = await statusRes.json()
        results.account = statusData.response

        return NextResponse.json(results)
    } catch (error) {
        console.error('Debug error:', error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
