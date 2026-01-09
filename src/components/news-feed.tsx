'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useClub } from '@/context/club-context'
import { Newspaper, ExternalLink, Clock } from 'lucide-react'

interface NewsItem {
    title: string
    link: string
    pubDate: string
    source: string
}

function formatTimeAgo(dateString: string): string {
    try {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) return `vor ${diffMins} Min.`
        if (diffHours < 24) return `vor ${diffHours} Std.`
        if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`
        return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
    } catch {
        return ''
    }
}

export function NewsFeed() {
    const { club, clubName } = useClub()
    const [news, setNews] = useState<NewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        setError(null)

        fetch(`/api/news?club=${club}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.items) {
                    // Sort by date, newest first
                    const sorted = [...data.items].sort((a: NewsItem, b: NewsItem) => {
                        const dateA = new Date(a.pubDate).getTime()
                        const dateB = new Date(b.pubDate).getTime()
                        return dateB - dateA
                    })
                    setNews(sorted)
                } else {
                    setError('Keine News verfügbar')
                }
                setLoading(false)
            })
            .catch(() => {
                setError('Fehler beim Laden der News')
                setLoading(false)
            })
    }, [club])

    return (
        <Card variant="glass" className="hover-lift">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Newspaper className="h-5 w-5 text-primary" />
                    {clubName} News
                </CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <p className="text-muted-foreground text-sm">{error}</p>
                ) : (
                    <div className="space-y-4">
                        {news.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <article className="p-3 rounded-lg bg-muted/30 hover:bg-muted/60 transition-all duration-200 border border-transparent hover:border-primary/20">
                                    <h3 className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatTimeAgo(item.pubDate)}
                                        </span>
                                        <span className="truncate">{item.source}</span>
                                        <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </article>
                            </a>
                        ))}
                    </div>
                )}

                {/* Attribution */}
                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t text-center">
                    Powered by Google News
                </p>
            </CardContent>
        </Card>
    )
}
