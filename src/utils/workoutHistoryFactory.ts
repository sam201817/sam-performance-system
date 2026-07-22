import type { WorkoutSession } from '../data/todayWorkout'
import type { WorkoutProgress } from '../types/workoutProgress'
import type {
  ExerciseHistory,
  HistoryStatistics,
  SetHistory,
  WorkoutHistorySession,
} from '../types/workoutHistory'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import {
  calculateAverageRpe,
  calculateCompletionPercentage,
  calculateCurrentStreak,
  calculateSetVolume,
} from './workoutHistoryCalculations'
import { countCompletedSets } from './workoutProgressFactory'
import { appendSession, findHistorySession } from './workoutHistoryStorage'

function buildSetHistory(set: WorkoutProgress['exerciseLogs'][number]['sets'][number]): SetHistory {
  const reps = set.actualReps.trim() || set.targetReps
  return {
    setNumber: set.setNumber,
    targetReps: set.targetReps,
    reps,
    weight: set.weight,
    rpe: set.rpe,
    completed: set.completed,
    volume: calculateSetVolume(reps, set.weight),
  }
}

function buildExerciseHistory(
  exercise: WorkoutSession['exercises'][number],
  exerciseLog: WorkoutProgress['exerciseLogs'][number],
  order: number,
): ExerciseHistory {
  const sets = exerciseLog.sets.map(buildSetHistory)
  const completedSets = countCompletedSets(exerciseLog)
  const totalSets = sets.length
  const totalVolume = sets.reduce(
    (sum, set) => sum + (set.completed && set.volume !== null ? set.volume : 0),
    0,
  )
  const rpeValues = sets
    .filter((set) => set.completed)
    .map((set) => set.rpe)

  return {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    order,
    completed: exerciseLog.completed,
    totalSets,
    completedSets,
    totalVolume,
    averageRpe: calculateAverageRpe(rpeValues),
    completionPercentage: calculateCompletionPercentage(completedSets, totalSets),
    sets,
  }
}

export function createHistorySessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `history-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function buildHistorySession(
  progress: WorkoutProgress,
  session: WorkoutSession,
  id: string = createHistorySessionId(),
): WorkoutHistorySession {
  const completedAt = progress.completedAt ?? new Date().toISOString()
  const startedMs = Date.parse(progress.startedAt)
  const completedMs = Date.parse(completedAt)
  const durationMinutes =
    Number.isFinite(startedMs) && Number.isFinite(completedMs)
      ? Math.max(1, Math.round((completedMs - startedMs) / 60000))
      : 1

  const exercises = session.exercises.map((exercise, index) => {
    const exerciseLog = progress.exerciseLogs[index]
    return buildExerciseHistory(exercise, exerciseLog, index + 1)
  })

  const completedExercises = exercises.filter((exercise) => exercise.completed).length
  const totalSets = exercises.reduce((sum, exercise) => sum + exercise.totalSets, 0)
  const completedSets = exercises.reduce((sum, exercise) => sum + exercise.completedSets, 0)
  const totalVolume = exercises.reduce((sum, exercise) => sum + exercise.totalVolume, 0)
  const averageRpe = calculateAverageRpe(
    exercises.flatMap((exercise) =>
      exercise.sets.filter((set) => set.completed).map((set) => set.rpe),
    ),
  )

  return {
    id,
    sessionId: session.id,
    workoutName: session.title,
    startedAt: progress.startedAt,
    completedAt,
    durationMinutes,
    totalExercises: session.exercises.length,
    completedExercises,
    totalSets,
    completedSets,
    totalVolume,
    averageRpe,
    completionPercentage: calculateCompletionPercentage(completedSets, totalSets),
    exercises,
    notes: null,
    version: WORKOUT_HISTORY_VERSION,
  }
}

export function buildHistoryStatistics(
  sessions: readonly WorkoutHistorySession[],
): HistoryStatistics {
  if (sessions.length === 0) {
    return {
      totalWorkouts: 0,
      totalVolume: 0,
      averageDurationMinutes: null,
      currentStreak: 0,
    }
  }

  const totalVolume = sessions.reduce((sum, session) => sum + session.totalVolume, 0)
  const durationTotal = sessions.reduce((sum, session) => sum + session.durationMinutes, 0)

  return {
    totalWorkouts: sessions.length,
    totalVolume,
    averageDurationMinutes: Math.round(durationTotal / sessions.length),
    currentStreak: calculateCurrentStreak(sessions.map((session) => session.completedAt)),
  }
}

export function ensureHistorySessionSaved(
  progress: WorkoutProgress,
  session: WorkoutSession,
  existingHistorySessionId?: string | null,
): string {
  if (existingHistorySessionId) {
    const existing = findHistorySession(existingHistorySessionId)
    if (existing) return existingHistorySessionId
  }

  const historySession = buildHistorySession(
    progress,
    session,
    existingHistorySessionId ?? createHistorySessionId(),
  )
  appendSession(historySession)
  return historySession.id
}
