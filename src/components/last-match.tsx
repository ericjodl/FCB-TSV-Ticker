'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useClub } from '@/context/club-context'
import { Clock, MapPin, Trophy, Users, ExternalLink } from 'lucide-react'
import type { Match } from '@/lib/api/openligadb'

export function LastMatch() {
    const { leagueShortcut, club, clubName } = useClub()
    const [match, setMatch] = useState<Match | null>(null)
    const [loading, setLoading] = useState(true)

    const teamName = club === 'fcb' ? 'Bayern' : '1860'

    // Fetch match data
    useEffect(() => {
        let ignore = false
        setLoading(true)

        fetch(`/api/matches/${leagueShortcut}?team=${teamName}`)
            .then((res) => res.json())
            .then((matches: Match[]) => {
                if (ignore) return
                const completed = matches
                    .filter((m) => m.matchIsFinished)
                    .sort(
                        (a, b) =>
                            new Date(b.matchDateTime).getTime() -
                            new Date(a.matchDateTime).getTime()
                    )
                setMatch(completed[0] || null)
                setLoading(false)
            })
            .catch(() => {
                if (!ignore) setLoading(false)
            })

        return () => {
            ignore = true
        }
    }, [leagueShortcut, teamName])

    const finalResult = match?.matchResults?.find((r) => r.resultTypeID === 2) ||
        match?.matchResults?.[match.matchResults.length - 1]

    const getMatchOutcome = () => {
        if (!match || !finalResult) return null
        const isTeam1 = match.team1.teamName.includes(teamName)
        const ourScore = isTeam1 ? finalResult.pointsTeam1 : finalResult.pointsTeam2
        const theirScore = isTeam1 ? finalResult.pointsTeam2 : finalResult.pointsTeam1

        if (ourScore > theirScore) return 'win'
        if (ourScore < theirScore) return 'loss'
        return 'draw'
    }

    const outcome = getMatchOutcome()

    // Generate lineup links based on the match
    const getLineupLinks = () => {
        if (!match) return []

        const team1Name = encodeURIComponent(match.team1.teamName)
        const team2Name = encodeURIComponent(match.team2.teamName)
        const matchDate = new Date(match.matchDateTime).toLocaleDateString('de-DE')

        return [
            {
                name: 'Kicker',
                url: club === 'fcb'
                    ? 'https://www.kicker.de/fc-bayern-muenchen/spielplan/bundesliga/2024-25'
                    : 'https://www.kicker.de/1860-muenchen/spielplan/3-liga/2024-25',
                icon: '⚽'
            },
            {
                name: 'Transfermarkt',
                url: club === 'fcb'
                    ? 'https://www.transfermarkt.de/fc-bayern-munchen/startseite/verein/27'
                    : 'https://www.transfermarkt.de/tsv-1860-munchen/startseite/verein/72',
                icon: '📊'
            },
            {
                name: 'Google',
                url: `https://www.google.com/search?q=${team1Name}+vs+${team2Name}+Aufstellung`,
                icon: '🔍'
            }
        ]
    }

    return (
        <Card variant="glass" className="hover-lift">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Letztes Spiel
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                ) : match ? (
                    <div className="space-y-4">
                        {/* Match Display */}
                        <div className="flex items-center justify-between gap-4">
                            {/* Team 1 */}
                            <div className="flex-1 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    {match.team1.teamIconUrl && (
                                        <img
                                            src={match.team1.teamIconUrl}
                                            alt={match.team1.shortName}
                                            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                                        />
                                    )}
                                    <span className="text-sm font-medium truncate max-w-full">
                                        {match.team1.shortName || match.team1.teamName}
                                    </span>
                                </div>
                            </div>

                            {/* Score */}
                            <div className="flex flex-col items-center">
                                <div className="text-3xl sm:text-4xl font-bold">
                                    {finalResult ? (
                                        <>
                                            <span>{finalResult.pointsTeam1}</span>
                                            <span className="mx-2 text-muted-foreground">:</span>
                                            <span>{finalResult.pointsTeam2}</span>
                                        </>
                                    ) : (
                                        <span className="text-muted-foreground">- : -</span>
                                    )}
                                </div>
                                {outcome && (
                                    <Badge
                                        variant={
                                            outcome === 'win'
                                                ? 'success'
                                                : outcome === 'loss'
                                                    ? 'destructive'
                                                    : 'warning'
                                        }
                                        className="mt-2"
                                    >
                                        {outcome === 'win' ? 'Sieg' : outcome === 'loss' ? 'Niederlage' : 'Unentschieden'}
                                    </Badge>
                                )}
                            </div>

                            {/* Team 2 */}
                            <div className="flex-1 text-center">
                                <div className="flex flex-col items-center gap-2">
                                    {match.team2.teamIconUrl && (
                                        <img
                                            src={match.team2.teamIconUrl}
                                            alt={match.team2.shortName}
                                            className="h-12 w-12 sm:h-16 sm:w-16 object-contain"
                                        />
                                    )}
                                    <span className="text-sm font-medium truncate max-w-full">
                                        {match.team2.shortName || match.team2.teamName}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Match Details */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {new Date(match.matchDateTime).toLocaleDateString('de-DE', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                })}
                            </div>
                            {match.group && (
                                <span>{match.group.groupName}</span>
                            )}
                            {match.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {match.location.locationStadium}
                                </div>
                            )}
                        </div>

                        {/* Goals */}
                        {match.goals && match.goals.length > 0 && (
                            <div className="border-t pt-4">
                                <p className="text-xs font-medium text-muted-foreground mb-2">Torschützen</p>
                                <div className="space-y-1 text-sm">
                                    {match.goals.slice(0, 5).map((goal) => (
                                        <div key={goal.goalID} className="flex items-center gap-2">
                                            <span className="text-muted-foreground">{goal.matchMinute}'</span>
                                            <span>{goal.goalGetterName}</span>
                                            <span className="text-muted-foreground">
                                                ({goal.scoreTeam1}:{goal.scoreTeam2})
                                            </span>
                                            {goal.isPenalty && <Badge variant="outline" className="text-xs">Elfmeter</Badge>}
                                            {goal.isOwnGoal && <Badge variant="destructive" className="text-xs">Eigentor</Badge>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Lineups Links Section */}
                        <div className="border-t pt-4">
                            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-3">
                                <Users className="h-4 w-4" />
                                Aufstellungen ansehen
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {getLineupLinks().map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs font-medium group"
                                    >
                                        <span>{link.icon}</span>
                                        <span>{link.name}</span>
                                        <ExternalLink className="h-3 w-3 opacity-50 group-hover:opacity-100" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-muted-foreground">Keine Daten verfügbar</p>
                )}
            </CardContent>
        </Card>
    )
}
