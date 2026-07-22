import type { ThemeMode } from './colors'

const THEME_ATTRIBUTE = 'data-theme'

/**
 * Applies a theme mode to the document root.
 * Light theme CSS is defined under [data-theme='light']; dark is the default.
 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return

  if (mode === 'dark') {
    document.documentElement.removeAttribute(THEME_ATTRIBUTE)
    return
  }

  document.documentElement.setAttribute(THEME_ATTRIBUTE, mode)
}

export function getAppliedTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'dark'

  const value = document.documentElement.getAttribute(THEME_ATTRIBUTE)
  return value === 'light' ? 'light' : 'dark'
}
