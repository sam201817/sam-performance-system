import { describe, expect, it } from 'vitest'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import {
  buildHistorySession,
  buildHistoryStatistics,
  ensureHistorySessionSaved,
} from './workoutHistoryFactory'
import {
  createWorkoutProgress,
  updateExerciseLog,
} from './workoutProgressFactory'
import { loadHistory } from './workoutHistoryStorage'

describe('workoutHistoryFactory', () => {
  it('builds a history session from completed progress', () => {
    const progress = {
      ...createWorkoutProgress(TODAY_WORKOUT),
      completedAt: '2026-07-22T10:30:00.000Z',
    }

    const session = buildHistorySession(progress, TODAY_WORKOUT, 'history-1')

    expect(session.id).toBe('history-1')
    expect(session.workoutName).toBe(TODAY_WORKOUT.title)
    expect(session.exercises).toHaveLength(TODAY_WORKOUT.exercises.length)
    expect(session.exercises[0].exerciseId).toBe(TODAY_WORKOUT.exercises[0].id)
    expect(session.totalSets).toBe(TODAY_WORKOUT.exercises.reduce((sum, exercise) => sum + exercise.sets, 0))
  })

  it('calculates volume and average RPE from logged sets', () => {
    let progress = createWorkoutProgress(TODAY_WORKOUT)
    const firstExercise = TODAY_WORKOUT.exercises[0]

    progress = updateExerciseLog(progress, firstExercise.id, (log) => ({
      ...log,
      sets: log.sets.map((set, index) =>
        index === 0
          ? { ...set, actualReps: '10', weight: '24 kg', rpe: 8, completed: true }
          : set,
      ),
    }))

    const session = buildHistorySession(
      { ...progress, completedAt: '2026-07-22T10:30:00.000Z' },
      TODAY_WORKOUT,
      'history-2',
    )

    expect(session.exercises[0].sets[0].volume).toBe(240)
    expect(session.exercises[0].averageRpe).toBe(8)
    expect(session.totalVolume).toBe(240)
  })

  it('builds aggregate statistics from sessions', () => {
    const progress = {
      ...createWorkoutProgress(TODAY_WORKOUT),
      completedAt: '2026-07-22T10:30:00.000Z',
    }
    const session = buildHistorySession(progress, TODAY_WORKOUT, 'history-3')

    const stats = buildHistoryStatistics([session])
    expect(stats.totalWorkouts).toBe(1)
    expect(stats.averageDurationMinutes).toBe(session.durationMinutes)
  })

  it('prevents duplicate history writes for the same session id', () => {
    const progress = {
      ...createWorkoutProgress(TODAY_WORKOUT),
      completedAt: '2026-07-22T10:30:00.000Z',
    }

    const firstId = ensureHistorySessionSaved(progress, TODAY_WORKOUT, 'history-4')
    const secondId = ensureHistorySessionSaved(progress, TODAY_WORKOUT, firstId)

    expect(firstId).toBe('history-4')
    expect(secondId).toBe('history-4')
    expect(loadHistory().sessions).toHaveLength(1)
  })
})
