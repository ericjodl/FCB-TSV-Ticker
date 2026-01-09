'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Club = 'fcb' | 'tsv'

interface ClubContextType {
    club: Club
    setClub: (club: Club) => void
    clubName: string
    league: string
    leagueShortcut: 'bl1' | 'bl3'
    teamId: number
    primaryColor: string
}

const ClubContext = createContext<ClubContextType | undefined>(undefined)

const CLUB_DATA = {
    fcb: {
        clubName: 'FC Bayern München',
        league: '1. Bundesliga',
        leagueShortcut: 'bl1' as const,
        teamId: 40,
        primaryColor: '#DC052D',
    },
    tsv: {
        clubName: 'TSV 1860 München',
        league: '3. Liga',
        leagueShortcut: 'bl3' as const,
        teamId: 1009,
        primaryColor: '#269BE3', // Himmelblau
    },
}

export function ClubProvider({ children }: { children: ReactNode }) {
    const [club, setClubState] = useState<Club>('fcb')

    useEffect(() => {
        const saved = localStorage.getItem('selected-club') as Club | null
        if (saved && (saved === 'fcb' || saved === 'tsv')) {
            setClubState(saved)
        }
    }, [])

    useEffect(() => {
        // Update document class for theme
        document.documentElement.classList.remove('theme-fcb', 'theme-tsv')
        document.documentElement.classList.add(`theme-${club}`)
    }, [club])

    const setClub = (newClub: Club) => {
        setClubState(newClub)
        localStorage.setItem('selected-club', newClub)
    }

    const value: ClubContextType = {
        club,
        setClub,
        ...CLUB_DATA[club],
    }

    return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>
}

export function useClub() {
    const context = useContext(ClubContext)
    if (context === undefined) {
        throw new Error('useClub must be used within a ClubProvider')
    }
    return context
}
