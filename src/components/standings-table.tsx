'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/context/club-context'
import { Trophy } from 'lucide-react'
import type { TeamStanding } from '@/lib/api/openligadb'

export function StandingsTable() {
    const { leagueShortcut, club, league, clubName } = useClub()
    const [standings, setStandings] = useState<TeamStanding[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let ignore = false
        setLoading(true)
        setError(null)

        fetch(`/api/standings/${leagueShortcut}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then((data) => {
                if (ignore) return
                setStandings(data)
                setLoading(false)
            })
            .catch((err) => {
                if (ignore) return
                setError('Fehler beim Laden der Tabelle')
                setLoading(false)
            })

        return () => {
            ignore = true
        }
    }, [leagueShortcut])

    // Find club position in standings
    const clubKeyword = club === 'fcb' ? 'Bayern' : '1860'
    const clubPosition = standings.findIndex((team) =>
        team.teamName.includes(clubKeyword)
    )

    if (error) {
        return (
            <Card variant="glass" className="hover-lift">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-primary" />
                        {league} Tabelle
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card variant="glass" className="hover-lift">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    {league} Tabelle
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-2">
                        {[...Array(10)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-muted-foreground">
                                    <th className="py-2 text-left w-8">#</th>
                                    <th className="py-2 text-left">Team</th>
                                    <th className="py-2 text-center w-10">Sp</th>
                                    <th className="py-2 text-center w-10 hidden sm:table-cell">S</th>
                                    <th className="py-2 text-center w-10 hidden sm:table-cell">U</th>
                                    <th className="py-2 text-center w-10 hidden sm:table-cell">N</th>
                                    <th className="py-2 text-center w-16 hidden sm:table-cell">Tore</th>
                                    <th className="py-2 text-center w-12 font-bold">Pkt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.slice(0, 10).map((team, index) => {
                                    const isSelectedClub = team.teamName.includes(clubKeyword)
                                    return (
                                        <tr
                                            key={team.teamInfoId}
                                            className={`border-b transition-colors ${isSelectedClub
                                                ? 'bg-primary/10 font-semibold'
                                                : 'hover:bg-muted/50'
                                                }`}
                                        >
                                            <td className="py-2.5 font-medium">{index + 1}</td>
                                            <td className="py-2.5">
                                                <div className="flex items-center gap-2">
                                                    {team.teamIconUrl && (
                                                        <img
                                                            src={team.teamIconUrl}
                                                            alt={team.shortName}
                                                            className="h-5 w-5 object-contain"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                    <span className="truncate max-w-[120px] sm:max-w-none">
                                                        {team.shortName || team.teamName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 text-center">{team.matches}</td>
                                            <td className="py-2.5 text-center hidden sm:table-cell text-green-500">
                                                {team.won}
                                            </td>
                                            <td className="py-2.5 text-center hidden sm:table-cell text-yellow-500">
                                                {team.draw}
                                            </td>
                                            <td className="py-2.5 text-center hidden sm:table-cell text-red-500">
                                                {team.lost}
                                            </td>
                                            <td className="py-2.5 text-center hidden sm:table-cell">
                                                {team.goals}:{team.opponentGoals}
                                            </td>
                                            <td className="py-2.5 text-center font-bold">{team.points}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                        {/* Show club position if outside top 10 */}
                        {clubPosition >= 10 && (
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-between text-sm font-medium bg-primary/10 p-2 rounded">
                                    <span>#{clubPosition + 1} {clubName}</span>
                                    <span>{standings[clubPosition]?.points} Pkt</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
