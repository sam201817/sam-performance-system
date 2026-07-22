import { beforeEach, describe, expect, it, vi } from 'vitest'
import { APP_METADATA } from '../data/appMetadata'
import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { BACKUP_SCHEMA_VERSION } from '../types/backup'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { createValidBackup } from '../test/backupFixtures'
import {
  buildBackupPayload,
  collectBackupData,
  downloadBackup,
  downloadJsonFile,
  formatBackupFilename,
  serializeBackup,
} from './backupData'
import { saveBodyMetricHistory } from './bodyMetricStorage'
import { saveDailyCheckInHistory } from './dailyCheckInStorage'
import { savePreferences } from './preferencesStorage'
import { saveHistory } from './workoutHistoryStorage'
import { saveWorkoutSummary } from './workoutProgressStorage'

describe('backupData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('collects all SPS-owned persisted data', () => {
    saveHistory({
      version: WORKOUT_HISTORY_VERSION,
      sessions: [{
        id: 'session-1',
        sessionId: 'full-body-rebuild-v1',
        workoutName: 'Test',
        startedAt: '2026-07-22T10:00:00.000Z',
        completedAt: '2026-07-22T11:00:00.000Z',
        durationMinutes: 60,
        totalExercises: 1,
        completedExercises: 1,
        totalSets: 3,
        completedSets: 3,
        totalVolume: 1000,
        averageRpe: 8,
        completionPercentage: 100,
        exercises: [],
        notes: null,
        version: WORKOUT_HISTORY_VERSION,
      }],
    })
    saveBodyMetricHistory({
      version: BODY_METRIC_VERSION,
      entries: [{
        id: 'body-1',
        recordedAt: '2026-07-22T08:00:00.000Z',
        weightKg: 80,
        bodyFatPercent: null,
        muscleMassKg: null,
        waistCm: null,
        notes: null,
        version: BODY_METRIC_VERSION,
      }],
    })
    saveDailyCheckInHistory({
      version: DAILY_CHECK_IN_VERSION,
      entries: [{
        id: 'check-in-1',
        recordedAt: '2026-07-22T08:00:00.000Z',
        fatigue: 3,
        sleepQuality: 4,
        motivation: 4,
        muscleSoreness: 2,
        notes: null,
        version: DAILY_CHECK_IN_VERSION,
      }],
    })
    savePreferences({
      version: 2,
      weightUnit: 'imperial',
      theme: 'system',
      language: 'zh-TW',
    })
    saveWorkoutSummary({
      totalExercises: 7,
      completedExercises: 7,
      totalCompletedSets: 18,
      durationMinutes: 55,
      historySessionId: 'session-1',
    })

    const data = collectBackupData()

    expect(data.workoutHistory.sessions).toHaveLength(1)
    expect(data.bodyMetrics.entries).toHaveLength(1)
    expect(data.dailyCheckIn.entries).toHaveLength(1)
    expect(data.preferences.weightUnit).toBe('imperial')
    expect(data.workoutSummary?.historySessionId).toBe('session-1')
  })

  it('builds a versioned backup payload', () => {
    const payload = buildBackupPayload()

    expect(payload.schemaVersion).toBe(BACKUP_SCHEMA_VERSION)
    expect(payload.appVersion).toBe(APP_METADATA.version)
    expect(payload.exportedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    expect(payload.data.preferences.weightUnit).toBe('metric')
  })

  it('serializes backup JSON and formats filenames', () => {
    const backup = createValidBackup()
    const serialized = serializeBackup(backup)

    expect(() => JSON.parse(serialized)).not.toThrow()
    expect(formatBackupFilename(new Date('2026-07-22T10:00:00.000Z'))).toBe(
      'sps-backup-2026-07-22.json',
    )
  })

  it('downloads backup using the standard filename format', () => {
    const click = vi.fn()
    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:backup')
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      style: { display: '' },
      click,
    } as unknown as HTMLAnchorElement)
    vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)

    const filename = downloadBackup(createValidBackup())

    expect(filename).toBe('sps-backup-2026-07-22.json')
    expect(click).toHaveBeenCalled()
  })

  it('does not include unrelated browser storage keys', () => {
    localStorage.setItem('unrelated-app-key', 'keep-me')
    localStorage.setItem(SPS_STORAGE_KEYS.workoutHistory, JSON.stringify({
      version: WORKOUT_HISTORY_VERSION,
      sessions: [],
    }))

    const payload = buildBackupPayload()
    const serialized = serializeBackup(payload)

    expect(serialized).not.toContain('unrelated-app-key')
    expect(localStorage.getItem('unrelated-app-key')).toBe('keep-me')
  })
})

describe('downloadJsonFile', () => {
  it('creates a downloadable JSON anchor', () => {
    const appendChild = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node)
    const removeChild = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node)
    const click = vi.fn()
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:backup')
    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      style: { display: '' },
      click,
    } as unknown as HTMLAnchorElement)

    downloadJsonFile('sps-backup-2026-07-22.json', '{"ok":true}')

    expect(click).toHaveBeenCalled()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:backup')

    appendChild.mockRestore()
    removeChild.mockRestore()
    revokeObjectURL.mockRestore()
  })
})
