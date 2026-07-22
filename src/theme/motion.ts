/**
 * Motion / transition tokens for SPS design system.
 */

export const motion = {
  durationFast: '0.15s',
  durationBase: '0.2s',
  durationSlow: '0.35s',
  easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
} as const

export const transition = `${motion.durationBase} ${motion.easing}`
