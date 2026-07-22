export type SetLog = {
  setNumber: number
  targetReps: string
  actualReps: string
  weight: string
  rpe: number | null
  completed: boolean
}

export type ExerciseLog = {
  exerciseId: string
  sets: SetLog[]
  completed: boolean
}

export type WorkoutProgress = {
  sessionId: string
  currentExerciseIndex: number
  exerciseLogs: ExerciseLog[]
  startedAt: string
  completedAt: string | null
}

export type WorkoutStatus = 'idle' | 'active'

export type WorkoutSummary = {
  totalExercises: number
  completedExercises: number
  totalCompletedSets: number
  durationMinutes: number | null
  historySessionId?: string | null
}

export type AdvanceAction = 'next' | 'finish'
