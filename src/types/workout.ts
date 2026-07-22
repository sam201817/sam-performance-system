import type { Exercise, WorkoutSession } from '../data/todayWorkout'
import type { BodyMetricEntry, BodyMetricHistory, BodyMetricSummary } from './bodyMetrics'
import type { DailyCheckInSummary } from './dailyCheckIn'
import type { PerformanceInsight } from './insights'
import type { DashboardOverview } from './dashboard'
import type { WorkoutProgress, WorkoutStatus, WorkoutSummary } from './workoutProgress'
import type { HistoryStatistics, WorkoutHistorySession } from './workoutHistory'
import type { NavTabHandler, NavTabId } from './app'

export type { Exercise, WorkoutSession }
export type { WorkoutProgress, WorkoutStatus, WorkoutSummary }
export type { HistoryStatistics, WorkoutHistorySession }
export type { BodyMetricEntry, BodyMetricHistory, BodyMetricSummary }
export type { DailyCheckInSummary }
export type { PerformanceInsight }
export type { DashboardOverview }

export type {
  BodyCompositionCardProps,
  BodyCompositionProps,
  DashboardProps,
  DailyCheckInProps,
  HistoryProps,
  TabbedScreenProps,
  WorkoutCompleteProps,
  WorkoutHistoryDetailProps,
  WorkoutProps,
} from './screens'

export type BottomNavProps = {
  activeTab: NavTabId
  onNavigate: NavTabHandler
}

export type WorkoutControlsProps = {
  currentIndex: number
  total: number
  onPrevious: () => void
  onNext: () => void
  onFinish: () => void
}

export type ExerciseProgressProps = {
  current: number
  total: number
}

export type ExerciseDetailProps = {
  exercise: Exercise
}
