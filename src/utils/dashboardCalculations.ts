import type { BodyMetricSummary } from '../types/bodyMetrics'
import type {
  DashboardOverview,
  LastWorkoutSummary,
  QuickStatsSummary,
  StreakSummary,
  WeeklyTrainingSummary,
} from '../types/dashboard'
import type { WorkoutHistorySession } from '../types/workoutHistory'
import { getLocalDateKey } from './bodyMetricCalculations'
import {
  calculateCompletionPercentage,
  calculateCurrentStreak,
  formatVolumeKg,
  sortSessionsNewestFirst,
} from './workoutHistoryCalculations'

export const WEEKLY_WORKOUT_TARGET = 3

function getWeekStart(date: Date): Date {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = local.getDay()
  const mondayOffset = day === 0 ? 6 : day - 1
  local.setDate(local.getDate() - mondayOffset)
  return local
}

export function isInCurrentWeek(completedAt: string, now: Date = new Date()): boolean {
  const completed = new Date(completedAt)
  if (!Number.isFinite(completed.getTime())) return false

  const weekStart = getWeekStart(now).getTime()
  const weekEnd = weekStart + 7 * 86_400_000
  const completedDay = new Date(
    completed.getFullYear(),
    completed.getMonth(),
    completed.getDate(),
  ).getTime()

  return completedDay >= weekStart && completedDay < weekEnd
}

export function calculateLongestStreak(
  completedAtValues: readonly string[],
): number {
  if (completedAtValues.length === 0) return 0

  const uniqueDays = [...new Set(
    completedAtValues
      .map((value) => new Date(value))
      .filter((date) => Number.isFinite(date.getTime()))
      .map((date) => getLocalDateKey(date)),
  )]
    .map((key) => {
      const [year, month, day] = key.split('-').map(Number)
      return new Date(year, month - 1, day).getTime()
    })
    .sort((left, right) => left - right)

  if (uniqueDays.length === 0) return 0

  let longest = 1
  let current = 1

  for (let index = 1; index < uniqueDays.length; index += 1) {
    if (uniqueDays[index] === uniqueDays[index - 1] + 86_400_000) {
      current += 1
      longest = Math.max(longest, current)
      continue
    }
    current = 1
  }

  return longest
}

export function calculateDaysSinceUpdate(
  lastUpdatedAt: string | null,
  now: Date = new Date(),
): number | null {
  if (!lastUpdatedAt) return null

  const updated = new Date(lastUpdatedAt)
  if (!Number.isFinite(updated.getTime())) return null

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const updatedDay = new Date(
    updated.getFullYear(),
    updated.getMonth(),
    updated.getDate(),
  ).getTime()

  return Math.max(0, Math.round((today - updatedDay) / 86_400_000))
}

function buildWeeklyTrainingSummary(
  sessions: readonly WorkoutHistorySession[],
  now: Date = new Date(),
): WeeklyTrainingSummary {
  const weekSessions = sessions.filter((session) => isInCurrentWeek(session.completedAt, now))
  const completedWorkouts = weekSessions.length
  const totalVolume = weekSessions.reduce((sum, session) => sum + session.totalVolume, 0)
  const durationTotal = weekSessions.reduce((sum, session) => sum + session.durationMinutes, 0)

  return {
    completedWorkouts,
    targetWorkouts: WEEKLY_WORKOUT_TARGET,
    completionPercent: calculateCompletionPercentage(completedWorkouts, WEEKLY_WORKOUT_TARGET),
    totalVolume,
    averageDurationMinutes:
      weekSessions.length > 0 ? Math.round(durationTotal / weekSessions.length) : null,
  }
}

function buildLastWorkoutSummary(
  sessions: readonly WorkoutHistorySession[],
): LastWorkoutSummary | null {
  const latest = sortSessionsNewestFirst(sessions)[0]
  if (!latest) return null

  return {
    id: latest.id,
    workoutName: latest.workoutName,
    completedAt: latest.completedAt,
    durationMinutes: latest.durationMinutes,
    totalVolume: latest.totalVolume,
    completionPercentage: latest.completionPercentage,
    averageRpe: latest.averageRpe,
  }
}

function buildStreakSummary(sessions: readonly WorkoutHistorySession[]): StreakSummary {
  const completedAtValues = sessions.map((session) => session.completedAt)

  return {
    currentStreak: calculateCurrentStreak(completedAtValues),
    longestStreak: calculateLongestStreak(completedAtValues),
    totalCompletedWorkouts: sessions.length,
  }
}

function buildQuickStats(
  sessions: readonly WorkoutHistorySession[],
  bodySummary: BodyMetricSummary,
): QuickStatsSummary {
  const totalVolume = sessions.reduce((sum, session) => sum + session.totalVolume, 0)
  const durationTotal = sessions.reduce((sum, session) => sum + session.durationMinutes, 0)

  return {
    totalWorkouts: sessions.length,
    totalVolume,
    averageWorkoutDurationMinutes:
      sessions.length > 0 ? Math.round(durationTotal / sessions.length) : null,
    latestBodyFatPercent: bodySummary.latestBodyFatPercent,
    latestWeightKg: bodySummary.latestWeightKg,
  }
}

export function buildDashboardOverview(
  sessions: readonly WorkoutHistorySession[],
  bodySummary: BodyMetricSummary,
  now: Date = new Date(),
): DashboardOverview {
  return {
    weeklyTraining: buildWeeklyTrainingSummary(sessions, now),
    lastWorkout: buildLastWorkoutSummary(sessions),
    streak: buildStreakSummary(sessions),
    quickStats: buildQuickStats(sessions, bodySummary),
    daysSinceBodyUpdate: calculateDaysSinceUpdate(bodySummary.lastUpdatedAt, now),
    hasWorkoutHistory: sessions.length > 0,
  }
}

export function formatQuickStatVolume(volume: number): string {
  return formatVolumeKg(volume)
}
