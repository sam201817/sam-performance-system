import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import {
  addBodyMetricEntry,
  clearBodyMetricHistory,
  deleteBodyMetricEntry,
  findEntryForDate,
  loadBodyMetricHistory,
  saveBodyMetricHistory,
  updateBodyMetricEntry,
} from './bodyMetricStorage'
import { getLocalDateKey } from './bodyMetricCalculations'

const STORAGE_KEY = 'sps.body-metrics.v1'

function createEntry(overrides: Partial<{
  id: string
  recordedAt: string
  weightKg: number | null
  bodyFatPercent: number | null
  muscleMassKg: number | null
  waistCm: number | null
  notes: string | null
}> = {}) {
  return {
    id: overrides.id ?? 'entry-1',
    recordedAt: overrides.recordedAt ?? '2026-07-22T10:00:00.000Z',
    weightKg: overrides.weightKg ?? 80,
    bodyFatPercent: overrides.bodyFatPercent ?? null,
    muscleMassKg: overrides.muscleMassKg ?? null,
    waistCm: overrides.waistCm ?? null,
    notes: overrides.notes ?? null,
    version: BODY_METRIC_VERSION,
  }
}

describe('bodyMetricStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads empty history by default', () => {
    expect(loadBodyMetricHistory()).toEqual({
      version: BODY_METRIC_VERSION,
      entries: [],
    })
  })

  it('saves and loads valid history', () => {
    const history = {
      version: BODY_METRIC_VERSION,
      entries: [createEntry()],
    }
    saveBodyMetricHistory(history)
    expect(loadBodyMetricHistory().entries).toHaveLength(1)
  })

  it('rejects corrupt JSON safely', () => {
    localStorage.setItem(STORAGE_KEY, '{bad-json')
    expect(loadBodyMetricHistory().entries).toHaveLength(0)
  })

  it('rejects invalid entries', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: BODY_METRIC_VERSION,
        entries: [{ id: 'x', recordedAt: 'bad', version: BODY_METRIC_VERSION }],
      }),
    )
    expect(loadBodyMetricHistory().entries).toHaveLength(0)
  })

  it('adds entries newest first', () => {
    let history = loadBodyMetricHistory()
    history = addBodyMetricEntry(history, createEntry({
      id: 'older',
      recordedAt: '2026-07-20T10:00:00.000Z',
      weightKg: 79,
    }))
    history = addBodyMetricEntry(history, createEntry({
      id: 'newer',
      recordedAt: '2026-07-22T10:00:00.000Z',
      weightKg: 78,
    }))

    expect(history.entries.map((entry) => entry.id)).toEqual(['newer', 'older'])
  })

  it('updates same-day entries instead of duplicating', () => {
    const date = new Date('2026-07-22T12:00:00.000Z')
    let history = loadBodyMetricHistory()
    history = addBodyMetricEntry(history, createEntry({
      id: 'day-1',
      recordedAt: date.toISOString(),
      weightKg: 80,
    }))
    history = addBodyMetricEntry(history, createEntry({
      id: 'day-2',
      recordedAt: date.toISOString(),
      weightKg: 79,
    }))

    expect(history.entries).toHaveLength(1)
    expect(history.entries[0].weightKg).toBe(79)
    expect(findEntryForDate(history, date)?.weightKg).toBe(79)
  })

  it('updates an existing entry by id', () => {
    let history = addBodyMetricEntry(loadBodyMetricHistory(), createEntry({ weightKg: 80 }))
    const entryId = history.entries[0].id
    history = updateBodyMetricEntry(history, entryId, {
      ...history.entries[0],
      weightKg: 77,
    })

    expect(history.entries[0].weightKg).toBe(77)
  })

  it('deletes an entry', () => {
    let history = addBodyMetricEntry(loadBodyMetricHistory(), createEntry())
    history = deleteBodyMetricEntry(history, history.entries[0].id)
    expect(history.entries).toHaveLength(0)
  })

  it('clears history', () => {
    saveBodyMetricHistory({ version: BODY_METRIC_VERSION, entries: [createEntry()] })
    clearBodyMetricHistory()
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull()
  })

  it('finds entries for a local calendar date', () => {
    const date = new Date('2026-07-22T23:30:00.000Z')
    const history = addBodyMetricEntry(loadBodyMetricHistory(), createEntry({
      recordedAt: date.toISOString(),
    }))

    expect(getLocalDateKey(date)).toBe(getLocalDateKey(new Date(history.entries[0].recordedAt)))
    expect(findEntryForDate(history, date)?.id).toBe(history.entries[0].id)
  })

  it('does not throw when localStorage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })

    expect(() => loadBodyMetricHistory()).not.toThrow()
    expect(() => saveBodyMetricHistory({ version: BODY_METRIC_VERSION, entries: [createEntry()] })).not.toThrow()
    expect(() => clearBodyMetricHistory()).not.toThrow()
  })
})
