import { beforeEach, describe, expect, it } from 'vitest'
import { ALL_SPS_STORAGE_KEYS, SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { loadBodyMetricHistory } from './bodyMetricStorage'
import { loadDailyCheckInHistory } from './dailyCheckInStorage'
import { loadPreferences } from './preferencesStorage'
import { isSpsStorageKey, resetAllSpsData } from './resetSpsData'
import { loadHistory } from './workoutHistoryStorage'

describe('resetSpsData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('identifies SPS storage keys', () => {
    expect(isSpsStorageKey(SPS_STORAGE_KEYS.preferences)).toBe(true)
    expect(isSpsStorageKey('unrelated-key')).toBe(false)
    expect(ALL_SPS_STORAGE_KEYS).toContain(SPS_STORAGE_KEYS.dailyCheckIn)
  })

  it('removes only SPS-owned local data', () => {
    localStorage.setItem(SPS_STORAGE_KEYS.workoutHistory, JSON.stringify({
      version: WORKOUT_HISTORY_VERSION,
      sessions: [],
    }))
    localStorage.setItem(SPS_STORAGE_KEYS.bodyMetrics, JSON.stringify({
      version: BODY_METRIC_VERSION,
      entries: [],
    }))
    localStorage.setItem(SPS_STORAGE_KEYS.dailyCheckIn, JSON.stringify({
      version: DAILY_CHECK_IN_VERSION,
      entries: [],
    }))
    localStorage.setItem(SPS_STORAGE_KEYS.preferences, JSON.stringify({
      version: 1,
      weightUnit: 'imperial',
      theme: 'system',
    }))
    localStorage.setItem('other-app-data', 'preserve-me')

    resetAllSpsData()

    expect(loadHistory().sessions).toHaveLength(0)
    expect(loadBodyMetricHistory().entries).toHaveLength(0)
    expect(loadDailyCheckInHistory().entries).toHaveLength(0)
    expect(loadPreferences().weightUnit).toBe('metric')
    expect(localStorage.getItem('other-app-data')).toBe('preserve-me')
  })
})
