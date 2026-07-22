import { describe, expect, it } from 'vitest'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import {
  buildWorkoutSummary,
  clampExerciseIndex,
  countCompletedSets,
  createExerciseLog,
  createWorkoutProgress,
  hasIncompleteSets,
  syncExerciseCompletion,
  updateExerciseLog,
} from './workoutProgressFactory'

describe('createWorkoutProgress', () => {
  it('creates logs for every exercise with stable IDs', () => {
    const progress = createWorkoutProgress(TODAY_WORKOUT)

    expect(progress.exerciseLogs).toHaveLength(TODAY_WORKOUT.exercises.length)
    progress.exerciseLogs.forEach((log, index) => {
      expect(log.exerciseId).toBe(TODAY_WORKOUT.exercises[index].id)
    })
  })

  it('creates the correct number of sets with defaults', () => {
    const progress = createWorkoutProgress(TODAY_WORKOUT)
    const firstExercise = TODAY_WORKOUT.exercises[0]
    const firstLog = progress.exerciseLogs[0]

    expect(firstLog.sets).toHaveLength(firstExercise.sets)
    expect(firstLog.sets[0]).toMatchObject({
      setNumber: 1,
      targetReps: firstExercise.reps,
      actualReps: firstExercise.reps,
      weight: firstExercise.weight,
      rpe: null,
      completed: false,
    })
  })
})

describe('exercise completion', () => {
  it('marks exercise complete only when all sets are complete', () => {
    const log = createExerciseLog(TODAY_WORKOUT.exercises[0])
    expect(syncExerciseCompletion(log).completed).toBe(false)

    const partiallyDone = {
      ...log,
      sets: log.sets.map((set, index) =>
        index === 0 ? { ...set, completed: true } : set,
      ),
    }
    expect(syncExerciseCompletion(partiallyDone).completed).toBe(false)

    const fullyDone = {
      ...log,
      sets: log.sets.map((set) => ({ ...set, completed: true })),
    }
    expect(syncExerciseCompletion(fullyDone).completed).toBe(true)
  })
})

describe('updateExerciseLog', () => {
  it('updates set values immutably', () => {
    const progress = createWorkoutProgress(TODAY_WORKOUT)
    const exerciseId = TODAY_WORKOUT.exercises[0].id

    const next = updateExerciseLog(progress, exerciseId, (log) => ({
      ...log,
      sets: log.sets.map((set) =>
        set.setNumber === 1
          ? { ...set, actualReps: '12', weight: '26 kg', rpe: 8, completed: true }
          : set,
      ),
    }))

    expect(next).not.toBe(progress)
    expect(next.exerciseLogs[0].sets[0]).toMatchObject({
      actualReps: '12',
      weight: '26 kg',
      rpe: 8,
      completed: true,
    })
    expect(progress.exerciseLogs[0].sets[0].actualReps).toBe('10')
  })
})

describe('clampExerciseIndex', () => {
  it('clamps invalid indexes safely', () => {
    expect(clampExerciseIndex(-3, 7)).toBe(0)
    expect(clampExerciseIndex(99, 7)).toBe(6)
    expect(clampExerciseIndex(2, 0)).toBe(0)
  })
})

describe('buildWorkoutSummary', () => {
  it('builds summary counts and duration', () => {
    const progress = createWorkoutProgress(TODAY_WORKOUT)
    const updated = updateExerciseLog(progress, TODAY_WORKOUT.exercises[0].id, (log) => ({
      ...log,
      sets: log.sets.map((set, index) =>
        index === 0 ? { ...set, completed: true } : set,
      ),
    }))

    const summary = buildWorkoutSummary(
      {
        ...updated,
        startedAt: '2026-01-01T10:00:00.000Z',
        completedAt: '2026-01-01T10:30:00.000Z',
      },
      TODAY_WORKOUT,
    )

    expect(summary.totalExercises).toBe(TODAY_WORKOUT.exercises.length)
    expect(summary.completedExercises).toBe(0)
    expect(summary.totalCompletedSets).toBe(1)
    expect(summary.durationMinutes).toBe(30)
  })
})

describe('hasIncompleteSets', () => {
  it('detects incomplete sets', () => {
    const log = createExerciseLog(TODAY_WORKOUT.exercises[0])
    expect(hasIncompleteSets(log)).toBe(true)
    expect(hasIncompleteSets(syncExerciseCompletion({
      ...log,
      sets: log.sets.map((set) => ({ ...set, completed: true })),
    }))).toBe(false)
  })
})

describe('countCompletedSets', () => {
  it('counts completed sets only', () => {
    const log = createExerciseLog(TODAY_WORKOUT.exercises[0])
    expect(countCompletedSets(log)).toBe(0)

    const oneDone = {
      ...log,
      sets: log.sets.map((set, index) =>
        index === 0 ? { ...set, completed: true } : set,
      ),
    }
    expect(countCompletedSets(oneDone)).toBe(1)
  })
})
