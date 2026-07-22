import { describe, expect, it } from 'vitest'
import type { DailyCheckInEntry } from '../types/dailyCheckIn'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import { getLocalDateKey } from './bodyMetricCalculations'
import {
  addDailyCheckInEntry,
  findCheckInForDate,
  loadDailyCheckInHistory,
  saveDailyCheckInHistory,
  updateDailyCheckInEntry,
} from './dailyCheckInStorage'

function createEntry(overrides: Partial<DailyCheckInEntry> = {}): Omit<DailyCheckInEntry, 'id' | 'version'> {
  return {
    recordedAt: '2026-07-22T08:00:00.000Z',
    fatigue: 3,
    sleepQuality: 4,
    motivation: 4,
    muscleSoreness: 2,
    notes: null,
    ...overrides,
  }
}

describe('dailyCheckInStorage', () => {
  it('loads empty history by default', () => {
    expect(loadDailyCheckInHistory().entries).toEqual([])
  })

  it('adds and persists one entry per day', () => {
    let history = loadDailyCheckInHistory()
    history = addDailyCheckInEntry(history, createEntry())
    saveDailyCheckInHistory(history)

    const reloaded = loadDailyCheckInHistory()
    expect(reloaded.entries).toHaveLength(1)
    expect(findCheckInForDate(reloaded, new Date('2026-07-22T12:00:00.000Z'))).not.toBeNull()
  })

  it('replaces same-day entries on add', () => {
    let history = addDailyCheckInEntry(loadDailyCheckInHistory(), createEntry({ fatigue: 2 }))
    history = addDailyCheckInEntry(history, createEntry({ fatigue: 4, recordedAt: '2026-07-22T14:00:00.000Z' }))

    expect(history.entries).toHaveLength(1)
    expect(history.entries[0].fatigue).toBe(4)
  })

  it('updates an existing entry and keeps history', () => {
    let history = addDailyCheckInEntry(loadDailyCheckInHistory(), createEntry())
    const entryId = history.entries[0].id

    history = updateDailyCheckInEntry(
      history,
      entryId,
      createEntry({ motivation: 5, notes: 'Feeling good' }),
    )

    expect(history.entries).toHaveLength(1)
    expect(history.entries[0].motivation).toBe(5)
    expect(history.entries[0].notes).toBe('Feeling good')
    expect(history.entries[0].version).toBe(DAILY_CHECK_IN_VERSION)
  })

  it('keeps separate entries for different days', () => {
    let history = addDailyCheckInEntry(loadDailyCheckInHistory(), createEntry())
    history = addDailyCheckInEntry(
      history,
      createEntry({ recordedAt: '2026-07-21T08:00:00.000Z', fatigue: 5 }),
    )

    expect(history.entries).toHaveLength(2)
    expect(getLocalDateKey(new Date(history.entries[0].recordedAt))).not.toBe(
      getLocalDateKey(new Date(history.entries[1].recordedAt)),
    )
  })
})
