import { describe, expect, it } from 'vitest'
import { getSessionRating } from './sessionRating'

describe('sessionRating', () => {
  it('rates excellent when completion and RPE are in range', () => {
    expect(getSessionRating(95, 8)).toEqual({
      label: 'Excellent',
      variant: 'excellent',
    })
    expect(getSessionRating(100, 7)).toEqual({
      label: 'Excellent',
      variant: 'excellent',
    })
    expect(getSessionRating(100, 9)).toEqual({
      label: 'Excellent',
      variant: 'excellent',
    })
  })

  it('falls back to good when completion is high but RPE is out of range', () => {
    expect(getSessionRating(96, 6)).toEqual({ label: 'Good', variant: 'good' })
    expect(getSessionRating(96, null)).toEqual({ label: 'Good', variant: 'good' })
    expect(getSessionRating(96, 10)).toEqual({ label: 'Good', variant: 'good' })
  })

  it('rates good, fair, and needs improvement by completion thresholds', () => {
    expect(getSessionRating(85, 8)).toEqual({ label: 'Good', variant: 'good' })
    expect(getSessionRating(70, 8)).toEqual({ label: 'Fair', variant: 'fair' })
    expect(getSessionRating(69, 8)).toEqual({
      label: 'Needs Improvement',
      variant: 'needs-improvement',
    })
  })
})
