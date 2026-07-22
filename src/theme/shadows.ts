/**
 * Elevation / shadow tokens for SPS design system.
 */

export const shadows = {
  card: '0 1px 2px rgba(0, 0, 0, 0.24), 0 0 0 1px var(--border)',
  modal: '0 16px 48px rgba(0, 0, 0, 0.48), 0 0 0 1px var(--border)',
  floating: '0 8px 24px rgba(0, 0, 0, 0.32)',
  primaryGlow: '0 0 20px var(--primary-glow)',
} as const

export type ShadowToken = keyof typeof shadows
