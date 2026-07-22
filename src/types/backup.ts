import type { BodyMetricHistory } from './bodyMetrics'
import type { DailyCheckInHistory } from './dailyCheckIn'
import type { UserPreferences } from './settings'
import type { WorkoutHistory } from './workoutHistory'
import type { WorkoutProgress, WorkoutSummary } from './workoutProgress'

export const BACKUP_SCHEMA_VERSION = 1 as const

export type SpsBackupPayload = {
  schemaVersion: typeof BACKUP_SCHEMA_VERSION
  exportedAt: string
  appVersion: string
  data: SpsBackupData
}

export type SpsBackupData = {
  workoutHistory: WorkoutHistory
  bodyMetrics: BodyMetricHistory
  dailyCheckIn: DailyCheckInHistory
  preferences: UserPreferences
  workoutProgress: WorkoutProgress | null
  workoutSummary: WorkoutSummary | null
}

export type BackupValidationResult =
  | { valid: true; backup: SpsBackupPayload }
  | { valid: false; error: string; code: 'invalid-json' | 'malformed' | 'unsupported-version' }

export type RestoreResult =
  | { success: true }
  | {
      success: false
      error: string
      code: 'invalid-json' | 'malformed' | 'unsupported-version' | 'restore-failed'
    }
