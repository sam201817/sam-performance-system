import type { BodyMetricSummary } from './bodyMetrics'
import type { DailyCheckInEntry, DailyCheckInSummary } from './dailyCheckIn'
import type { WorkoutHistorySession } from './workoutHistory'

export type InsightCategory =
  | 'training'
  | 'recovery'
  | 'body-composition'
  | 'consistency'

export type InsightSeverity = 'info' | 'positive' | 'warning' | 'critical'

export type InsightIcon =
  | 'streak'
  | 'volume'
  | 'weight'
  | 'body-fat'
  | 'sleep'
  | 'fatigue'
  | 'motivation'
  | 'soreness'
  | 'recovery'
  | 'consistency'
  | 'target'

export type PerformanceInsight = {
  id: string
  title: string
  description: string
  category: InsightCategory
  severity: InsightSeverity
  icon?: InsightIcon
  priority: number
}

export type PerformanceInsightsSnapshot = {
  insights: PerformanceInsight[]
  topInsights: PerformanceInsight[]
  generatedAt: string
  context: PerformanceInsightsContext
}

/** Metadata for future AI Coach integration. */
export type PerformanceInsightsContext = {
  workoutCount: number
  checkInCount: number
  hasBodyMetrics: boolean
  categoryCounts: Record<InsightCategory, number>
}

export type PerformanceInsightsInput = {
  sessions: readonly WorkoutHistorySession[]
  bodySummary: BodyMetricSummary
  checkInEntries: readonly DailyCheckInEntry[]
  todayCheckIn: DailyCheckInSummary | null
  language?: import('../i18n').SupportedLanguage
  now?: Date
}

export const INSIGHTS_TOP_MIN = 3
export const INSIGHTS_TOP_MAX = 5
