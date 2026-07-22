import { describe, expect, it } from 'vitest'
import {
  applyTheme,
  colorsByTheme,
  darkColors,
  getAppliedTheme,
  lightColors,
  radius,
  shadows,
  spacing,
  typography,
} from './index'

describe('design system tokens', () => {
  it('exports dark and light semantic color palettes', () => {
    expect(colorsByTheme.dark.background).toBe(darkColors.background)
    expect(colorsByTheme.light.background).toBe(lightColors.background)
    expect(darkColors.primary).toBeTruthy()
    expect(lightColors.primary).toBeTruthy()
  })

  it('uses an 8px spacing scale', () => {
    expect(spacing.xs).toBe('8px')
    expect(spacing.sm).toBe('16px')
    expect(spacing.md).toBe('24px')
  })

  it('defines typography scale entries', () => {
    expect(typography.h1.fontSize).toBe('28px')
    expect(typography.body.lineHeight).toBe(1.5)
    expect(typography.button.fontWeight).toBe(600)
  })

  it('defines radius and shadow tokens', () => {
    expect(radius.pill).toBe('999px')
    expect(shadows.card).toContain('var(--border)')
  })
})

describe('applyTheme', () => {
  it('sets and reads the light theme attribute', () => {
    applyTheme('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(getAppliedTheme()).toBe('light')

    applyTheme('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    expect(getAppliedTheme()).toBe('dark')
  })
})
