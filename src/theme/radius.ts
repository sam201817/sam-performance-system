/**
 * Border radius tokens for SPS design system.
 */

export const radius = {
  sm: '12px',
  md: '20px',
  lg: '26px',
  xl: '32px',
  pill: '999px',
} as const

export type RadiusToken = keyof typeof radius
