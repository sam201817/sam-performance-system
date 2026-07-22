import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { createValidBackup } from '../test/backupFixtures'
import { loadBodyMetricHistory } from './bodyMetricStorage'
import { loadDailyCheckInHistory } from './dailyCheckInStorage'
import { loadPreferences } from './preferencesStorage'
import {
  applyBackupData,
  restoreSpsBackup,
  restoreSpsBackupFromFile,
  restoreSpsBackupFromText,
} from './backupRestore'
import { loadHistory } from './workoutHistoryStorage'
import { loadRawWorkoutProgress, loadWorkoutSummary } from './workoutProgressStorage'
import * as bodyMetricStorage from './bodyMetricStorage'

describe('backupRestore', () => {
  beforeEach(() => {
    localStorage.clear()
    saveExistingData()
  })

  function saveExistingData() {
    localStorage.setItem(SPS_STORAGE_KEYS.workoutHistory, JSON.stringify({
      version: WORKOUT_HISTORY_VERSION,
      sessions: [{
        id: 'existing-session',
        sessionId: 'full-body-rebuild-v1',
        workoutName: 'Existing',
        startedAt: '2026-07-20T10:00:00.000Z',
        completedAt: '2026-07-20T11:00:00.000Z',
        durationMinutes: 60,
        totalExercises: 1,
        completedExercises: 1,
        totalSets: 3,
        completedSets: 3,
        totalVolume: 500,
        averageRpe: 7,
        completionPercentage: 100,
        exercises: [],
        notes: null,
        version: WORKOUT_HISTORY_VERSION,
      }],
    }))
  }

  it('restores valid backup data', async () => {
    const backup = createValidBackup()
    backup.data.bodyMetrics.entries = [{
      id: 'restored-body',
      recordedAt: '2026-07-22T08:00:00.000Z',
      weightKg: 79,
      bodyFatPercent: null,
      muscleMassKg: null,
      waistCm: null,
      notes: null,
      version: BODY_METRIC_VERSION,
    }]
    backup.data.dailyCheckIn.entries = [{
      id: 'restored-check-in',
      recordedAt: '2026-07-22T08:00:00.000Z',
      fatigue: 2,
      sleepQuality: 4,
      motivation: 4,
      muscleSoreness: 2,
      notes: null,
      version: DAILY_CHECK_IN_VERSION,
    }]
    backup.data.preferences = {
      version: 2,
      weightUnit: 'imperial',
      theme: 'system',
      language: 'zh-TW',
    }

    const result = restoreSpsBackup(backup)
    expect(result).toEqual({ success: true })
    expect(loadHistory().sessions).toHaveLength(0)
    expect(loadBodyMetricHistory().entries[0]?.id).toBe('restored-body')
    expect(loadDailyCheckInHistory().entries[0]?.id).toBe('restored-check-in')
    expect(loadPreferences().weightUnit).toBe('imperial')
  })

  it('restores workout progress and summary when present', () => {
    const backup = createValidBackup()
    backup.data.workoutProgress = {
      sessionId: 'full-body-rebuild-v1',
      currentExerciseIndex: 0,
      exerciseLogs: [],
      startedAt: '2026-07-22T10:00:00.000Z',
      completedAt: null,
    }
    backup.data.workoutSummary = {
      totalExercises: 7,
      completedExercises: 7,
      totalCompletedSets: 18,
      durationMinutes: 55,
      historySessionId: 'session-1',
    }

    const result = restoreSpsBackup(backup)
    expect(result).toEqual({ success: true })
    expect(loadRawWorkoutProgress()?.sessionId).toBe('full-body-rebuild-v1')
    expect(loadWorkoutSummary()?.historySessionId).toBe('session-1')
  })

  it('clears workout progress and summary when backup values are null', () => {
    localStorage.setItem(SPS_STORAGE_KEYS.workoutProgress, JSON.stringify({
      sessionId: 'full-body-rebuild-v1',
      currentExerciseIndex: 0,
      exerciseLogs: [],
      startedAt: '2026-07-22T10:00:00.000Z',
      completedAt: null,
    }))
    localStorage.setItem(SPS_STORAGE_KEYS.workoutSummary, JSON.stringify({
      totalExercises: 7,
      completedExercises: 7,
      totalCompletedSets: 18,
      durationMinutes: 55,
      historySessionId: 'session-1',
    }))

    const result = restoreSpsBackup(createValidBackup())
    expect(result).toEqual({ success: true })
    expect(loadRawWorkoutProgress()).toBeNull()
    expect(loadWorkoutSummary()).toBeNull()
  })

  it('rejects invalid backup objects passed to restoreSpsBackup', () => {
    const beforeHistory = loadHistory()
    const result = restoreSpsBackup(createValidBackup({ schemaVersion: 99 as never }))
    expect(result.success).toBe(false)
    expect(loadHistory()).toEqual(beforeHistory)
  })

  it('restores from file and text helpers', async () => {
    const backup = createValidBackup()
    backup.data.dailyCheckIn.entries = [{
      id: 'file-check-in',
      recordedAt: '2026-07-22T08:00:00.000Z',
      fatigue: 3,
      sleepQuality: 4,
      motivation: 4,
      muscleSoreness: 2,
      notes: null,
      version: DAILY_CHECK_IN_VERSION,
    }]

    const file = new File([JSON.stringify(backup)], 'sps-backup.json', {
      type: 'application/json',
    })

    const fileResult = await restoreSpsBackupFromFile(file)
    expect(fileResult).toEqual({ success: true })
    expect(loadDailyCheckInHistory().entries[0]?.id).toBe('file-check-in')

    const textResult = await restoreSpsBackupFromText(JSON.stringify(backup))
    expect(textResult).toEqual({ success: true })
  })

  it('applyBackupData writes all sections', () => {
    applyBackupData(createValidBackup().data)
    expect(loadHistory().sessions).toHaveLength(0)
    expect(loadBodyMetricHistory().entries).toHaveLength(0)
    expect(loadDailyCheckInHistory().entries).toHaveLength(0)
    expect(loadPreferences().weightUnit).toBe('metric')
  })

  it('rejects invalid backup text without changing data', async () => {
    const beforeHistory = loadHistory()

    const result = await restoreSpsBackupFromText('{bad-json')
    expect(result.success).toBe(false)
    expect(loadHistory()).toEqual(beforeHistory)
  })

  it('does not partially overwrite existing data when restore fails mid-write', () => {
    const beforeHistory = loadHistory()
    const backup = createValidBackup()
    backup.data.workoutHistory.sessions = []

    vi.spyOn(bodyMetricStorage, 'saveBodyMetricHistory').mockImplementation(() => {
      throw new Error('write failed')
    })

    const result = restoreSpsBackup(backup)
    expect(result.success).toBe(false)
    expect(loadHistory()).toEqual(beforeHistory)
  })
})
