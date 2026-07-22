import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import { createWorkoutProgress } from './workoutProgressFactory'
import {
  clearWorkoutProgress,
  clearWorkoutSummary,
  loadWorkoutProgress,
  loadWorkoutSummary,
  saveWorkoutProgress,
  saveWorkoutSummary,
} from './workoutProgressStorage'

const PROGRESS_KEY = 'sps.workout-progress.v1'

describe('workoutProgressStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and restores valid progress', () => {
    const progress = createWorkoutProgress(TODAY_WORKOUT)
    saveWorkoutProgress(progress)

    expect(loadWorkoutProgress(TODAY_WORKOUT)).toEqual({
      ...progress,
      currentExerciseIndex: progress.currentExerciseIndex,
    })
  })

  it('rejects corrupt JSON', () => {
    localStorage.setItem(PROGRESS_KEY, '{not-json')
    expect(loadWorkoutProgress(TODAY_WORKOUT)).toBeNull()
  })

  it('rejects malformed progress objects', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ sessionId: 'x' }))
    expect(loadWorkoutProgress(TODAY_WORKOUT)).toBeNull()
  })

  it('rejects another session ID', () => {
    const progress = createWorkoutProgress(TODAY_WORKOUT)
    saveWorkoutProgress({ ...progress, sessionId: 'other-session' })
    expect(loadWorkoutProgress(TODAY_WORKOUT)).toBeNull()
  })

  it('clears active progress', () => {
    saveWorkoutProgress(createWorkoutProgress(TODAY_WORKOUT))
    clearWorkoutProgress()
    expect(loadWorkoutProgress(TODAY_WORKOUT)).toBeNull()
  })

  it('saves and restores summary', () => {
    const summary = {
      totalExercises: 7,
      completedExercises: 5,
      totalCompletedSets: 15,
      durationMinutes: 42,
    }
    saveWorkoutSummary(summary)
    expect(loadWorkoutSummary()).toEqual(summary)
  })

  it('clears summary', () => {
    saveWorkoutSummary({
      totalExercises: 7,
      completedExercises: 7,
      totalCompletedSets: 21,
      durationMinutes: 55,
    })
    clearWorkoutSummary()
    expect(loadWorkoutSummary()).toBeNull()
  })

  it('does not throw when localStorage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    expect(() => loadWorkoutProgress(TODAY_WORKOUT)).not.toThrow()
    expect(loadWorkoutProgress(TODAY_WORKOUT)).toBeNull()
    expect(() => saveWorkoutProgress(createWorkoutProgress(TODAY_WORKOUT))).not.toThrow()
    expect(() => clearWorkoutProgress()).not.toThrow()
    expect(() => loadWorkoutSummary()).not.toThrow()
    expect(() => saveWorkoutSummary({
      totalExercises: 1,
      completedExercises: 1,
      totalCompletedSets: 1,
      durationMinutes: 1,
    })).not.toThrow()

    getItem.mockRestore()
    setItem.mockRestore()
  })
})
