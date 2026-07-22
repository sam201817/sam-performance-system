import type { NavigationHandler, NavTabHandler, NavTabId } from './app'
import type { BodyMetricEntry, BodyMetricHistory, BodyMetricSummary } from './bodyMetrics'
import type { DailyCheckInSummary } from './dailyCheckIn'
import type { PerformanceInsight } from './insights'
import type { DashboardOverview } from './dashboard'
import type { WorkoutProgress, WorkoutStatus, WorkoutSummary } from './workoutProgress'
import type { HistoryStatistics, WorkoutHistorySession } from './workoutHistory'
import type { WorkoutSession } from '../data/todayWorkout'

export type { DailyCheckInProps } from './dailyCheckIn'

export type DashboardProps = {
  session: WorkoutSession
  workoutStatus: WorkoutStatus
  onStartWorkout: () => void
  onOpenProfile: () => void
  activeTab: NavTabId
  onNavigate: NavTabHandler
  overview: DashboardOverview
  bodySummary: BodyMetricSummary
  hasBodyEntries: boolean
  onOpenBodyComposition: () => void
  onOpenHistorySession: (sessionId: string) => void
  checkInSummary: DailyCheckInSummary
  onEditCheckIn: () => void
  insights: PerformanceInsight[]
}

export type WorkoutProps = {
  session: WorkoutSession
  progress: WorkoutProgress
  onProgressChange: (progress: WorkoutProgress) => void
  onBack: () => void
  onFinish: (progress: WorkoutProgress) => void
}

export type WorkoutCompleteProps = {
  summary: WorkoutSummary
  onReturnHome: NavigationHandler
}

export type HistoryProps = {
  sessions: WorkoutHistorySession[]
  statistics: HistoryStatistics
  activeTab: NavTabId
  onNavigate: NavTabHandler
  onOpenSession: (sessionId: string) => void
}

export type WorkoutHistoryDetailProps = {
  session: WorkoutHistorySession
  onBack: NavigationHandler
}

export type BodyCompositionProps = {
  history: BodyMetricHistory
  activeTab: NavTabId
  onNavigate: NavTabHandler
  onSaveEntry: (
    values: Omit<BodyMetricEntry, 'id' | 'version'>,
    entryId: string | null,
  ) => void
  onDeleteEntry: (entryId: string) => void
}

export type BodyCompositionCardProps = {
  summary: BodyMetricSummary
  hasEntries: boolean
  onOpenBodyComposition: () => void
}

export type TabbedScreenProps = {
  activeTab: NavTabId
  onNavigate: NavTabHandler
}
