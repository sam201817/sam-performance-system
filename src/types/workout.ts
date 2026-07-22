import type { NavigationHandler, NavTabHandler, NavTabId } from './app'
import type { Exercise, WorkoutSession } from '../data/todayWorkout'
import type { WorkoutProgress, WorkoutStatus, WorkoutSummary } from './workoutProgress'
import type { HistoryStatistics, WorkoutHistorySession } from './workoutHistory'

export type { Exercise, WorkoutSession }
export type { WorkoutProgress, WorkoutStatus, WorkoutSummary }
export type { HistoryStatistics, WorkoutHistorySession }

export type DashboardProps = {
  session: WorkoutSession
  workoutStatus: WorkoutStatus
  onStartWorkout: () => void
  activeTab: NavTabId
  onNavigate: NavTabHandler
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

export type WorkoutCardProps = {
  session: WorkoutSession
  workoutStatus: WorkoutStatus
  onStartWorkout: () => void
}

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
