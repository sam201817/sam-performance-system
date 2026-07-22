import type {
  CheckInMetricField,
  DailyCheckInEntry,
  DailyCheckInSummary,
} from '../types/dailyCheckIn'
import { CHECK_IN_SCALE_MAX } from '../types/dailyCheckIn'

function normalizeMetric(field: CheckInMetricField, value: number): number {
  const ratio = value / CHECK_IN_SCALE_MAX

  if (field === 'fatigue' || field === 'muscleSoreness') {
    return 1 - ratio
  }

  return ratio
}

export function calculateReadinessScore(entry: DailyCheckInEntry): number {
  const values = [
    normalizeMetric('fatigue', entry.fatigue),
    normalizeMetric('sleepQuality', entry.sleepQuality),
    normalizeMetric('motivation', entry.motivation),
    normalizeMetric('muscleSoreness', entry.muscleSoreness),
  ]

  const average = values.reduce((sum, value) => sum + value, 0) / values.length
  return Math.round(average * 100)
}

export function getReadinessStatusLabel(score: number): string {
  if (score >= 80) return 'Ready to train'
  if (score >= 60) return 'Moderate readiness'
  return 'Take it easy'
}

export function buildDailyCheckInSummary(entry: DailyCheckInEntry): DailyCheckInSummary {
  const score = calculateReadinessScore(entry)

  return {
    score,
    statusLabel: getReadinessStatusLabel(score),
    fatigue: entry.fatigue,
    sleepQuality: entry.sleepQuality,
    motivation: entry.motivation,
    muscleSoreness: entry.muscleSoreness,
    hasNote: entry.notes !== null && entry.notes.length > 0,
  }
}

export function getMetricDisplayClass(field: CheckInMetricField, value: number): string {
  const normalized = normalizeMetric(field, value)

  if (normalized >= 0.75) return 'readiness-card__metric-value--good'
  if (normalized >= 0.45) return 'readiness-card__metric-value--neutral'
  return 'readiness-card__metric-value--poor'
}
