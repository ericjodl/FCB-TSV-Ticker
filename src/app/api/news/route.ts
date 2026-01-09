import { NextResponse } from 'next/server'

// Simple XML parser for RSS feeds
function parseRSSItems(xml: string): NewsItem[] {
    const items: NewsItem[] = []
    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
        const itemContent = match[1]

        const title = extractTag(itemContent, 'title')
        const link = extractTag(itemContent, 'link')
        const pubDate = extractTag(itemContent, 'pubDate')
        const source = extractTag(itemContent, 'source')

        if (title && link) {
            items.push({
                title: decodeHTMLEntities(title),
                link,
                pubDate,
                source: source || 'Google News',
            })
        }
    }

    return items.slice(0, 10) // Limit to 10 items
}

function extractTag(content: string, tag: string): string {
    const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`)
    const match = content.match(regex)
    return match ? (match[1] || match[2] || '').trim() : ''
}

function decodeHTMLEntities(text: string): string {
    return text
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
}

interface NewsItem {
    title: string
    link: string
    pubDate: string
    source: string
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const club = searchParams.get('club') || 'fcb'

    // Google News RSS search queries
    const searchQuery = club === 'fcb'
        ? 'FC+Bayern+München'
        : 'TSV+1860+München'

    const rssUrl = `https://news.google.com/rss/search?q=${searchQuery}&hl=de&gl=DE&ceid=DE:de`

    try {
        const response = await fetch(rssUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; FCB-TSV-Ticker/1.0)',
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        })

        if (!response.ok) {
            throw new Error(`RSS fetch failed: ${response.status}`)
        }

        const xml = await response.text()
        const items = parseRSSItems(xml)

        return NextResponse.json({ items })
    } catch (error) {
        console.error('Error fetching news:', error)
        return NextResponse.json(
            { error: 'Failed to fetch news', items: [] },
            { status: 500 }
        )
    }
}
