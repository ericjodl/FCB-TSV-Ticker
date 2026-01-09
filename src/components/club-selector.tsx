'use client'

import { useClub } from '@/context/club-context'

export function ClubSelector() {
    const { club, setClub, clubName, league } = useClub()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo / Title */}
                <div className="flex items-center gap-3">
                    <img
                        src={club === 'fcb' ? '/fcb-logo.png' : '/tsv-logo.png'}
                        alt={clubName}
                        className="h-12 w-12 object-contain filter drop-shadow-md transition-all duration-300 hover:scale-110"
                    />
                    <div className="hidden sm:block">
                        <h1 className="text-lg font-bold">{clubName}</h1>
                        <p className="text-xs text-muted-foreground">{league}</p>
                    </div>
                </div>

                {/* Club Toggle */}
                <div className="flex rounded-lg bg-muted p-1 gap-1">
                    <button
                        onClick={() => setClub('fcb')}
                        className={`p-2 rounded-md transition-all duration-200 ${club === 'fcb'
                            ? 'bg-white shadow-sm scale-110'
                            : 'opacity-50 hover:opacity-100 hover:bg-white/50'
                            }`}
                        title="FC Bayern München"
                    >
                        <img src="/fcb-logo.png" alt="FCB" className="h-8 w-8 object-contain" />
                    </button>
                    <button
                        onClick={() => setClub('tsv')}
                        className={`p-2 rounded-md transition-all duration-200 ${club === 'tsv'
                            ? 'bg-white shadow-sm scale-110'
                            : 'opacity-50 hover:opacity-100 hover:bg-white/50'
                            }`}
                        title="TSV 1860 München"
                    >
                        <img src="/tsv-logo.png" alt="1860" className="h-8 w-8 object-contain" />
                    </button>
                </div>
            </div>
        </header>
    )
}
