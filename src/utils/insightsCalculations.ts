import type { BodyMetricSummary } from '../types/bodyMetrics'
import type { CheckInMetricField, DailyCheckInEntry } from '../types/dailyCheckIn'
import type { WorkoutHistorySession } from '../types/workoutHistory'
import { calculateAverage, getTrendDirection } from './bodyMetricCalculations'
import { calculateReadinessScore } from './dailyCheckInCalculations'
import { formatVolumeKg } from './workoutHistoryCalculations'

export type TrendComparison = {
  recentAverage: number
  previousAverage: number
  change: number
  direction: 'up' | 'down' | 'flat' | 'unknown'
}

export type WeeklyVolumeComparison = {
  currentWeekVolume: number
  previousWeekVolume: number
  change: number
  direction: 'up' | 'down' | 'flat' | 'unknown'
}

function getWeekStart(date: Date): Date {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const day = local.getDay()
  const mondayOffset = day === 0 ? 6 : day - 1
  local.setDate(local.getDate() - mondayOffset)
  return local
}

export function isInWeekOffset(
  completedAt: string,
  weekOffset: number,
  now: Date = new Date(),
): boolean {
  const completed = new Date(completedAt)
  if (!Number.isFinite(completed.getTime())) return false

  const weekStart = getWeekStart(now)
  weekStart.setDate(weekStart.getDate() - weekOffset * 7)
  const weekEnd = weekStart.getTime() + 7 * 86_400_000
  const completedDay = new Date(
    completed.getFullYear(),
    completed.getMonth(),
    completed.getDate(),
  ).getTime()

  return completedDay >= weekStart.getTime() && completedDay < weekEnd
}

export function calculateWeeklyVolumeComparison(
  sessions: readonly WorkoutHistorySession[],
  now: Date = new Date(),
): WeeklyVolumeComparison {
  const currentWeekVolume = sessions
    .filter((session) => isInWeekOffset(session.completedAt, 0, now))
    .reduce((sum, session) => sum + session.totalVolume, 0)

  const previousWeekVolume = sessions
    .filter((session) => isInWeekOffset(session.completedAt, 1, now))
    .reduce((sum, session) => sum + session.totalVolume, 0)

  const change = currentWeekVolume - previousWeekVolume

  return {
    currentWeekVolume,
    previousWeekVolume,
    change,
    direction: getTrendDirection(change),
  }
}

function sortCheckInsOldestFirst(
  entries: readonly DailyCheckInEntry[],
): DailyCheckInEntry[] {
  return [...entries].sort(
    (left, right) => Date.parse(left.recordedAt) - Date.parse(right.recordedAt),
  )
}

function splitRecentAndPrevious<T>(
  items: readonly T[],
  recentSize: number,
  previousSize: number,
): { recent: T[]; previous: T[] } {
  if (items.length === 0) {
    return { recent: [], previous: [] }
  }

  const recent = items.slice(-recentSize)
  const priorEnd = items.length - recent.length
  const previous = items.slice(Math.max(0, priorEnd - previousSize), priorEnd)

  return { recent, previous }
}

export function calculateCheckInMetricTrend(
  entries: readonly DailyCheckInEntry[],
  field: CheckInMetricField,
  recentSize = 3,
  previousSize = 3,
): TrendComparison | null {
  const sorted = sortCheckInsOldestFirst(entries)
  const values = sorted.map((entry) => entry[field])
  const { recent, previous } = splitRecentAndPrevious(values, recentSize, previousSize)

  const recentAverage = calculateAverage(recent)
  const previousAverage = calculateAverage(previous)

  if (recentAverage === null || previousAverage === null) {
    return null
  }

  const change = Math.round((recentAverage - previousAverage) * 10) / 10

  return {
    recentAverage,
    previousAverage,
    change,
    direction: getTrendDirection(change),
  }
}

export function calculateRecoveryScoreTrend(
  entries: readonly DailyCheckInEntry[],
  recentSize = 3,
  previousSize = 3,
): TrendComparison | null {
  const sorted = sortCheckInsOldestFirst(entries)
  const scores = sorted.map((entry) => calculateReadinessScore(entry))
  const { recent, previous } = splitRecentAndPrevious(scores, recentSize, previousSize)

  const recentAverage = calculateAverage(recent)
  const previousAverage = calculateAverage(previous)

  if (recentAverage === null || previousAverage === null) {
    return null
  }

  const change = Math.round(recentAverage - previousAverage)

  return {
    recentAverage,
    previousAverage,
    change,
    direction: getTrendDirection(change),
  }
}

export function formatWeeklyVolumeChange(comparison: WeeklyVolumeComparison): string {
  if (comparison.direction === 'unknown') return 'No prior week data'
  if (comparison.direction === 'flat') return 'Same as last week'

  const prefix = comparison.change > 0 ? '+' : ''
  return `${prefix}${formatVolumeKg(Math.abs(comparison.change))} vs last week`
}

export function describeMetricTrend(
  label: string,
  trend: TrendComparison,
  higherIsBetter: boolean,
): { severity: 'positive' | 'warning' | 'info'; description: string } {
  if (trend.direction === 'flat' || trend.direction === 'unknown') {
    return {
      severity: 'info',
      description: `${label} has held steady recently.`,
    }
  }

  const improved =
    trend.direction === 'up' ? higherIsBetter : !higherIsBetter

  return {
    severity: improved ? 'positive' : 'warning',
    description: improved
      ? `${label} is trending in a good direction.`
      : `${label} is trending in the wrong direction — adjust recovery or load.`,
  }
}

export function hasMeaningfulBodyTrend(summary: BodyMetricSummary): boolean {
  return summary.latestWeightKg !== null || summary.latestBodyFatPercent !== null
}

export function formatBodyChange(
  metric: 'weight' | 'bodyFat',
  summary: BodyMetricSummary,
): string | null {
  if (metric === 'weight') {
    if (summary.weightChangeKg === null) return null
    const prefix = summary.weightChangeKg > 0 ? '+' : ''
    return `${prefix}${summary.weightChangeKg} kg since last reading`
  }

  if (summary.bodyFatChangePercent === null) return null
  const prefix = summary.bodyFatChangePercent > 0 ? '+' : ''
  return `${prefix}${summary.bodyFatChangePercent}% since last reading`
}
