import { describe, expect, it } from 'vitest'
import { getSessionRating, getSessionRatingLabel } from './sessionRating'

describe('sessionRating', () => {
  it('rates excellent when completion and RPE are in range', () => {
    expect(getSessionRating(95, 8)).toEqual({
      labelKey: 'sessionRating.excellent',
      variant: 'excellent',
    })
    expect(getSessionRating(100, 7)).toEqual({
      labelKey: 'sessionRating.excellent',
      variant: 'excellent',
    })
    expect(getSessionRating(100, 9)).toEqual({
      labelKey: 'sessionRating.excellent',
      variant: 'excellent',
    })
  })

  it('falls back to good when completion is high but RPE is out of range', () => {
    expect(getSessionRating(96, 6)).toEqual({ labelKey: 'sessionRating.good', variant: 'good' })
    expect(getSessionRating(96, null)).toEqual({ labelKey: 'sessionRating.good', variant: 'good' })
    expect(getSessionRating(96, 10)).toEqual({ labelKey: 'sessionRating.good', variant: 'good' })
  })

  it('rates good, fair, and needs improvement by completion thresholds', () => {
    expect(getSessionRating(85, 8)).toEqual({ labelKey: 'sessionRating.good', variant: 'good' })
    expect(getSessionRating(70, 8)).toEqual({ labelKey: 'sessionRating.fair', variant: 'fair' })
    expect(getSessionRating(69, 8)).toEqual({
      labelKey: 'sessionRating.needsImprovement',
      variant: 'needs-improvement',
    })
  })

  it('translates rating labels', () => {
    const rating = getSessionRating(95, 8)
    expect(getSessionRatingLabel(rating, 'en')).toBe('Excellent')
    expect(getSessionRatingLabel(rating.variant, 'zh-TW')).toBe('優秀')
  })
})
