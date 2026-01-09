import { ClubSelector } from '@/components/club-selector'
import { StandingsTable } from '@/components/standings-table'
import { LastMatch } from '@/components/last-match'
import { NextFixtures } from '@/components/next-fixtures'
import { NewsFeed } from '@/components/news-feed'

export default function Home() {
    return (
        <main className="min-h-screen">
            <ClubSelector />

            <div className="container mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="mb-8 text-center animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2 gradient-text">
                        München Fußball Ticker
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        FC Bayern München und TSV 1860 München: Freundschaft bis in den Tod !
                    </p>
                </section>

                {/* Dashboard Grid - Two column layout on large screens */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Top row: Last Match and Next Fixtures */}
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                                <LastMatch />
                            </div>
                            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                                <NextFixtures />
                            </div>
                        </div>

                        {/* Standings below */}
                        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                            <StandingsTable />
                        </div>
                    </div>

                    {/* Right Column: News Feed */}
                    <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                        <NewsFeed />
                    </div>
                </div>

                {/* Attribution */}
                <footer className="mt-12 text-center text-sm text-muted-foreground">
                    <p>
                        Daten bereitgestellt von{' '}
                        <a
                            href="https://www.openligadb.de"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            OpenLigaDB
                        </a>
                    </p>
                </footer>
            </div>
        </main>
    )
}
