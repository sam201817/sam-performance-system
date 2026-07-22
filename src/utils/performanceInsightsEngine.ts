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
): PerformanceInsight[] {
  const insights: PerformanceInsight[] = []
  const completedAtValues = sessions.map((session) => session.completedAt)
  const currentStreak = calculateCurrentStreak(completedAtValues, now)
  const longestStreak = calculateLongestStreak(completedAtValues)

  if (sessions.length > 0) {
    if (currentStreak >= 3) {
      insights.push(createInsight({
        id: 'training-current-streak',
        title: `${currentStreak}-day training streak`,
        description: 'You have trained on consecutive days. Consistency builds results.',
        category: 'training',
        severity: 'positive',
        icon: 'streak',
        priority: PRIORITY.high + Math.min(currentStreak, 10),
      }))
    } else if (currentStreak === 0 && sessions.length >= 2) {
      insights.push(createInsight({
        id: 'training-streak-paused',
        title: 'Streak paused',
        description: 'No workout logged yesterday. Today is a good day to restart momentum.',
        category: 'consistency',
        severity: 'warning',
        icon: 'streak',
        priority: PRIORITY.high,
      }))
    }

    if (longestStreak >= 2) {
      insights.push(createInsight({
        id: 'training-longest-streak',
        title: `Longest streak: ${longestStreak} days`,
        description:
          currentStreak === longestStreak
            ? 'You are matching your best consistency run.'
            : 'Your personal best shows you can stay consistent.',
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
        title: 'Weekly volume trend',
        description: `${formatVolumeKg(volumeComparison.currentWeekVolume)} this week. ${formatWeeklyVolumeChange(volumeComparison)}.`,
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
        title: 'Weekly target reached',
        description: `You completed ${currentWeekCount} of ${WEEKLY_WORKOUT_TARGET} target workouts this week.`,
        category: 'training',
        severity: 'positive',
        icon: 'target',
        priority: PRIORITY.high,
      }))
    } else if (sessions.length > 0) {
      insights.push(createInsight({
        id: 'training-weekly-progress',
        title: 'Weekly training progress',
        description: `${currentWeekCount} of ${WEEKLY_WORKOUT_TARGET} workouts done this week. Keep building volume steadily.`,
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
): PerformanceInsight[] {
  const insights: PerformanceInsight[] = []

  const weightChange = formatBodyChange('weight', summary)
  if (summary.latestWeightKg !== null && weightChange) {
    const improving = summary.weightChangeKg !== null && summary.weightChangeKg <= 0
    insights.push(createInsight({
      id: 'body-weight-trend',
      title: 'Weight trend',
      description: `Latest ${summary.latestWeightKg} kg. ${weightChange}.`,
      category: 'body-composition',
      severity: improving ? 'positive' : summary.weightChangeKg === 0 ? 'info' : 'warning',
      icon: 'weight',
      priority: PRIORITY.medium,
    }))
  }

  const bodyFatChange = formatBodyChange('bodyFat', summary)
  if (summary.latestBodyFatPercent !== null && bodyFatChange) {
    const improving = summary.bodyFatChangePercent !== null && summary.bodyFatChangePercent <= 0
    insights.push(createInsight({
      id: 'body-fat-trend',
      title: 'Body fat trend',
      description: `Latest ${summary.latestBodyFatPercent}%. ${bodyFatChange}.`,
      category: 'body-composition',
      severity: improving ? 'positive' : summary.bodyFatChangePercent === 0 ? 'info' : 'warning',
      icon: 'body-fat',
      priority: PRIORITY.medium,
    }))
  }

  if (daysSinceUpdate !== null && daysSinceUpdate > 7) {
    insights.push(createInsight({
      id: 'body-check-in-stale',
      title: 'Body check-in overdue',
      description: `Last body update was ${daysSinceUpdate} days ago. Fresh data improves insight accuracy.`,
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
): PerformanceInsight[] {
  const insights: PerformanceInsight[] = []

  if (todayCheckIn) {
    insights.push(createInsight({
      id: 'recovery-readiness-today',
      title: `Readiness: ${todayCheckIn.score}`,
      description: `${todayCheckIn.statusLabel}. Sleep ${todayCheckIn.sleepQuality}/5, fatigue ${todayCheckIn.fatigue}/5.`,
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
        title: 'Elevated fatigue today',
        description: 'Fatigue is high. Prioritize quality reps and recovery before pushing intensity.',
        category: 'recovery',
        severity: 'critical',
        icon: 'fatigue',
        priority: PRIORITY.critical,
      }))
    }

    if (todayCheckIn.muscleSoreness >= 4) {
      insights.push(createInsight({
        id: 'recovery-high-soreness',
        title: 'High muscle soreness',
        description: 'Soreness is elevated. Consider lighter loads or mobility-focused work.',
        category: 'recovery',
        severity: 'warning',
        icon: 'soreness',
        priority: PRIORITY.high,
      }))
    }
  }

  const metricTrends: Array<{
    id: string
    label: string
    field: 'sleepQuality' | 'fatigue' | 'motivation' | 'muscleSoreness'
    icon: PerformanceInsight['icon']
    higherIsBetter: boolean
  }> = [
    { id: 'recovery-sleep-trend', label: 'Sleep quality', field: 'sleepQuality', icon: 'sleep', higherIsBetter: true },
    { id: 'recovery-fatigue-trend', label: 'Fatigue', field: 'fatigue', icon: 'fatigue', higherIsBetter: false },
    { id: 'recovery-motivation-trend', label: 'Motivation', field: 'motivation', icon: 'motivation', higherIsBetter: true },
    { id: 'recovery-soreness-trend', label: 'Muscle soreness', field: 'muscleSoreness', icon: 'soreness', higherIsBetter: false },
  ]

  for (const trendConfig of metricTrends) {
    const trend = calculateCheckInMetricTrend(entries, trendConfig.field)
    if (!trend) continue

    const narrative = describeMetricTrend(trendConfig.label, trend, trendConfig.higherIsBetter)
    insights.push(createInsight({
      id: trendConfig.id,
      title: `${trendConfig.label} trend`,
      description: `${narrative.description} Recent avg ${trend.recentAverage}/5 vs ${trend.previousAverage}/5.`,
      category: 'recovery',
      severity: narrative.severity,
      icon: trendConfig.icon,
      priority: narrative.severity === 'warning' ? PRIORITY.medium + 5 : PRIORITY.low,
    }))
  }

  const recoveryTrend = calculateRecoveryScoreTrend(entries)
  if (recoveryTrend) {
    const narrative = describeMetricTrend('Recovery score', recoveryTrend, true)
    insights.push(createInsight({
      id: 'recovery-score-trend',
      title: 'Recovery trend',
      description: `${narrative.description} Recent avg ${recoveryTrend.recentAverage} vs ${recoveryTrend.previousAverage}.`,
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
      title: 'Workout consistency',
      description: `${last28Days.length} workouts in the last 28 days across ${uniqueWeeks || 0} active weeks.`,
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
    ...buildTrainingInsights(input.sessions, now),
    ...buildBodyInsights(input.bodySummary, daysSinceBodyUpdate),
    ...buildRecoveryInsights(input.checkInEntries, input.todayCheckIn),
    ...buildConsistencyInsights(input.sessions, now),
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
