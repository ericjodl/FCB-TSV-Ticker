import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ClubProvider } from '@/context/club-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'FCB & TSV 1860 Ticker - Live Fußball News',
    description: 'Aktuelle News, Spielergebnisse und Tabellen für FC Bayern München und TSV 1860 München',
    keywords: ['FC Bayern', 'TSV 1860', 'Bundesliga', '3. Liga', 'Fußball', 'München'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="de" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    forcedTheme="dark"
                    disableTransitionOnChange
                >
                    <ClubProvider>
                        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
                            {children}
                        </div>
                    </ClubProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
