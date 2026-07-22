import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import type { WorkoutSession } from '../data/todayWorkout'
import type { WorkoutProgress, WorkoutSummary } from '../types/workoutProgress'
import { isRecord } from './guards/isRecord'
import { readJsonStorage, removeJsonStorage, writeJsonStorage } from './storage/jsonStorage'
import { clampExerciseIndex } from './workoutProgressFactory'

const PROGRESS_KEY = SPS_STORAGE_KEYS.workoutProgress
const SUMMARY_KEY = SPS_STORAGE_KEYS.workoutSummary

function isSetLog(value: unknown): value is WorkoutProgress['exerciseLogs'][number]['sets'][number] {
  if (!isRecord(value)) return false
  return (
    typeof value.setNumber === 'number' &&
    typeof value.targetReps === 'string' &&
    typeof value.actualReps === 'string' &&
    typeof value.weight === 'string' &&
    (value.rpe === null || (typeof value.rpe === 'number' && value.rpe >= 1 && value.rpe <= 10)) &&
    typeof value.completed === 'boolean'
  )
}

function isExerciseLog(value: unknown): value is WorkoutProgress['exerciseLogs'][number] {
  if (!isRecord(value)) return false
  return (
    typeof value.exerciseId === 'string' &&
    Array.isArray(value.sets) &&
    value.sets.every(isSetLog) &&
    typeof value.completed === 'boolean'
  )
}

export function isWorkoutProgress(value: unknown): value is WorkoutProgress {
  if (!isRecord(value)) return false
  return (
    typeof value.sessionId === 'string' &&
    typeof value.currentExerciseIndex === 'number' &&
    Array.isArray(value.exerciseLogs) &&
    value.exerciseLogs.every(isExerciseLog) &&
    typeof value.startedAt === 'string' &&
    (value.completedAt === null || typeof value.completedAt === 'string')
  )
}

export function isWorkoutSummary(value: unknown): value is WorkoutSummary {
  if (!isRecord(value)) return false
  return (
    typeof value.totalExercises === 'number' &&
    typeof value.completedExercises === 'number' &&
    typeof value.totalCompletedSets === 'number' &&
    (value.durationMinutes === null || typeof value.durationMinutes === 'number') &&
    (value.historySessionId === undefined ||
      value.historySessionId === null ||
      typeof value.historySessionId === 'string')
  )
}

function sanitizeProgress(raw: WorkoutProgress, session: WorkoutSession): WorkoutProgress | null {
  if (raw.sessionId !== session.id) return null
  if (raw.completedAt !== null) return null
  if (raw.exerciseLogs.length !== session.exercises.length) return null

  const exerciseLogs = raw.exerciseLogs.map((log, index) => {
    const exercise = session.exercises[index]
    if (!exercise || log.exerciseId !== exercise.id) return null
    if (log.sets.length !== exercise.sets) return null
    return log
  })

  if (exerciseLogs.some((log) => log === null)) return null

  return {
    ...raw,
    currentExerciseIndex: clampExerciseIndex(raw.currentExerciseIndex, session.exercises.length),
    exerciseLogs: exerciseLogs as WorkoutProgress['exerciseLogs'],
  }
}

export function loadRawWorkoutProgress(): WorkoutProgress | null {
  return readJsonStorage(PROGRESS_KEY, isWorkoutProgress, null as WorkoutProgress | null)
}

export function loadWorkoutProgress(session: WorkoutSession): WorkoutProgress | null {
  const parsed = loadRawWorkoutProgress()
  if (!parsed) return null
  return sanitizeProgress(parsed, session)
}

export function saveWorkoutProgress(progress: WorkoutProgress): boolean {
  return writeJsonStorage(PROGRESS_KEY, progress)
}

export function clearWorkoutProgress(): void {
  removeJsonStorage(PROGRESS_KEY)
}

export function loadWorkoutSummary(): WorkoutSummary | null {
  return readJsonStorage(SUMMARY_KEY, isWorkoutSummary, null as WorkoutSummary | null)
}

export function saveWorkoutSummary(summary: WorkoutSummary): boolean {
  return writeJsonStorage(SUMMARY_KEY, summary)
}

export function clearWorkoutSummary(): void {
  removeJsonStorage(SUMMARY_KEY)
}

export function deriveWorkoutStatus(progress: WorkoutProgress | null): 'idle' | 'active' {
  return progress && progress.completedAt === null ? 'active' : 'idle'
}
