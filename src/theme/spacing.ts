/**
 * 8px-based spacing scale for SPS design system.
 */

export const spacing = {
  xs: '8px',
  sm: '16px',
  md: '24px',
  lg: '32px',
  xl: '40px',
  '2xl': '48px',
} as const

export type SpacingToken = keyof typeof spacing

/** Legacy spacing aliases preserved for existing layouts. */
export const legacySpacing = {
  xs: spacing.xs,
  sm: '12px',
  md: '16px',
  lg: spacing.md,
  xl: spacing.lg,
} as const
