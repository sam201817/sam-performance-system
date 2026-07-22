import type { SupportedLanguage } from '../i18n'
import { translate } from '../i18n'
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

export function getReadinessStatusLabel(score: number, language: SupportedLanguage): string {
  if (score >= 80) return translate(language, 'readiness.readyToTrain')
  if (score >= 60) return translate(language, 'readiness.moderateReadiness')
  return translate(language, 'readiness.takeItEasy')
}

export function buildDailyCheckInSummary(
  entry: DailyCheckInEntry,
  language: SupportedLanguage,
): DailyCheckInSummary {
  const score = calculateReadinessScore(entry)

  return {
    score,
    statusLabel: getReadinessStatusLabel(score, language),
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
