# Component Guidelines

Conventions for building and extending UI in SPS.

## Prefer shared components

Before adding markup, check `components/ui/`:

| Component | Use for |
|-----------|---------|
| `PageHeader` | Screen titles with optional subtitle |
| `SectionTitle` | Section headings (dashboard cards, settings groups) |
| `StatTile` | Label + value metric displays |
| `EmptyState` | Zero-data states with optional CTA |
| `InfoBanner` | Success/error feedback with dismiss |
| `BackButton` | Consistent back navigation |
| `Card` | Bordered content surfaces |

Domain-specific components (e.g. `HeroWorkoutCard`) belong in their feature folder until a second use case appears.

## File structure

Each component typically has:

```
ComponentName.tsx    — implementation
ComponentName.css    — scoped styles (BEM or `sps-*` prefix)
ComponentName.test.tsx — behavior tests (when non-trivial)
```

Co-locate CSS with the component. Do not add global selectors unless the style is truly app-wide (use `styles/shared.css` or theme tokens).

## Styling rules

1. **Use design tokens** — `var(--text-primary)`, `var(--space-md)`, `var(--radius-sm)`, etc.
2. **Use typography utilities** — `sps-h1`, `sps-body-small`, `sps-text-secondary` from `theme/typography.css`
3. **Use shared patterns** — `sps-action-primary`, `sps-segment`, `sps-input` from `styles/shared.css`
4. **Avoid hardcoded colors and pixel spacing** except for one-off layout tweaks

Legacy aliases (`--bg`, `--accent`) still work but prefer semantic names (`--surface`, `--primary`).

## Props and typing

- Define props with a `type` (not `interface`) unless extending DOM attributes
- Keep prop names aligned with callbacks: `onSave`, `onDismiss`, `onNavigate`
- Screen-level prop types live in `types/screens.ts`

## Accessibility

- Use semantic HTML (`main`, `section`, `header`, `button`)
- Icon-only buttons need `aria-label` (via `t('common.*')`)
- Feedback banners use `role="status"` (success) or `role="alert"` (error)
- Dialogs use `role="dialog"` and focus management where implemented

## Internationalization

Never hardcode user-visible strings. Use:

```tsx
const { t } = useTranslation()
return <h1>{t('screen.title')}</h1>
```

For locale arrays (e.g. rotating messages), use `getLocaleArray(language, key)`.

## Performance

- Use `React.memo` for list rows or tiles that re-render often with stable props (`StatTile`, `SetRow`, `BottomNav`)
- Use `useMemo` for expensive derived data in screens/hooks, not inside every child
- Avoid premature `useCallback`; add when passing to memoized children or as effect dependencies

## Empty and error states

- **Empty data** → `EmptyState` with i18n keys under `emptyStates.*`
- **Operation feedback** → `InfoBanner` with appropriate `tone`
- **Storage failures** → handled in storage layer; UI shows generic error via banner when surfaced through `SettingsFeedback`

## When to extract

Extract a shared component when:

- The same structure appears in 2+ places
- Styling duplication exceeds ~15 lines
- Behavior (dismiss, aria roles) should stay consistent

Do **not** extract when only the label differs once — pass props instead.

## Dashboard sections

Use `DashboardSection` (wraps `SectionTitle`) for grouped dashboard content. Keeps section spacing and heading style consistent.

## Settings patterns

- Group rows with `SettingsSection`
- Destructive actions use `ConfirmDialog` with two-step confirmation where required
- Preference toggles use `sps-segment` button groups
