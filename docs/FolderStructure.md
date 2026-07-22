# Folder Structure

This document describes how source files are organized and where to add new code.

## Root (`src/`)

| Path | Purpose |
|------|---------|
| `main.tsx` | Vite entry; mounts React root |
| `App.tsx` | Shell: `I18nProvider` + screen switch on `useAppState` |
| `index.css` | Global resets and token imports |
| `App.css` | App shell layout |

## `app/`

Application-level hooks that coordinate multiple domains.

- `useAppState.ts` — central state, navigation handlers, persistence side effects

Add new cross-cutting app logic here rather than bloating `App.tsx`.

## `screens/`

One file per full-page view (plus colocated `.css` and `.test.tsx`).

Examples: `Dashboard.tsx`, `Workout.tsx`, `Settings.tsx`

Screens should:

- Compose components from `components/`
- Use `useTranslation()` for copy
- Accept typed props from `types/screens.ts`
- Avoid direct `localStorage` access

## `components/`

Grouped by feature domain:

| Folder | Contents |
|--------|----------|
| `ui/` | Generic reusable UI (PageHeader, StatTile, EmptyState, InfoBanner, …) |
| `dashboard/` | Dashboard-specific cards and sections |
| `workout/` | Workout flow UI (sets, timers, RPE) |
| `body/` | Body composition forms and charts |
| `history/` | Workout history list items |
| `checkin/` | Daily check-in form controls |
| `settings/` | Settings sections and confirm dialogs |

Place shared UI in `ui/` when it appears in two or more domains.

## `types/`

Domain types and screen prop interfaces.

- Domain: `bodyMetrics.ts`, `workoutHistory.ts`, `settings.ts`, …
- Screen props: `screens.ts` (re-exported from `workout.ts` for backward compatibility)
- Navigation: `app.ts` (`AppScreen`, `NavTabId`)

## `utils/`

Pure functions and storage. Naming conventions:

| Pattern | Example | Role |
|---------|---------|------|
| `*Storage.ts` | `bodyMetricStorage.ts` | Load/save/normalize persisted data |
| `*Calculations.ts` | `dashboardCalculations.ts` | Derive metrics from records |
| `*Factory.ts` | `workoutHistoryFactory.ts` | Build/combine domain objects |
| `*Validation.ts` | `backupValidation.ts` | Parse and validate external input |
| `guards/` | `isRecord.ts` | Shared type guards |
| `storage/` | `jsonStorage.ts` | Generic localStorage helpers |

## `constants/`

Shared constants that must not create import cycles — e.g. `spsStorageKeys.ts`.

## `theme/`

Design system tokens (TypeScript + CSS). Import `tokens.css` globally; use `var(--token-name)` in component CSS.

## `styles/`

Cross-cutting CSS utilities not tied to a single component (`shared.css`).

## `i18n/` and `locales/`

- `i18n/` — provider, `translate()`, language resolution
- `locales/` — string tables (`en.ts`, `zh-TW.ts`)

All user-facing strings belong in locale files.

## `hooks/`

Reusable React hooks (`useTranslation`, `useRestTimer`, …). Extract a hook when the same stateful logic appears in multiple components.

## `test/`

| Path | Purpose |
|------|---------|
| `*Flow.test.tsx` | End-to-end flows through `App` |
| `renderWithI18n.tsx` | Test helper wrapping `I18nProvider` |
| `fixtures/` | Shared test data (e.g. `emptyBodyMetricSummary`) |
| `backupFixtures.ts` | Valid backup payloads for restore tests |

## `data/`

Static content (today's workout definition, app metadata). Not user-editable at runtime.

## Adding a new feature (checklist)

1. Types in `types/`
2. Storage in `utils/*Storage.ts` using `SPS_STORAGE_KEYS` + `jsonStorage`
3. Calculations in dedicated util if non-trivial
4. UI in `components/<domain>/`
5. Screen in `screens/` with props in `types/screens.ts`
6. Wire handlers in `useAppState`
7. Locale keys in `en.ts` and `zh-TW.ts`
8. Tests: unit + flow if user-visible journey changes
