import { describe, expect, it } from 'vitest'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import {
  buildPerformanceInsights,
  getPerformanceInsightsForCoach,
  rankInsights,
  selectTopInsights,
} from './performanceInsightsEngine'

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

function createSession(completedAt: string, totalVolume = 1000) {
  return {
    id: `session-${completedAt}`,
    sessionId: 'full-body-rebuild-v1',
    workoutName: '全身基礎重建',
    startedAt: completedAt,
    completedAt,
    durationMinutes: 55,
    totalExercises: 7,
    completedExercises: 7,
    totalSets: 21,
    completedSets: 18,
    totalVolume,
    averageRpe: 8,
    completionPercentage: 86,
    exercises: [],
    notes: null,
    version: WORKOUT_HISTORY_VERSION,
  }
}

describe('performanceInsightsEngine', () => {
  it('returns empty insights when no data exists', () => {
    const snapshot = buildPerformanceInsights({
      sessions: [],
      bodySummary: emptyBodySummary,
      checkInEntries: [],
      todayCheckIn: null,
    })

    expect(snapshot.insights).toEqual([])
    expect(snapshot.topInsights).toEqual([])
  })

  it('generates training, recovery, and consistency insights', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    const snapshot = buildPerformanceInsights({
      sessions: [
        createSession('2026-07-22T10:00:00.000Z'),
        createSession('2026-07-21T10:00:00.000Z'),
        createSession('2026-07-20T10:00:00.000Z'),
      ],
      bodySummary: {
        ...emptyBodySummary,
        latestWeightKg: 80,
        previousWeightKg: 81,
        weightChangeKg: -1,
        lastUpdatedAt: '2026-07-22T08:00:00.000Z',
      },
      checkInEntries: [
        {
          id: 'check-in-1',
          recordedAt: '2026-07-22T08:00:00.000Z',
          fatigue: 2,
          sleepQuality: 4,
          motivation: 4,
          muscleSoreness: 2,
          notes: null,
          version: DAILY_CHECK_IN_VERSION,
        },
      ],
      todayCheckIn: {
        score: 80,
        statusLabel: 'Ready to train',
        fatigue: 2,
        sleepQuality: 4,
        motivation: 4,
        muscleSoreness: 2,
        hasNote: false,
      },
      now,
    })

    expect(snapshot.insights.some((insight) => insight.category === 'training')).toBe(true)
    expect(snapshot.insights.some((insight) => insight.category === 'recovery')).toBe(true)
    expect(snapshot.insights.some((insight) => insight.category === 'consistency')).toBe(true)
    expect(snapshot.topInsights.length).toBeGreaterThan(0)
    expect(snapshot.topInsights.length).toBeLessThanOrEqual(5)
    expect(snapshot.context.workoutCount).toBe(3)
  })

  it('prioritizes critical fatigue insight', () => {
    const snapshot = buildPerformanceInsights({
      sessions: [createSession('2026-07-22T10:00:00.000Z')],
      bodySummary: emptyBodySummary,
      checkInEntries: [],
      todayCheckIn: {
        score: 45,
        statusLabel: 'Take it easy',
        fatigue: 5,
        sleepQuality: 2,
        motivation: 2,
        muscleSoreness: 4,
        hasNote: false,
      },
    })

    expect(snapshot.topInsights[0]?.id).toBe('recovery-high-fatigue')
  })

  it('selects top insights by priority', () => {
    const ranked = rankInsights([
      { id: 'a', title: 'A', description: 'A', category: 'training', severity: 'info', priority: 10 },
      { id: 'b', title: 'B', description: 'B', category: 'training', severity: 'info', priority: 90 },
      { id: 'c', title: 'C', description: 'C', category: 'training', severity: 'info', priority: 50 },
      { id: 'd', title: 'D', description: 'D', category: 'training', severity: 'info', priority: 40 },
    ])

    expect(selectTopInsights(ranked).map((insight) => insight.id)).toEqual(['b', 'c', 'd', 'a'])
  })

  it('exposes coach integration snapshot', () => {
    const snapshot = getPerformanceInsightsForCoach({
      sessions: [],
      bodySummary: emptyBodySummary,
      checkInEntries: [],
      todayCheckIn: null,
    })

    expect(snapshot.generatedAt).toBeTruthy()
    expect(snapshot.context.categoryCounts.training).toBe(0)
  })
})
