import { describe, expect, it } from 'vitest'
import type { DailyCheckInEntry } from '../types/dailyCheckIn'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import {
  buildDailyCheckInSummary,
  calculateReadinessScore,
  getReadinessStatusLabel,
} from './dailyCheckInCalculations'

const sampleEntry: DailyCheckInEntry = {
  id: 'check-in-1',
  recordedAt: '2026-07-22T08:00:00.000Z',
  fatigue: 2,
  sleepQuality: 5,
  motivation: 4,
  muscleSoreness: 1,
  notes: null,
  version: DAILY_CHECK_IN_VERSION,
}

describe('dailyCheckInCalculations', () => {
  it('calculates readiness from positive and inverted metrics', () => {
    expect(calculateReadinessScore(sampleEntry)).toBe(80)
    expect(getReadinessStatusLabel(80)).toBe('Ready to train')
  })

  it('builds a dashboard summary', () => {
    const summary = buildDailyCheckInSummary({
      ...sampleEntry,
      notes: 'Good sleep',
    })

    expect(summary.score).toBe(80)
    expect(summary.statusLabel).toBe('Ready to train')
    expect(summary.hasNote).toBe(true)
    expect(summary.sleepQuality).toBe(5)
  })

  it('labels moderate and low readiness', () => {
    expect(getReadinessStatusLabel(65)).toBe('Moderate readiness')
    expect(getReadinessStatusLabel(40)).toBe('Take it easy')
  })
})
