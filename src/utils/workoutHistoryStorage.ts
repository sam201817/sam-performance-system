import type { WorkoutHistory, WorkoutHistorySession } from '../types/workoutHistory'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { sortSessionsNewestFirst } from './workoutHistoryCalculations'

const HISTORY_KEY = 'sps.workout-history.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isSetHistory(value: unknown): value is WorkoutHistorySession['exercises'][number]['sets'][number] {
  if (!isRecord(value)) return false
  return (
    typeof value.setNumber === 'number' &&
    typeof value.targetReps === 'string' &&
    typeof value.reps === 'string' &&
    typeof value.weight === 'string' &&
    (value.rpe === null || (typeof value.rpe === 'number' && value.rpe >= 1 && value.rpe <= 10)) &&
    typeof value.completed === 'boolean' &&
    (value.volume === null || typeof value.volume === 'number')
  )
}

function isExerciseHistory(value: unknown): value is WorkoutHistorySession['exercises'][number] {
  if (!isRecord(value)) return false
  return (
    typeof value.exerciseId === 'string' &&
    typeof value.exerciseName === 'string' &&
    typeof value.order === 'number' &&
    typeof value.completed === 'boolean' &&
    typeof value.totalSets === 'number' &&
    typeof value.completedSets === 'number' &&
    typeof value.totalVolume === 'number' &&
    (value.averageRpe === null || typeof value.averageRpe === 'number') &&
    typeof value.completionPercentage === 'number' &&
    Array.isArray(value.sets) &&
    value.sets.every(isSetHistory)
  )
}

function isWorkoutHistorySession(value: unknown): value is WorkoutHistorySession {
  if (!isRecord(value)) return false
  return (
    typeof value.id === 'string' &&
    typeof value.sessionId === 'string' &&
    typeof value.workoutName === 'string' &&
    typeof value.startedAt === 'string' &&
    typeof value.completedAt === 'string' &&
    typeof value.durationMinutes === 'number' &&
    typeof value.totalExercises === 'number' &&
    typeof value.completedExercises === 'number' &&
    typeof value.totalSets === 'number' &&
    typeof value.completedSets === 'number' &&
    typeof value.totalVolume === 'number' &&
    (value.averageRpe === null || typeof value.averageRpe === 'number') &&
    typeof value.completionPercentage === 'number' &&
    Array.isArray(value.exercises) &&
    value.exercises.every(isExerciseHistory) &&
    (value.notes === null || typeof value.notes === 'string') &&
    typeof value.version === 'number'
  )
}

function isWorkoutHistory(value: unknown): value is WorkoutHistory {
  if (!isRecord(value)) return false
  return (
    typeof value.version === 'number' &&
    Array.isArray(value.sessions) &&
    value.sessions.every(isWorkoutHistorySession)
  )
}

function createEmptyHistory(): WorkoutHistory {
  return {
    version: WORKOUT_HISTORY_VERSION,
    sessions: [],
  }
}

function normalizeHistory(raw: WorkoutHistory): WorkoutHistory {
  if (raw.version !== WORKOUT_HISTORY_VERSION) {
    return createEmptyHistory()
  }

  return {
    version: WORKOUT_HISTORY_VERSION,
    sessions: sortSessionsNewestFirst(raw.sessions),
  }
}

export function loadHistory(): WorkoutHistory {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return createEmptyHistory()

    const parsed: unknown = JSON.parse(stored)
    if (!isWorkoutHistory(parsed)) return createEmptyHistory()

    return normalizeHistory(parsed)
  } catch {
    return createEmptyHistory()
  }
}

export function saveHistory(history: WorkoutHistory): void {
  try {
    const normalized = normalizeHistory(history)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(normalized))
  } catch {
    /* storage unavailable */
  }
}

export function appendSession(session: WorkoutHistorySession): boolean {
  const history = loadHistory()
  const exists = history.sessions.some((entry) => entry.id === session.id)
  if (exists) return false

  saveHistory({
    version: WORKOUT_HISTORY_VERSION,
    sessions: sortSessionsNewestFirst([session, ...history.sessions]),
  })
  return true
}

export function deleteSession(sessionId: string): boolean {
  const history = loadHistory()
  const nextSessions = history.sessions.filter((session) => session.id !== sessionId)
  if (nextSessions.length === history.sessions.length) return false

  saveHistory({
    version: WORKOUT_HISTORY_VERSION,
    sessions: nextSessions,
  })
  return true
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function findHistorySession(sessionId: string): WorkoutHistorySession | null {
  return loadHistory().sessions.find((session) => session.id === sessionId) ?? null
}
