import type { Exercise, WorkoutSession } from '../data/todayWorkout'
import type { ExerciseLog, SetLog, WorkoutProgress, WorkoutSummary } from '../types/workoutProgress'

function createSetLog(exercise: Exercise, setNumber: number): SetLog {
  return {
    setNumber,
    targetReps: exercise.reps,
    actualReps: exercise.reps,
    weight: exercise.weight,
    rpe: null,
    completed: false,
  }
}

export function createExerciseLog(exercise: Exercise): ExerciseLog {
  return {
    exerciseId: exercise.id,
    completed: false,
    sets: Array.from({ length: exercise.sets }, (_, index) =>
      createSetLog(exercise, index + 1),
    ),
  }
}

export function createWorkoutProgress(session: WorkoutSession): WorkoutProgress {
  return {
    sessionId: session.id,
    currentExerciseIndex: 0,
    exerciseLogs: session.exercises.map(createExerciseLog),
    startedAt: new Date().toISOString(),
    completedAt: null,
  }
}

export function countCompletedSets(exerciseLog: ExerciseLog): number {
  return exerciseLog.sets.filter((set) => set.completed).length
}

export function isExerciseFullyComplete(exerciseLog: ExerciseLog): boolean {
  return exerciseLog.sets.length > 0 && exerciseLog.sets.every((set) => set.completed)
}

export function syncExerciseCompletion(exerciseLog: ExerciseLog): ExerciseLog {
  return {
    ...exerciseLog,
    completed: isExerciseFullyComplete(exerciseLog),
  }
}

export function updateExerciseLog(
  progress: WorkoutProgress,
  exerciseId: string,
  updater: (log: ExerciseLog) => ExerciseLog,
): WorkoutProgress {
  return {
    ...progress,
    exerciseLogs: progress.exerciseLogs.map((log) =>
      log.exerciseId === exerciseId ? syncExerciseCompletion(updater(log)) : log,
    ),
  }
}

export function clampExerciseIndex(index: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(Math.max(0, index), total - 1)
}

export function buildWorkoutSummary(
  progress: WorkoutProgress,
  session: WorkoutSession,
): WorkoutSummary {
  const completedExercises = progress.exerciseLogs.filter((log) => log.completed).length
  const totalCompletedSets = progress.exerciseLogs.reduce(
    (total, log) => total + countCompletedSets(log),
    0,
  )

  const startedMs = Date.parse(progress.startedAt)
  const completedMs = progress.completedAt ? Date.parse(progress.completedAt) : Date.now()
  const durationMinutes =
    Number.isFinite(startedMs) && Number.isFinite(completedMs)
      ? Math.max(1, Math.round((completedMs - startedMs) / 60000))
      : null

  return {
    totalExercises: session.exercises.length,
    completedExercises,
    totalCompletedSets,
    durationMinutes,
  }
}

export function hasIncompleteSets(exerciseLog: ExerciseLog): boolean {
  return exerciseLog.sets.some((set) => !set.completed)
}
