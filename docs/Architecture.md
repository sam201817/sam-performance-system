# Architecture

Sam Performance System (SPS) is a client-only React application for daily check-ins, workouts, body composition tracking, and performance insights. All data lives in `localStorage`; there is no backend, authentication, or cloud sync.

## High-level layout

```
src/
├── app/           Application state (useAppState)
├── components/    Reusable UI by domain
├── constants/     Shared constants (storage keys)
├── data/          Static workout/session data
├── hooks/         React hooks
├── i18n/          Localization provider and helpers
├── locales/       Translation strings (en, zh-TW)
├── screens/       Full-page views
├── styles/        Cross-cutting CSS utilities
├── theme/         Design tokens
├── types/         TypeScript domain and screen types
├── utils/         Business logic, storage, calculations
└── test/          Integration tests and fixtures
```

## Navigation model

Navigation is **screen-based**, not router-based. `useAppState` owns the active `AppScreen` and tab state. `App.tsx` is a thin shell that renders the matching screen and passes props from `useAppState`.

Typical flow:

1. Daily check-in gate → Dashboard (home)
2. Bottom nav switches between Home, Workout, History, Profile
3. Secondary screens (Settings, Body Composition, History detail) push via `setScreen`

## State ownership

| Concern | Owner |
|---------|--------|
| Screen / tab navigation | `useAppState` |
| Workout in-progress | `useAppState` + `workoutProgressStorage` |
| History, body metrics, check-ins | `useAppState` + domain storage utils |
| User preferences / language | `useAppState` + `preferencesStorage` |
| Derived dashboard/insights data | `useMemo` in `useAppState` from loaded history |

Screens receive data and callbacks via props (typed in `types/screens.ts`). They do not read `localStorage` directly.

## Storage layer

All persistence goes through `utils/*Storage.ts` modules. Shared helpers:

- `constants/spsStorageKeys.ts` — canonical key names
- `utils/storage/jsonStorage.ts` — read/write with parse guards and graceful failure
- `utils/guards/isRecord.ts` — shared type guard for unknown JSON

Each storage module defines a versioned schema guard (e.g. `isUserPreferences`) and normalizes legacy data on load.

## Internationalization

`I18nProvider` wraps the app with the active language from preferences. Components use `useTranslation()` for `t()` and locale-aware formatting. Language resolution (stored value, legacy key, browser default) lives in `i18n/languageStorage.ts`.

## Design system

Semantic tokens are defined in `theme/tokens.css` and applied via CSS custom properties. Shared UI patterns (buttons, inputs, segments) live in `styles/shared.css`. Typography utilities are in `theme/typography.css`.

Reusable components in `components/ui/` compose these tokens — prefer them over one-off markup.

## Calculations vs. storage

- **Storage modules** load/save/normalize raw records.
- **Calculation modules** (`*Calculations.ts`, `*Factory.ts`, `*Engine.ts`) derive summaries, statistics, and insights from in-memory data.
- **Screens** orchestrate display; they should not embed business rules that belong in utils.

## Testing strategy

- **Unit tests** colocated with utils and components (`*.test.ts(x)`)
- **Integration flows** in `src/test/*Flow.test.tsx` exercise multi-screen journeys through `App`
- **Fixtures** in `src/test/fixtures/` reduce duplicated test setup

## Intentional tradeoffs

- **No React Router** — fewer dependencies; screen count is manageable with explicit state.
- **localStorage only** — simple offline-first model; backup/restore via JSON export covers portability.
- **Plain CSS** — no runtime CSS-in-JS; design tokens provide consistency without a component library.
