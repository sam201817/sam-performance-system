/**
 * Semantic color tokens for SPS design system.
 * CSS custom properties are defined in tokens.css; these values mirror that source of truth.
 */

export type ThemeMode = 'dark' | 'light'

export type SemanticColors = {
  background: string
  surface: string
  surfaceElevated: string
  surfaceHover: string
  surfaceSubtle: string
  surfaceMuted: string
  primary: string
  primaryHover: string
  primaryDim: string
  primaryGlow: string
  primaryBorder: string
  primaryOn: string
  success: string
  successSurface: string
  successBorder: string
  warning: string
  warningSurface: string
  warningBorder: string
  danger: string
  dangerSurface: string
  dangerBorder: string
  dangerText: string
  border: string
  borderStrong: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  divider: string
  overlay: string
  overlaySurface: string
  stateGood: string
  stateNeutral: string
  statePoor: string
  stateGoodSurface: string
  statePoorSurface: string
}

export const darkColors: SemanticColors = {
  background: '#0a0a0a',
  surface: '#161616',
  surfaceElevated: '#131313',
  surfaceHover: '#1c1c1c',
  surfaceSubtle: 'rgba(255, 255, 255, 0.02)',
  surfaceMuted: 'rgba(255, 255, 255, 0.03)',
  primary: '#b8d926',
  primaryHover: '#c9e84a',
  primaryDim: 'rgba(184, 217, 38, 0.12)',
  primaryGlow: 'rgba(184, 217, 38, 0.18)',
  primaryBorder: 'rgba(184, 217, 38, 0.35)',
  primaryOn: '#0a0a0a',
  success: '#22c55e',
  successSurface: 'rgba(34, 197, 94, 0.08)',
  successBorder: 'rgba(34, 197, 94, 0.35)',
  warning: '#d4b04a',
  warningSurface: 'rgba(212, 176, 74, 0.12)',
  warningBorder: 'rgba(212, 176, 74, 0.28)',
  danger: '#b42318',
  dangerSurface: 'rgba(180, 35, 24, 0.08)',
  dangerBorder: 'rgba(180, 35, 24, 0.45)',
  dangerText: '#ffb4ab',
  border: 'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.12)',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.62)',
  textMuted: 'rgba(255, 255, 255, 0.38)',
  divider: 'rgba(255, 255, 255, 0.06)',
  overlay: 'rgba(0, 0, 0, 0.65)',
  overlaySurface: 'rgba(22, 22, 22, 0.98)',
  stateGood: 'rgba(184, 217, 38, 0.85)',
  stateNeutral: 'rgba(255, 255, 255, 0.55)',
  statePoor: 'rgba(220, 140, 110, 0.75)',
  stateGoodSurface: 'rgba(184, 217, 38, 0.08)',
  statePoorSurface: 'rgba(220, 140, 110, 0.08)',
}

/** Light theme palette — ready for future theme switching. */
export const lightColors: SemanticColors = {
  background: '#f5f5f4',
  surface: '#ffffff',
  surfaceElevated: '#fafaf9',
  surfaceHover: '#f0f0ef',
  surfaceSubtle: 'rgba(0, 0, 0, 0.02)',
  surfaceMuted: 'rgba(0, 0, 0, 0.04)',
  primary: '#8fb800',
  primaryHover: '#7aa000',
  primaryDim: 'rgba(143, 184, 0, 0.12)',
  primaryGlow: 'rgba(143, 184, 0, 0.18)',
  primaryBorder: 'rgba(143, 184, 0, 0.45)',
  primaryOn: '#0a0a0a',
  success: '#16a34a',
  successSurface: 'rgba(22, 163, 74, 0.08)',
  successBorder: 'rgba(22, 163, 74, 0.35)',
  warning: '#b8860b',
  warningSurface: 'rgba(184, 134, 11, 0.1)',
  warningBorder: 'rgba(184, 134, 11, 0.3)',
  danger: '#b42318',
  dangerSurface: 'rgba(180, 35, 24, 0.08)',
  dangerBorder: 'rgba(180, 35, 24, 0.35)',
  dangerText: '#9a1c12',
  border: 'rgba(0, 0, 0, 0.08)',
  borderStrong: 'rgba(0, 0, 0, 0.14)',
  textPrimary: '#171717',
  textSecondary: 'rgba(23, 23, 23, 0.62)',
  textMuted: 'rgba(23, 23, 23, 0.42)',
  divider: 'rgba(0, 0, 0, 0.06)',
  overlay: 'rgba(0, 0, 0, 0.4)',
  overlaySurface: '#ffffff',
  stateGood: 'rgba(143, 184, 0, 0.9)',
  stateNeutral: 'rgba(23, 23, 23, 0.55)',
  statePoor: 'rgba(180, 80, 50, 0.85)',
  stateGoodSurface: 'rgba(143, 184, 0, 0.1)',
  statePoorSurface: 'rgba(180, 80, 50, 0.08)',
}

export const colorsByTheme: Record<ThemeMode, SemanticColors> = {
  dark: darkColors,
  light: lightColors,
}
