export const WORKOUT_HISTORY_VERSION = 1

export type SetHistory = {
  setNumber: number
  targetReps: string
  reps: string
  weight: string
  rpe: number | null
  completed: boolean
  volume: number | null
}

export type ExerciseHistory = {
  exerciseId: string
  exerciseName: string
  order: number
  completed: boolean
  totalSets: number
  completedSets: number
  totalVolume: number
  averageRpe: number | null
  completionPercentage: number
  sets: SetHistory[]
}

export type WorkoutHistorySession = {
  id: string
  sessionId: string
  workoutName: string
  startedAt: string
  completedAt: string
  durationMinutes: number
  totalExercises: number
  completedExercises: number
  totalSets: number
  completedSets: number
  totalVolume: number
  averageRpe: number | null
  completionPercentage: number
  exercises: ExerciseHistory[]
  notes: string | null
  version: number
}

export type WorkoutHistory = {
  version: number
  sessions: WorkoutHistorySession[]
}

export type HistoryStatistics = {
  totalWorkouts: number
  totalVolume: number
  averageDurationMinutes: number | null
  currentStreak: number
}
