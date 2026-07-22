import { describe, expect, it } from 'vitest'
import {
  calculateAverageRpe,
  calculateCompletionPercentage,
  calculateCurrentStreak,
  calculateSetVolume,
  formatRelativeWorkoutDate,
  parseNumericReps,
  parseNumericWeight,
  sortSessionsNewestFirst,
} from './workoutHistoryCalculations'

describe('workoutHistoryCalculations', () => {
  it('parses numeric weights and ignores bodyweight labels', () => {
    expect(parseNumericWeight('24 kg')).toBe(24)
    expect(parseNumericWeight('32 公斤')).toBe(32)
    expect(parseNumericWeight('BW')).toBeNull()
    expect(parseNumericWeight('體重')).toBeNull()
  })

  it('parses numeric reps and ignores distance or time reps', () => {
    expect(parseNumericReps('10')).toBe(10)
    expect(parseNumericReps('每側 10')).toBe(10)
    expect(parseNumericReps('40 公尺')).toBeNull()
    expect(parseNumericReps('30 秒')).toBeNull()
  })

  it('calculates set volume only when reps and weight are numeric', () => {
    expect(calculateSetVolume('10', '24 kg')).toBe(240)
    expect(calculateSetVolume('40 公尺', '24 kg')).toBeNull()
    expect(calculateSetVolume('10', 'BW')).toBeNull()
  })

  it('calculates average RPE while ignoring null values', () => {
    expect(calculateAverageRpe([8, null, 9])).toBe(8.5)
    expect(calculateAverageRpe([null, null])).toBeNull()
  })

  it('calculates completion percentage safely', () => {
    expect(calculateCompletionPercentage(2, 3)).toBe(67)
    expect(calculateCompletionPercentage(0, 0)).toBe(0)
  })

  it('formats relative workout dates', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    expect(formatRelativeWorkoutDate('2026-07-22T10:00:00.000Z', now)).toBe('Today')
    expect(formatRelativeWorkoutDate('2026-07-21T10:00:00.000Z', now)).toBe('Yesterday')
    expect(formatRelativeWorkoutDate('2026-07-19T10:00:00.000Z', now)).toBe('3 days ago')
    expect(formatRelativeWorkoutDate('2026-07-12T10:00:00.000Z', now)).toBe('Last Week')
  })

  it('calculates current streak from completed dates', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    expect(
      calculateCurrentStreak(
        ['2026-07-22T10:00:00.000Z', '2026-07-21T10:00:00.000Z'],
        now,
      ),
    ).toBe(2)
    expect(calculateCurrentStreak(['2026-07-20T10:00:00.000Z'], now)).toBe(0)
  })

  it('sorts sessions newest first', () => {
    const sorted = sortSessionsNewestFirst([
      { completedAt: '2026-01-01T10:00:00.000Z' },
      { completedAt: '2026-02-01T10:00:00.000Z' },
    ])

    expect(sorted[0].completedAt).toBe('2026-02-01T10:00:00.000Z')
  })
})
