import { BACKUP_SCHEMA_VERSION, type SpsBackupPayload } from '../types/backup'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { APP_METADATA } from '../data/appMetadata'
import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { createDefaultPreferences } from '../utils/preferencesStorage'

export function createValidBackup(
  overrides: Partial<SpsBackupPayload> = {},
): SpsBackupPayload {
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: '2026-07-22T10:00:00.000Z',
    appVersion: APP_METADATA.version,
    data: {
      workoutHistory: {
        version: WORKOUT_HISTORY_VERSION,
        sessions: [],
      },
      bodyMetrics: {
        version: BODY_METRIC_VERSION,
        entries: [],
      },
      dailyCheckIn: {
        version: DAILY_CHECK_IN_VERSION,
        entries: [],
      },
      preferences: createDefaultPreferences(),
      workoutProgress: null,
      workoutSummary: null,
    },
    ...overrides,
  }
}

export const ALL_SPS_KEYS_FOR_TESTS = Object.values(SPS_STORAGE_KEYS)
