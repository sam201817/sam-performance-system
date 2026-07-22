import {
  BACKUP_SCHEMA_VERSION,
  type BackupValidationResult,
  type SpsBackupPayload,
} from '../types/backup'
import { isDailyCheckInHistory } from './dailyCheckInStorage'
import { isBodyMetricHistory } from './bodyMetricStorage'
import { isUserPreferences } from './preferencesStorage'
import { isWorkoutHistory } from './workoutHistoryStorage'
import { isWorkoutProgress, isWorkoutSummary } from './workoutProgressStorage'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function validateBackupPayload(data: unknown): BackupValidationResult {
  if (!isRecord(data)) {
    return {
      valid: false,
      error: 'Backup file is not a valid SPS backup object.',
      code: 'malformed',
    }
  }

  const schemaVersion = data.schemaVersion
  if (typeof schemaVersion !== 'number') {
    return {
      valid: false,
      error: 'Backup file is missing a schema version.',
      code: 'malformed',
    }
  }

  if (schemaVersion !== BACKUP_SCHEMA_VERSION) {
    return {
      valid: false,
      error: `Backup schema version ${String(schemaVersion)} is not supported.`,
      code: 'unsupported-version',
    }
  }

  if (typeof data.exportedAt !== 'string' || !Number.isFinite(Date.parse(data.exportedAt))) {
    return {
      valid: false,
      error: 'Backup file is missing a valid export timestamp.',
      code: 'malformed',
    }
  }

  if (typeof data.appVersion !== 'string' || data.appVersion.trim().length === 0) {
    return {
      valid: false,
      error: 'Backup file is missing an app version.',
      code: 'malformed',
    }
  }

  if (!isRecord(data.data)) {
    return {
      valid: false,
      error: 'Backup file is missing its data section.',
      code: 'malformed',
    }
  }

  const backupData = data.data

  if (!isWorkoutHistory(backupData.workoutHistory)) {
    return {
      valid: false,
      error: 'Backup workout history data is invalid.',
      code: 'malformed',
    }
  }

  if (!isBodyMetricHistory(backupData.bodyMetrics)) {
    return {
      valid: false,
      error: 'Backup body composition data is invalid.',
      code: 'malformed',
    }
  }

  if (!isDailyCheckInHistory(backupData.dailyCheckIn)) {
    return {
      valid: false,
      error: 'Backup daily check-in data is invalid.',
      code: 'malformed',
    }
  }

  if (!isUserPreferences(backupData.preferences)) {
    return {
      valid: false,
      error: 'Backup preferences data is invalid.',
      code: 'malformed',
    }
  }

  if (
    backupData.workoutProgress !== null &&
    !isWorkoutProgress(backupData.workoutProgress)
  ) {
    return {
      valid: false,
      error: 'Backup workout progress data is invalid.',
      code: 'malformed',
    }
  }

  if (
    backupData.workoutSummary !== null &&
    !isWorkoutSummary(backupData.workoutSummary)
  ) {
    return {
      valid: false,
      error: 'Backup workout summary data is invalid.',
      code: 'malformed',
    }
  }

  return {
    valid: true,
    backup: data as SpsBackupPayload,
  }
}

export function parseBackupJson(text: string): BackupValidationResult {
  try {
    const parsed: unknown = JSON.parse(text)
    return validateBackupPayload(parsed)
  } catch {
    return {
      valid: false,
      error: 'Backup file is not valid JSON.',
      code: 'invalid-json',
    }
  }
}
