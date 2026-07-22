import { describe, expect, it } from 'vitest'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import {
  calculateCheckInMetricTrend,
  calculateRecoveryScoreTrend,
  calculateWeeklyVolumeComparison,
  isInWeekOffset,
} from './insightsCalculations'

const emptyBodySummary = {
  latestWeightKg: null,
  previousWeightKg: null,
  weightChangeKg: null,
  latestBodyFatPercent: null,
  previousBodyFatPercent: null,
  bodyFatChangePercent: null,
  latestMuscleMassKg: null,
  previousMuscleMassKg: null,
  muscleMassChangeKg: null,
  latestWaistCm: null,
  previousWaistCm: null,
  waistChangeCm: null,
  lastUpdatedAt: null,
}

describe('insightsCalculations', () => {
  it('detects week offsets for workout sessions', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    expect(isInWeekOffset('2026-07-22T10:00:00.000Z', 0, now)).toBe(true)
    expect(isInWeekOffset('2026-07-15T10:00:00.000Z', 1, now)).toBe(true)
    expect(isInWeekOffset('2026-07-01T10:00:00.000Z', 0, now)).toBe(false)
  })

  it('compares weekly training volume', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    const comparison = calculateWeeklyVolumeComparison(
      [
        { completedAt: '2026-07-22T10:00:00.000Z', totalVolume: 1000 } as never,
        { completedAt: '2026-07-15T10:00:00.000Z', totalVolume: 800 } as never,
      ],
      now,
    )

    expect(comparison.currentWeekVolume).toBe(1000)
    expect(comparison.previousWeekVolume).toBe(800)
    expect(comparison.direction).toBe('up')
  })

  it('calculates check-in metric trends from recent history', () => {
    const entries = [
      { recordedAt: '2026-07-18T08:00:00.000Z', sleepQuality: 3 },
      { recordedAt: '2026-07-19T08:00:00.000Z', sleepQuality: 3 },
      { recordedAt: '2026-07-20T08:00:00.000Z', sleepQuality: 4 },
      { recordedAt: '2026-07-21T08:00:00.000Z', sleepQuality: 5 },
      { recordedAt: '2026-07-22T08:00:00.000Z', sleepQuality: 5 },
    ].map((entry, index) => ({
      id: `check-in-${index}`,
      fatigue: 3,
      motivation: 4,
      muscleSoreness: 2,
      notes: null,
      version: DAILY_CHECK_IN_VERSION,
      ...entry,
    }))

    const trend = calculateCheckInMetricTrend(entries, 'sleepQuality')
    expect(trend?.direction).toBe('up')
    expect(trend?.recentAverage).toBeGreaterThan(trend?.previousAverage ?? 0)
  })

  it('calculates recovery score trend', () => {
    const entries = [
      { recordedAt: '2026-07-18T08:00:00.000Z', fatigue: 4, sleepQuality: 2, motivation: 3, muscleSoreness: 4 },
      { recordedAt: '2026-07-19T08:00:00.000Z', fatigue: 4, sleepQuality: 3, motivation: 3, muscleSoreness: 3 },
      { recordedAt: '2026-07-20T08:00:00.000Z', fatigue: 3, sleepQuality: 3, motivation: 4, muscleSoreness: 3 },
      { recordedAt: '2026-07-21T08:00:00.000Z', fatigue: 2, sleepQuality: 4, motivation: 4, muscleSoreness: 2 },
      { recordedAt: '2026-07-22T08:00:00.000Z', fatigue: 2, sleepQuality: 5, motivation: 5, muscleSoreness: 1 },
    ].map((entry, index) => ({
      id: `check-in-${index}`,
      notes: null,
      version: DAILY_CHECK_IN_VERSION,
      ...entry,
    }))

    const trend = calculateRecoveryScoreTrend(entries)
    expect(trend).not.toBeNull()
    expect(trend?.direction).toBe('up')
  })

  it('exports empty body summary helper compatibility', () => {
    expect(emptyBodySummary.latestWeightKg).toBeNull()
  })
})
