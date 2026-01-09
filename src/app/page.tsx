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

                {/* Attribution & Donate */}
                <footer className="mt-12 text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
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

                    {/* PayPal Donate Button */}
                    <div className="pt-4 border-t border-border/50">
                        <p className="text-sm text-muted-foreground mb-3">
                            Gefällt dir diese Seite? Unterstütze uns!
                        </p>
                        <a
                            href="https://www.paypal.com/donate/?hosted_button_id=VGU8E7WV6QAUJ"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0070ba] hover:bg-[#005ea6] text-white font-semibold rounded-lg transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                            >
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.643h6.678c2.66 0 4.516.637 5.509 1.894.453.573.766 1.23.912 1.95.156.769.144 1.69-.035 2.738-.224 1.323-.6 2.479-1.115 3.428-.491.903-1.109 1.653-1.837 2.225-.697.548-1.503.958-2.397 1.218-.864.253-1.822.38-2.848.38h-.645c-.524 0-1.015.209-1.374.583a1.72 1.72 0 0 0-.44 1.425l-.012.063-.597 3.78-.007.044a.46.46 0 0 1-.452.376h-.96zm.05-1.5h.356l.546-3.463a2.69 2.69 0 0 1 .687-1.411 2.68 2.68 0 0 1 2.114-.897h.645c.872 0 1.656-.106 2.35-.316.722-.219 1.354-.545 1.883-.97.555-.446 1.021-1.01 1.385-1.68.38-.705.68-1.566.862-2.562.156-.916.17-1.63.042-2.19-.12-.529-.33-.977-.625-1.335-.65-.788-1.97-1.303-4.125-1.303H6.378L3.702 19.837h3.424z" />
                            </svg>
                            Mit PayPal spenden
                        </a>
                    </div>
                </footer>
            </div>
        </main>
    )
}
