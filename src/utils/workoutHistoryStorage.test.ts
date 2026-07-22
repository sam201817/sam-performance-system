import { beforeEach, describe, expect, it, vi } from 'vitest'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { createWorkoutProgress } from './workoutProgressFactory'
import {
  appendSession,
  clearHistory,
  deleteSession,
  loadHistory,
  saveHistory,
} from './workoutHistoryStorage'
import { buildHistorySession } from './workoutHistoryFactory'

const HISTORY_KEY = 'sps.workout-history.v1'

describe('workoutHistoryStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads empty history by default', () => {
    expect(loadHistory()).toEqual({
      version: WORKOUT_HISTORY_VERSION,
      sessions: [],
    })
  })

  it('saves and loads valid history', () => {
    const session = buildHistorySession(
      {
        ...createWorkoutProgress(TODAY_WORKOUT),
        completedAt: '2026-07-22T10:00:00.000Z',
      },
      TODAY_WORKOUT,
      'session-1',
    )

    saveHistory({ version: WORKOUT_HISTORY_VERSION, sessions: [session] })
    expect(loadHistory().sessions).toHaveLength(1)
    expect(loadHistory().sessions[0].id).toBe('session-1')
  })

  it('appends sessions without overwriting existing entries', () => {
    const first = buildHistorySession(
      {
        ...createWorkoutProgress(TODAY_WORKOUT),
        completedAt: '2026-07-21T10:00:00.000Z',
      },
      TODAY_WORKOUT,
      'session-1',
    )
    const second = buildHistorySession(
      {
        ...createWorkoutProgress(TODAY_WORKOUT),
        completedAt: '2026-07-22T10:00:00.000Z',
      },
      TODAY_WORKOUT,
      'session-2',
    )

    appendSession(first)
    appendSession(second)

    const history = loadHistory()
    expect(history.sessions).toHaveLength(2)
    expect(history.sessions[0].id).toBe('session-2')
    expect(history.sessions[1].id).toBe('session-1')
  })

  it('rejects duplicate session ids when appending', () => {
    const session = buildHistorySession(
      {
        ...createWorkoutProgress(TODAY_WORKOUT),
        completedAt: '2026-07-22T10:00:00.000Z',
      },
      TODAY_WORKOUT,
      'session-1',
    )

    expect(appendSession(session)).toBe(true)
    expect(appendSession(session)).toBe(false)
    expect(loadHistory().sessions).toHaveLength(1)
  })

  it('deletes a session by id', () => {
    const session = buildHistorySession(
      {
        ...createWorkoutProgress(TODAY_WORKOUT),
        completedAt: '2026-07-22T10:00:00.000Z',
      },
      TODAY_WORKOUT,
      'session-1',
    )

    appendSession(session)
    expect(deleteSession('session-1')).toBe(true)
    expect(loadHistory().sessions).toHaveLength(0)
  })

  it('clears all history', () => {
    appendSession(
      buildHistorySession(
        {
          ...createWorkoutProgress(TODAY_WORKOUT),
          completedAt: '2026-07-22T10:00:00.000Z',
        },
        TODAY_WORKOUT,
        'session-1',
      ),
    )

    clearHistory()
    expect(localStorage.getItem(HISTORY_KEY)).toBeNull()
    expect(loadHistory().sessions).toHaveLength(0)
  })

  it('rejects corrupt JSON safely', () => {
    localStorage.setItem(HISTORY_KEY, '{bad-json')
    expect(loadHistory().sessions).toHaveLength(0)
  })

  it('rejects unsupported schema versions', () => {
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify({ version: 99, sessions: [] }),
    )
    expect(loadHistory().sessions).toHaveLength(0)
  })

  it('does not throw when localStorage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    expect(() => loadHistory()).not.toThrow()
    expect(() => appendSession(
      buildHistorySession(
        {
          ...createWorkoutProgress(TODAY_WORKOUT),
          completedAt: '2026-07-22T10:00:00.000Z',
        },
        TODAY_WORKOUT,
        'session-1',
      ),
    )).not.toThrow()
    expect(() => clearHistory()).not.toThrow()

    getItem.mockRestore()
    setItem.mockRestore()
  })
})
