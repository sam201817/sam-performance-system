import { describe, expect, it } from 'vitest'
import type { BodyMetricSummary } from '../types/bodyMetrics'
import type { WorkoutHistorySession } from '../types/workoutHistory'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import {
  buildDashboardOverview,
  calculateDaysSinceUpdate,
  calculateLongestStreak,
  isInCurrentWeek,
  WEEKLY_WORKOUT_TARGET,
} from './dashboardCalculations'

const emptyBodySummary: BodyMetricSummary = {
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

function createSession(
  overrides: Partial<WorkoutHistorySession> = {},
): WorkoutHistorySession {
  return {
    id: 'session-1',
    sessionId: 'full-body-rebuild-v1',
    workoutName: '全身基礎重建',
    startedAt: '2026-07-22T09:00:00.000Z',
    completedAt: '2026-07-22T10:00:00.000Z',
    durationMinutes: 55,
    totalExercises: 7,
    completedExercises: 7,
    totalSets: 21,
    completedSets: 18,
    totalVolume: 1200,
    averageRpe: 8,
    completionPercentage: 86,
    exercises: [],
    notes: null,
    version: WORKOUT_HISTORY_VERSION,
    ...overrides,
  }
}

describe('dashboardCalculations', () => {
  it('detects sessions in the current week', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    expect(isInCurrentWeek('2026-07-22T10:00:00.000Z', now)).toBe(true)
    expect(isInCurrentWeek('2026-07-15T10:00:00.000Z', now)).toBe(false)
  })

  it('calculates longest streak across non-consecutive history', () => {
    expect(
      calculateLongestStreak([
        '2026-07-20T10:00:00.000Z',
        '2026-07-21T10:00:00.000Z',
        '2026-07-22T10:00:00.000Z',
        '2026-07-24T10:00:00.000Z',
      ]),
    ).toBe(3)
  })

  it('calculates days since body update', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    expect(calculateDaysSinceUpdate('2026-07-22T08:00:00.000Z', now)).toBe(0)
    expect(calculateDaysSinceUpdate('2026-07-15T08:00:00.000Z', now)).toBe(7)
    expect(calculateDaysSinceUpdate(null, now)).toBeNull()
  })

  it('builds dashboard overview from history and body summary', () => {
    const now = new Date('2026-07-22T12:00:00.000Z')
    const sessions = [
      createSession({ id: 'a', completedAt: '2026-07-22T10:00:00.000Z', totalVolume: 1000 }),
      createSession({
        id: 'b',
        completedAt: '2026-07-21T10:00:00.000Z',
        totalVolume: 800,
        durationMinutes: 45,
      }),
    ]
    const bodySummary: BodyMetricSummary = {
      ...emptyBodySummary,
      latestWeightKg: 80,
      latestBodyFatPercent: 18,
      lastUpdatedAt: '2026-07-22T08:00:00.000Z',
    }

    const overview = buildDashboardOverview(sessions, bodySummary, now)

    expect(overview.hasWorkoutHistory).toBe(true)
    expect(overview.weeklyTraining.completedWorkouts).toBe(2)
    expect(overview.weeklyTraining.targetWorkouts).toBe(WEEKLY_WORKOUT_TARGET)
    expect(overview.weeklyTraining.totalVolume).toBe(1800)
    expect(overview.weeklyTraining.averageDurationMinutes).toBe(50)
    expect(overview.lastWorkout?.id).toBe('a')
    expect(overview.streak.currentStreak).toBe(2)
    expect(overview.streak.longestStreak).toBe(2)
    expect(overview.streak.totalCompletedWorkouts).toBe(2)
    expect(overview.quickStats.totalWorkouts).toBe(2)
    expect(overview.quickStats.latestWeightKg).toBe(80)
    expect(overview.daysSinceBodyUpdate).toBe(0)
  })

  it('returns empty-state friendly overview without history', () => {
    const overview = buildDashboardOverview([], emptyBodySummary)

    expect(overview.hasWorkoutHistory).toBe(false)
    expect(overview.lastWorkout).toBeNull()
    expect(overview.weeklyTraining.completedWorkouts).toBe(0)
    expect(overview.streak.totalCompletedWorkouts).toBe(0)
  })
})
