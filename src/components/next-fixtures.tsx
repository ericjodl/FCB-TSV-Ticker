'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/context/club-context'
import { Calendar, Clock, MapPin } from 'lucide-react'
import type { Match } from '@/lib/api/openligadb'

function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState('')

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date()
            const diff = targetDate.getTime() - now.getTime()

            if (diff <= 0) {
                setTimeLeft('Läuft')
                return
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

            if (days > 0) {
                setTimeLeft(`${days}T ${hours}h`)
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`)
            } else {
                setTimeLeft(`${minutes}m`)
            }
        }

        calculateTime()
        const interval = setInterval(calculateTime, 60000)
        return () => clearInterval(interval)
    }, [targetDate])

    return (
        <span className="text-primary font-semibold whitespace-nowrap">{timeLeft}</span>
    )
}

export function NextFixtures() {
    const { leagueShortcut, club } = useClub()
    const [matches, setMatches] = useState<Match[]>([])
    const [loading, setLoading] = useState(true)

    const teamName = club === 'fcb' ? 'Bayern' : '1860'

    useEffect(() => {
        let ignore = false
        setLoading(true)

        fetch(`/api/matches/${leagueShortcut}?team=${teamName}`)
            .then((res) => res.json())
            .then((data: Match[]) => {
                if (ignore) return
                const now = new Date()
                const upcoming = data
                    .filter(
                        (m) => !m.matchIsFinished && new Date(m.matchDateTime) > now
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.matchDateTime).getTime() -
                            new Date(b.matchDateTime).getTime()
                    )
                    .slice(0, 5)
                setMatches(upcoming)
                setLoading(false)
            })
            .catch(() => {
                if (!ignore) setLoading(false)
            })

        return () => {
            ignore = true
        }
    }, [leagueShortcut, teamName])

    return (
        <Card variant="glass" className="hover-lift">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Nächste Spiele
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-20 w-full" />
                        ))}
                    </div>
                ) : matches.length > 0 ? (
                    <div className="space-y-3">
                        {matches.map((match, index) => {
                            const isFirst = index === 0
                            const matchDate = new Date(match.matchDateTime)
                            const isHome = match.team1.teamName.includes(teamName)
                            const opponent = isHome ? match.team2 : match.team1

                            return (
                                <div
                                    key={match.matchID}
                                    className={`p-3 rounded-lg transition-all ${isFirst
                                        ? 'bg-primary/10 border border-primary/20'
                                        : 'bg-muted/50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        {/* Opponent Info */}
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            {opponent.teamIconUrl && (
                                                <img
                                                    src={opponent.teamIconUrl}
                                                    alt={opponent.shortName}
                                                    className="h-8 w-8 sm:h-10 sm:w-10 object-contain flex-shrink-0"
                                                />
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">
                                                    <span className="text-xs text-muted-foreground mr-1">
                                                        {isHome ? 'vs' : '@'}
                                                    </span>
                                                    {opponent.shortName || opponent.teamName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {match.group?.groupName}
                                                </p>
                                            </div>
                                        </div>

                                        {/* DateTime & Countdown */}
                                        <div className="text-right flex-shrink-0">
                                            {isFirst && (
                                                <CountdownTimer targetDate={matchDate} />
                                            )}
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                <Clock className="h-3 w-3" />
                                                <span>
                                                    {matchDate.toLocaleDateString('de-DE', {
                                                        weekday: 'short',
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                    })}
                                                    {' '}
                                                    {matchDate.toLocaleTimeString('de-DE', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location for first match */}
                                    {isFirst && match.location && (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2 pt-2 border-t border-primary/10">
                                            <MapPin className="h-3 w-3" />
                                            <span>{match.location.locationStadium}, {match.location.locationCity}</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-muted-foreground">Keine anstehenden Spiele</p>
                )}
            </CardContent>
        </Card>
    )
}
