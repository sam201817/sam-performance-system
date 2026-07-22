import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import type { WorkoutHistory, WorkoutHistorySession } from '../types/workoutHistory'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { isRecord } from './guards/isRecord'
import { readJsonStorage, removeJsonStorage, writeJsonStorage } from './storage/jsonStorage'
import { sortSessionsNewestFirst } from './workoutHistoryCalculations'

const HISTORY_KEY = SPS_STORAGE_KEYS.workoutHistory

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

export function isWorkoutHistory(value: unknown): value is WorkoutHistory {
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
  const loaded = readJsonStorage(HISTORY_KEY, isWorkoutHistory, createEmptyHistory())
  return normalizeHistory(loaded)
}

export function saveHistory(history: WorkoutHistory): boolean {
  return writeJsonStorage(HISTORY_KEY, normalizeHistory(history))
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
  removeJsonStorage(HISTORY_KEY)
}

export function findHistorySession(sessionId: string): WorkoutHistorySession | null {
  return loadHistory().sessions.find((session) => session.id === sessionId) ?? null
}
