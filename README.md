# FCB & TSV 1860 Ticker

Eine responsive Fußball-News-Webseite für FC Bayern München und TSV 1860 München.

## Features

- 🔄 **Club Selector** - Wechsel zwischen FCB (Bundesliga) und TSV 1860 (3. Liga)
- 📊 **Tabelle** - Aktuelle Liga-Tabelle mit Team-Highlighting
- ⚽ **Letztes Spiel** - Ergebnis, Torschützen und Match-Details
- 📅 **Nächste Spiele** - Kommende Partien mit Countdown
- 🌓 **Dark Mode** - Automatische Erkennung oder manueller Toggle
- 🎨 **Club-Themes** - Rot für FCB, Blau für 1860

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui Components
- **Daten:** OpenLigaDB API (kostenlos, kein API-Key)
- **Deployment:** Docker, Google Cloud Run ready

## Setup

### Development

```bash
# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

### Production

```bash
# Build erstellen
npm run build

# Production-Server starten
npm run start
```

### Docker

```bash
# Image bauen
docker build -t fcb-tsv-ticker .

# Container starten
docker run -p 3000:3000 fcb-tsv-ticker
```

## Projektstruktur

```
src/
├── app/
│   ├── api/                 # API Routes
│   │   ├── health/          # Health Check
│   │   ├── matches/[league]/ # Match-Daten
│   │   └── standings/[league]/ # Tabellen-Daten
│   ├── globals.css          # Globale Styles & Themes
│   ├── layout.tsx           # Root Layout
│   └── page.tsx             # Dashboard
├── components/
│   ├── ui/                  # shadcn/ui Components
│   ├── club-selector.tsx    # Club-Auswahl Header
│   ├── last-match.tsx       # Letztes Spiel Widget
│   ├── next-fixtures.tsx    # Nächste Spiele Widget
│   └── standings-table.tsx  # Tabellen Widget
├── context/
│   └── club-context.tsx     # Club-State Management
└── lib/
    ├── api/
    │   ├── cache.ts         # In-Memory Cache
    │   └── openligadb.ts    # API Client
    └── utils.ts             # Hilfsfunktionen
```

## API

Das Projekt nutzt [OpenLigaDB](https://www.openligadb.de) als Datenquelle:

- Keine Registrierung erforderlich
- Rate Limit: 1000 Requests/Stunde
- Liga-Kürzel: `bl1` (1. Bundesliga), `bl3` (3. Liga)

## Lizenz

MIT
