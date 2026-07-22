import { describe, expect, it } from 'vitest'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import {
  buildBodyMetricSummary,
  buildMetricTrendData,
  calculateAbsoluteChange,
  getLatestValidValue,
  getPreviousValidValue,
  normalizeChartPoints,
  sortEntriesNewestFirst,
} from './bodyMetricCalculations'

const entries = sortEntriesNewestFirst([
  {
    id: '3',
    recordedAt: '2026-07-22T10:00:00.000Z',
    weightKg: 78,
    bodyFatPercent: 18,
    muscleMassKg: null,
    waistCm: null,
    notes: null,
    version: BODY_METRIC_VERSION,
  },
  {
    id: '2',
    recordedAt: '2026-07-20T10:00:00.000Z',
    weightKg: 79,
    bodyFatPercent: null,
    muscleMassKg: 32,
    waistCm: 84,
    notes: null,
    version: BODY_METRIC_VERSION,
  },
  {
    id: '1',
    recordedAt: '2026-07-18T10:00:00.000Z',
    weightKg: 80,
    bodyFatPercent: 19,
    muscleMassKg: 31,
    waistCm: null,
    notes: null,
    version: BODY_METRIC_VERSION,
  },
])

describe('bodyMetricCalculations', () => {
  it('finds latest and previous valid values', () => {
    expect(getLatestValidValue(entries, 'weightKg')).toBe(78)
    expect(getPreviousValidValue(entries, 'weightKg')).toBe(79)
  })

  it('calculates absolute change', () => {
    expect(calculateAbsoluteChange(78, 79)).toBe(-1)
  })

  it('builds summary with changes', () => {
    const summary = buildBodyMetricSummary(entries)
    expect(summary.latestWeightKg).toBe(78)
    expect(summary.weightChangeKg).toBe(-1)
    expect(summary.latestBodyFatPercent).toBe(18)
  })

  it('handles missing metrics', () => {
    expect(getLatestValidValue(entries, 'waistCm')).toBe(84)
    expect(getPreviousValidValue(entries, 'waistCm')).toBeNull()
  })

  it('normalizes chart points for identical values', () => {
    const identical = normalizeChartPoints([
      {
        id: 'a',
        recordedAt: '2026-07-20T10:00:00.000Z',
        weightKg: 80,
        bodyFatPercent: null,
        muscleMassKg: null,
        waistCm: null,
        notes: null,
        version: BODY_METRIC_VERSION,
      },
      {
        id: 'b',
        recordedAt: '2026-07-22T10:00:00.000Z',
        weightKg: 80,
        bodyFatPercent: null,
        muscleMassKg: null,
        waistCm: null,
        notes: null,
        version: BODY_METRIC_VERSION,
      },
    ], 'weightKg')

    expect(identical).toHaveLength(2)
    expect(identical[0].y).toBe(0.5)
    expect(identical[1].y).toBe(0.5)
  })

  it('handles a single chart point', () => {
    const single = normalizeChartPoints([entries[0]], 'weightKg')
    expect(single).toHaveLength(1)
    expect(single[0].x).toBe(0)
  })

  it('builds trend min max and average', () => {
    const trend = buildMetricTrendData(entries, 'weightKg')
    expect(trend.minimum).toBe(78)
    expect(trend.maximum).toBe(80)
    expect(trend.average).toBe(79)
    expect(trend.absoluteChange).toBe(-1)
  })

  it('sorts unordered inputs newest first', () => {
    const sorted = sortEntriesNewestFirst([
      entries[2],
      entries[0],
      entries[1],
    ])
    expect(sorted[0].id).toBe('3')
  })
})
