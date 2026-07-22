export type WeeklyTrainingSummary = {
  completedWorkouts: number
  targetWorkouts: number
  completionPercent: number
  totalVolume: number
  averageDurationMinutes: number | null
}

export type LastWorkoutSummary = {
  id: string
  workoutName: string
  completedAt: string
  durationMinutes: number
  totalVolume: number
  completionPercentage: number
  averageRpe: number | null
}

export type StreakSummary = {
  currentStreak: number
  longestStreak: number
  totalCompletedWorkouts: number
}

export type QuickStatsSummary = {
  totalWorkouts: number
  totalVolume: number
  averageWorkoutDurationMinutes: number | null
  latestBodyFatPercent: number | null
  latestWeightKg: number | null
}

export type DashboardOverview = {
  weeklyTraining: WeeklyTrainingSummary
  lastWorkout: LastWorkoutSummary | null
  streak: StreakSummary
  quickStats: QuickStatsSummary
  daysSinceBodyUpdate: number | null
  hasWorkoutHistory: boolean
}
