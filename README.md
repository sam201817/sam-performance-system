# Sam Performance System (SPS)

A local-first performance app for daily readiness check-ins, structured workouts, body composition tracking, and training insights. All data stays in your browser — no account, no server, no cloud sync.

**Version:** 1.0.1

## Overview

SPS helps you train consistently by connecting how you feel each day with what you do in the gym. Complete a short daily check-in, follow guided workout sessions, review your history, and track body metrics over time — entirely offline on your device.

## Features

- **Daily Check-in** — Log fatigue, sleep, motivation, and soreness before training
- **Workout Flow** — Exercise-by-exercise logging with sets, RPE, and rest timer
- **Workout History** — Session list, statistics, and per-exercise detail views
- **Dashboard** — Readiness summary, quick stats, streaks, and performance insights
- **Body Composition** — Weight, body fat, muscle mass, and waist trends
- **Settings** — Language (English / Traditional Chinese), backup export, restore, and data reset
- **Localization** — Full UI support for `en` and `zh-TW`

## Screens

| Screen | Description |
|--------|-------------|
| Daily Check-in | Mandatory readiness gate (first use each day) |
| Dashboard | Home hub with workout hero, readiness, insights, and summary cards |
| Workout | Active session logging |
| Workout Complete | Post-session summary |
| History | Aggregate stats and session list |
| History Detail | Per-exercise breakdown for a session |
| Body Composition | Metrics entry, trends, and history |
| Profile | Navigation hub for body composition and settings |
| Settings | Preferences, backup/restore, privacy, and about |

## Technology Stack

| Layer | Choice |
|-------|--------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Plain CSS with design tokens (no Tailwind / component library) |
| Storage | `localStorage` (versioned JSON schemas) |
| Tests | Vitest + Testing Library |
| Lint | ESLint |

## Local-First Philosophy

SPS is designed to work without a backend:

- All records are stored in the browser's `localStorage`
- Export a JSON backup at any time from Settings
- Restore backups when switching devices or recovering data
- No authentication, analytics, or third-party data sharing

Clear your browser data for this site and your SPS records may be removed — export backups regularly.

## Development Setup

### Prerequisites

- Node.js 20+
- npm

### Install and run

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## Testing

```bash
npm run lint          # ESLint
npm run test:run      # Vitest (single run)
npm run test          # Vitest (watch mode)
npm run test:coverage # Coverage report
```

Integration flow tests cover check-in, workout, history, dashboard, body composition, and settings journeys.

## Folder Structure

```
src/
├── app/           Application state (useAppState)
├── components/    UI by domain (ui/, dashboard/, workout/, body/, …)
├── constants/     Storage keys and shared constants
├── data/          Static workout and app metadata
├── hooks/         React hooks
├── i18n/          Localization provider
├── locales/       Translation strings (en, zh-TW)
├── screens/       Full-page views
├── styles/        Shared CSS utilities
├── theme/         Design tokens
├── types/         TypeScript types
├── utils/         Storage, calculations, validation
└── test/          Integration tests and fixtures

docs/              Architecture and coding guidelines
```

See `docs/` for detailed architecture, component guidelines, folder conventions, and coding standards.

## License

This project is **private** and not licensed for public distribution. All rights reserved.
