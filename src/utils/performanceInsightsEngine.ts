import type { BodyMetricSummary } from '../types/bodyMetrics'
import type { DailyCheckInEntry, DailyCheckInSummary } from '../types/dailyCheckIn'
import type {
  InsightCategory,
  PerformanceInsight,
  PerformanceInsightsInput,
  PerformanceInsightsSnapshot,
} from '../types/insights'
import {
  INSIGHTS_TOP_MAX,
  INSIGHTS_TOP_MIN,
} from '../types/insights'
import type { WorkoutHistorySession } from '../types/workoutHistory'
import { DEFAULT_LANGUAGE, translate, type SupportedLanguage } from '../i18n'
import {
  calculateLongestStreak,
  WEEKLY_WORKOUT_TARGET,
} from './dashboardCalculations'
import { calculateCurrentStreak, formatVolumeKg } from './workoutHistoryCalculations'
import { isInWeekOffset } from './insightsCalculations'
import {
  calculateCheckInMetricTrend,
  calculateRecoveryScoreTrend,
  calculateWeeklyVolumeComparison,
  describeMetricTrend,
  formatBodyChange,
  formatWeeklyVolumeChange,
} from './insightsCalculations'

const PRIORITY = {
  critical: 95,
  high: 80,
  medium: 65,
  low: 45,
  info: 30,
} as const

function createInsight(
  insight: Omit<PerformanceInsight, 'priority'> & { priority?: number },
): PerformanceInsight {
  return {
    ...insight,
    priority: insight.priority ?? PRIORITY.info,
  }
}

function buildTrainingInsights(
  sessions: readonly WorkoutHistorySession[],
  now: Date,
  language: SupportedLanguage,
): PerformanceInsight[] {
  const insights: PerformanceInsight[] = []
  const completedAtValues = sessions.map((session) => session.completedAt)
  const currentStreak = calculateCurrentStreak(completedAtValues, now)
  const longestStreak = calculateLongestStreak(completedAtValues)

  if (sessions.length > 0) {
    if (currentStreak >= 3) {
      insights.push(createInsight({
        id: 'training-current-streak',
        title: translate(language, 'insights.trainingStreakTitle', { days: currentStreak }),
        description: translate(language, 'insights.trainingStreakDescription'),
        category: 'training',
        severity: 'positive',
        icon: 'streak',
        priority: PRIORITY.high + Math.min(currentStreak, 10),
      }))
    } else if (currentStreak === 0 && sessions.length >= 2) {
      insights.push(createInsight({
        id: 'training-streak-paused',
        title: translate(language, 'insights.streakPausedTitle'),
        description: translate(language, 'insights.streakPausedDescription'),
        category: 'consistency',
        severity: 'warning',
        icon: 'streak',
        priority: PRIORITY.high,
      }))
    }

    if (longestStreak >= 2) {
      insights.push(createInsight({
        id: 'training-longest-streak',
        title: translate(language, 'insights.longestStreakTitle', { days: longestStreak }),
        description:
          currentStreak === longestStreak
            ? translate(language, 'insights.longestStreakMatching')
            : translate(language, 'insights.longestStreakBest'),
        category: 'consistency',
        severity: currentStreak === longestStreak ? 'positive' : 'info',
        icon: 'consistency',
        priority: PRIORITY.medium,
      }))
    }

    const volumeComparison = calculateWeeklyVolumeComparison(sessions, now)
    if (volumeComparison.previousWeekVolume > 0 || volumeComparison.currentWeekVolume > 0) {
      insights.push(createInsight({
        id: 'training-weekly-volume',
        title: translate(language, 'insights.weeklyVolumeTitle'),
        description: translate(language, 'insights.weeklyVolumeDescription', {
          current: formatVolumeKg(volumeComparison.currentWeekVolume),
          change: formatWeeklyVolumeChange(volumeComparison, language),
        }),
        category: 'training',
        severity:
          volumeComparison.direction === 'up'
            ? 'positive'
            : volumeComparison.direction === 'down'
              ? 'warning'
              : 'info',
        icon: 'volume',
        priority: PRIORITY.medium + (volumeComparison.direction === 'down' ? 5 : 0),
      }))
    }

    const currentWeekCount = sessions.filter((session) =>
      isInWeekOffset(session.completedAt, 0, now),
    ).length

    if (currentWeekCount >= WEEKLY_WORKOUT_TARGET) {
      insights.push(createInsight({
        id: 'training-weekly-target',
        title: translate(language, 'insights.weeklyTargetTitle'),
        description: translate(language, 'insights.weeklyTargetDescription', {
          count: currentWeekCount,
          target: WEEKLY_WORKOUT_TARGET,
        }),
        category: 'training',
        severity: 'positive',
        icon: 'target',
        priority: PRIORITY.high,
      }))
    } else if (sessions.length > 0) {
      insights.push(createInsight({
        id: 'training-weekly-progress',
        title: translate(language, 'insights.weeklyProgressTitle'),
        description: translate(language, 'insights.weeklyProgressDescription', {
          count: currentWeekCount,
          target: WEEKLY_WORKOUT_TARGET,
        }),
        category: 'training',
        severity: currentWeekCount === 0 ? 'warning' : 'info',
        icon: 'target',
        priority: currentWeekCount === 0 ? PRIORITY.high : PRIORITY.low,
      }))
    }
  }

  return insights
}

function buildBodyInsights(
  summary: BodyMetricSummary,
  daysSinceUpdate: number | null,
  language: SupportedLanguage,
): PerformanceInsight[] {
  const insights: PerformanceInsight[] = []

  const weightChange = formatBodyChange('weight', summary, language)
  if (summary.latestWeightKg !== null && weightChange) {
    const improving = summary.weightChangeKg !== null && summary.weightChangeKg <= 0
    insights.push(createInsight({
      id: 'body-weight-trend',
      title: translate(language, 'insights.weightTrendTitle'),
      description: translate(language, 'insights.weightTrendDescription', {
        value: summary.latestWeightKg,
        change: weightChange,
      }),
      category: 'body-composition',
      severity: improving ? 'positive' : summary.weightChangeKg === 0 ? 'info' : 'warning',
      icon: 'weight',
      priority: PRIORITY.medium,
    }))
  }

  const bodyFatChange = formatBodyChange('bodyFat', summary, language)
  if (summary.latestBodyFatPercent !== null && bodyFatChange) {
    const improving = summary.bodyFatChangePercent !== null && summary.bodyFatChangePercent <= 0
    insights.push(createInsight({
      id: 'body-fat-trend',
      title: translate(language, 'insights.bodyFatTrendTitle'),
      description: translate(language, 'insights.bodyFatTrendDescription', {
        value: summary.latestBodyFatPercent,
        change: bodyFatChange,
      }),
      category: 'body-composition',
      severity: improving ? 'positive' : summary.bodyFatChangePercent === 0 ? 'info' : 'warning',
      icon: 'body-fat',
      priority: PRIORITY.medium,
    }))
  }

  if (daysSinceUpdate !== null && daysSinceUpdate > 7) {
    insights.push(createInsight({
      id: 'body-check-in-stale',
      title: translate(language, 'insights.bodyStaleTitle'),
      description: translate(language, 'insights.bodyStaleDescription', {
        days: daysSinceUpdate,
      }),
      category: 'body-composition',
      severity: 'warning',
      icon: 'weight',
      priority: PRIORITY.high,
    }))
  }

  return insights
}

function buildRecoveryInsights(
  entries: readonly DailyCheckInEntry[],
  todayCheckIn: DailyCheckInSummary | null,
  language: SupportedLanguage,
): PerformanceInsight[] {
  const insights: PerformanceInsight[] = []

  if (todayCheckIn) {
    insights.push(createInsight({
      id: 'recovery-readiness-today',
      title: translate(language, 'insights.readinessTitle', { score: todayCheckIn.score }),
      description: translate(language, 'insights.readinessDescription', {
        status: todayCheckIn.statusLabel,
        sleep: todayCheckIn.sleepQuality,
        fatigue: todayCheckIn.fatigue,
      }),
      category: 'recovery',
      severity:
        todayCheckIn.score >= 80
          ? 'positive'
          : todayCheckIn.score >= 60
            ? 'info'
            : 'warning',
      icon: 'recovery',
      priority: PRIORITY.high + (todayCheckIn.score < 60 ? 10 : 0),
    }))

    if (todayCheckIn.fatigue >= 4) {
      insights.push(createInsight({
        id: 'recovery-high-fatigue',
        title: translate(language, 'insights.highFatigueTitle'),
        description: translate(language, 'insights.highFatigueDescription'),
        category: 'recovery',
        severity: 'critical',
        icon: 'fatigue',
        priority: PRIORITY.critical,
      }))
    }

    if (todayCheckIn.muscleSoreness >= 4) {
      insights.push(createInsight({
        id: 'recovery-high-soreness',
        title: translate(language, 'insights.highSorenessTitle'),
        description: translate(language, 'insights.highSorenessDescription'),
        category: 'recovery',
        severity: 'warning',
        icon: 'soreness',
        priority: PRIORITY.high,
      }))
    }
  }

  const metricTrends: Array<{
    id: string
    labelKey: string
    field: 'sleepQuality' | 'fatigue' | 'motivation' | 'muscleSoreness'
    icon: PerformanceInsight['icon']
    higherIsBetter: boolean
  }> = [
    { id: 'recovery-sleep-trend', labelKey: 'insights.sleepQuality', field: 'sleepQuality', icon: 'sleep', higherIsBetter: true },
    { id: 'recovery-fatigue-trend', labelKey: 'insights.fatigue', field: 'fatigue', icon: 'fatigue', higherIsBetter: false },
    { id: 'recovery-motivation-trend', labelKey: 'insights.motivation', field: 'motivation', icon: 'motivation', higherIsBetter: true },
    { id: 'recovery-soreness-trend', labelKey: 'insights.muscleSoreness', field: 'muscleSoreness', icon: 'soreness', higherIsBetter: false },
  ]

  for (const trendConfig of metricTrends) {
    const trend = calculateCheckInMetricTrend(entries, trendConfig.field)
    if (!trend) continue

    const label = translate(language, trendConfig.labelKey)
    const narrative = describeMetricTrend(label, trend, trendConfig.higherIsBetter, language)
    insights.push(createInsight({
      id: trendConfig.id,
      title: translate(language, 'insights.metricTrendTitle', { label }),
      description: translate(language, 'insights.metricTrendDescription', {
        narrative: narrative.description,
        recent: trend.recentAverage,
        previous: trend.previousAverage,
      }),
      category: 'recovery',
      severity: narrative.severity,
      icon: trendConfig.icon,
      priority: narrative.severity === 'warning' ? PRIORITY.medium + 5 : PRIORITY.low,
    }))
  }

  const recoveryTrend = calculateRecoveryScoreTrend(entries)
  if (recoveryTrend) {
    const recoveryLabel = translate(language, 'insights.recoveryScore')
    const narrative = describeMetricTrend(recoveryLabel, recoveryTrend, true, language)
    insights.push(createInsight({
      id: 'recovery-score-trend',
      title: translate(language, 'insights.recoveryTrendTitle'),
      description: translate(language, 'insights.recoveryTrendDescription', {
        narrative: narrative.description,
        recent: recoveryTrend.recentAverage,
        previous: recoveryTrend.previousAverage,
      }),
      category: 'recovery',
      severity: narrative.severity,
      icon: 'recovery',
      priority: PRIORITY.medium,
    }))
  }

  return insights
}

function buildConsistencyInsights(
  sessions: readonly WorkoutHistorySession[],
  now: Date,
  language: SupportedLanguage,
): PerformanceInsight[] {
  if (sessions.length === 0) return []

  const last28Days = sessions.filter((session) => {
    const completed = new Date(session.completedAt)
    if (!Number.isFinite(completed.getTime())) return false
    const cutoff = new Date(now)
    cutoff.setDate(cutoff.getDate() - 28)
    return completed >= cutoff
  })

  const uniqueWeeks = new Set(
    last28Days.map((session) => {
      for (let offset = 0; offset <= 4; offset += 1) {
        if (isInWeekOffset(session.completedAt, offset, now)) return offset
      }
      return -1
    }).filter((value) => value >= 0),
  ).size

  return [
    createInsight({
      id: 'consistency-workout-rate',
      title: translate(language, 'insights.consistencyTitle'),
      description: translate(language, 'insights.consistencyDescription', {
        workouts: last28Days.length,
        weeks: uniqueWeeks || 0,
      }),
      category: 'consistency',
      severity: last28Days.length >= WEEKLY_WORKOUT_TARGET * 3 ? 'positive' : 'info',
      icon: 'consistency',
      priority: PRIORITY.low,
    }),
  ]
}

export function rankInsights(insights: readonly PerformanceInsight[]): PerformanceInsight[] {
  return [...insights].sort((left, right) => {
    if (right.priority !== left.priority) {
      return right.priority - left.priority
    }
    return left.title.localeCompare(right.title)
  })
}

export function selectTopInsights(
  insights: readonly PerformanceInsight[],
  min = INSIGHTS_TOP_MIN,
  max = INSIGHTS_TOP_MAX,
): PerformanceInsight[] {
  const ranked = rankInsights(insights)
  const targetCount = Math.min(max, Math.max(min, ranked.length))
  return ranked.slice(0, targetCount)
}

function buildCategoryCounts(
  insights: readonly PerformanceInsight[],
): Record<InsightCategory, number> {
  return insights.reduce(
    (counts, insight) => {
      counts[insight.category] += 1
      return counts
    },
    {
      training: 0,
      recovery: 0,
      'body-composition': 0,
      consistency: 0,
    } satisfies Record<InsightCategory, number>,
  )
}

export function buildPerformanceInsights(
  input: PerformanceInsightsInput,
): PerformanceInsightsSnapshot {
  const now = input.now ?? new Date()
  const language = input.language ?? DEFAULT_LANGUAGE
  const daysSinceBodyUpdate =
    input.bodySummary.lastUpdatedAt === null
      ? null
      : Math.max(
          0,
          Math.round(
            (now.getTime() - new Date(input.bodySummary.lastUpdatedAt).getTime()) /
              86_400_000,
          ),
        )

  const insights = [
    ...buildTrainingInsights(input.sessions, now, language),
    ...buildBodyInsights(input.bodySummary, daysSinceBodyUpdate, language),
    ...buildRecoveryInsights(input.checkInEntries, input.todayCheckIn, language),
    ...buildConsistencyInsights(input.sessions, now, language),
  ]

  const topInsights = selectTopInsights(insights)

  return {
    insights,
    topInsights,
    generatedAt: now.toISOString(),
    context: {
      workoutCount: input.sessions.length,
      checkInCount: input.checkInEntries.length,
      hasBodyMetrics: input.bodySummary.latestWeightKg !== null || input.bodySummary.latestBodyFatPercent !== null,
      categoryCounts: buildCategoryCounts(insights),
    },
  }
}

/** Stable export for future AI Coach consumers. */
export function getPerformanceInsightsForCoach(
  input: PerformanceInsightsInput,
): PerformanceInsightsSnapshot {
  return buildPerformanceInsights(input)
}
