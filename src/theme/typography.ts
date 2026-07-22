/**
 * Typography scale for SPS design system.
 */

export type TypographyStyle = {
  fontSize: string
  fontWeight: number
  lineHeight: number | string
  letterSpacing?: string
}

export const typography = {
  display: {
    fontSize: '32px',
    fontWeight: 650,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
  },
  h1: {
    fontSize: '28px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '22px',
    fontWeight: 600,
    lineHeight: 1.25,
    letterSpacing: '-0.01em',
  },
  h3: {
    fontSize: '18px',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  title: {
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  body: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  bodySmall: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  caption: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: 1.45,
  },
  button: {
    fontSize: '15px',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  overline: {
    fontSize: '11px',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '0.06em',
  },
  micro: {
    fontSize: '10px',
    fontWeight: 500,
    lineHeight: 1.3,
  },
  compact: {
    fontSize: '13px',
    fontWeight: 400,
    lineHeight: 1.45,
  },
  subtitle: {
    fontSize: '17px',
    fontWeight: 600,
    lineHeight: 1.35,
  },
  stat: {
    fontSize: '20px',
    fontWeight: 650,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
  hero: {
    fontSize: '24px',
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
  },
} as const satisfies Record<string, TypographyStyle>

export type TypographyToken = keyof typeof typography

export const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif"
