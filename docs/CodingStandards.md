# Coding Standards

Project conventions for TypeScript, React, CSS, storage, and tests.

## TypeScript

- **Strict mode** — no `any` unless documented with a comment explaining why
- **Prefer `type` over `interface`** for props and data shapes
- **Shared types** live in `types/`; screen props in `types/screens.ts`
- **Type guards** for JSON parsing: `(value: unknown) => value is T`
- **Re-export carefully** — `types/workout.ts` re-exports screen types for existing imports; new code may import from `types/screens.ts` directly

## React

- Functional components only
- One primary component per file; name file after the component
- Screens in `screens/`, reusable UI in `components/`
- Side effects (localStorage writes) belong in `useAppState` handlers or storage utils — not in render
- `App.tsx` stays thin; add state to `useAppState`

## Naming

| Kind | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `StatTile.tsx` |
| Hooks | `use` prefix | `useAppState.ts` |
| Utils | camelCase | `buildHistoryStatistics` |
| Storage keys | `sps.<domain>.v<N>` | `sps.body-metrics.v1` |
| CSS classes | BEM or `sps-*` | `sps-stat-tile__label` |
| Locale keys | dot-separated | `history.totalWorkouts` |
| Tests | `*.test.ts(x)` colocated | `jsonStorage.test.ts` |

## Storage

1. Add keys to `constants/spsStorageKeys.ts`
2. Use `readJsonStorage` / `writeJsonStorage` from `utils/storage/jsonStorage.ts`
3. Validate with a dedicated guard function
4. Normalize legacy shapes on load
5. Return fallbacks on read failure; return `boolean` on write failure
6. Never change storage key names or schema versions without a migration path

## Error handling

- **Parse errors** — return default/empty state, do not throw to UI
- **Write errors** — return `false`; caller may show feedback if user-initiated
- **Backup restore** — validate via `backupValidation.ts` before applying
- **User input** — validate in `*Validation.ts` modules before save

## CSS

- Component-scoped files; class prefix matches component or `sps-` for shared UI
- Use tokens from `theme/tokens.css`
- Remove dead selectors when removing components
- Responsive breakpoints: existing pattern uses `@media (min-width: 520px)` for stat grids

## i18n

- Every user-visible string in `locales/en.ts` and `locales/zh-TW.ts`
- Keys grouped by screen/feature (`dashboard.*`, `settings.*`, …)
- Use `translate(language, key)` outside React; `useTranslation()` inside components

## Tests

- **Vitest** + **Testing Library**
- Wrap i18n-dependent components with `renderWithI18n` from `src/test/renderWithI18n.tsx`
- Use fixtures from `src/test/fixtures/` for repeated domain objects
- Integration flows test real user journeys through `App`
- Prefer role/label queries over test IDs

Run before submitting:

```bash
npm run lint
npm run test:run
npm run test:coverage
npm run build
```

## Imports

- Use relative imports within `src/`
- Order: external → types → components/hooks → utils → styles (blank line between groups)
- Do not import screens from components (dependency flows downward)

## Git commits

Use conventional prefixes:

- `feat:` — user-facing capability
- `fix:` — bug fix
- `refactor:` — structure/maintainability without feature change
- `test:` — test-only changes
- `docs:` — documentation

This sprint (v1.2.0) target: `refactor: improve architecture and developer experience`

## Deprecated code

- Mark with JSDoc `@deprecated` and point to replacement
- Remove dead code when no imports remain (do not leave unused components)
- Document intentional tradeoffs in `docs/Architecture.md`
