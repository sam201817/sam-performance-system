import {
  BACKUP_SCHEMA_VERSION,
  type BackupValidationResult,
  type SpsBackupPayload,
} from '../types/backup'
import { DEFAULT_LANGUAGE, translate } from '../i18n'
import { isDailyCheckInHistory } from './dailyCheckInStorage'
import { isBodyMetricHistory } from './bodyMetricStorage'
import { isUserPreferences } from './preferencesStorage'
import { isWorkoutHistory } from './workoutHistoryStorage'
import { isWorkoutProgress, isWorkoutSummary } from './workoutProgressStorage'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export const BACKUP_VALIDATION_ERROR_KEYS = {
  invalidJson: 'errors.invalidBackup',
  notObject: 'errors.malformedBackup',
  missingSchema: 'errors.missingSchema',
  unsupportedSchema: 'errors.unsupportedSchema',
  missingTimestamp: 'errors.missingTimestamp',
  missingAppVersion: 'errors.missingAppVersion',
  missingData: 'errors.missingData',
  invalidWorkoutHistory: 'errors.invalidWorkoutHistory',
  invalidBodyMetrics: 'errors.invalidBodyMetrics',
  invalidDailyCheckIn: 'errors.invalidDailyCheckIn',
  invalidPreferences: 'errors.invalidPreferences',
  invalidWorkoutProgress: 'errors.invalidWorkoutProgress',
  invalidWorkoutSummary: 'errors.invalidWorkoutSummary',
} as const

export const ERROR_MESSAGE_KEYS = {
  'invalid-json': BACKUP_VALIDATION_ERROR_KEYS.invalidJson,
  malformed: BACKUP_VALIDATION_ERROR_KEYS.notObject,
  'unsupported-version': BACKUP_VALIDATION_ERROR_KEYS.unsupportedSchema,
} as const satisfies Record<
  Extract<BackupValidationResult, { valid: false }>['code'],
  string
>

function backupError(
  key: (typeof BACKUP_VALIDATION_ERROR_KEYS)[keyof typeof BACKUP_VALIDATION_ERROR_KEYS],
  params?: Record<string, string | number>,
): string {
  return translate(DEFAULT_LANGUAGE, key, params)
}

export function validateBackupPayload(data: unknown): BackupValidationResult {
  if (!isRecord(data)) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.notObject),
      code: 'malformed',
    }
  }

  const schemaVersion = data.schemaVersion
  if (typeof schemaVersion !== 'number') {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.missingSchema),
      code: 'malformed',
    }
  }

  if (schemaVersion !== BACKUP_SCHEMA_VERSION) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.unsupportedSchema, {
        version: String(schemaVersion),
      }),
      code: 'unsupported-version',
    }
  }

  if (typeof data.exportedAt !== 'string' || !Number.isFinite(Date.parse(data.exportedAt))) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.missingTimestamp),
      code: 'malformed',
    }
  }

  if (typeof data.appVersion !== 'string' || data.appVersion.trim().length === 0) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.missingAppVersion),
      code: 'malformed',
    }
  }

  if (!isRecord(data.data)) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.missingData),
      code: 'malformed',
    }
  }

  const backupData = data.data

  if (!isWorkoutHistory(backupData.workoutHistory)) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.invalidWorkoutHistory),
      code: 'malformed',
    }
  }

  if (!isBodyMetricHistory(backupData.bodyMetrics)) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.invalidBodyMetrics),
      code: 'malformed',
    }
  }

  if (!isDailyCheckInHistory(backupData.dailyCheckIn)) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.invalidDailyCheckIn),
      code: 'malformed',
    }
  }

  if (!isUserPreferences(backupData.preferences)) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.invalidPreferences),
      code: 'malformed',
    }
  }

  if (
    backupData.workoutProgress !== null &&
    !isWorkoutProgress(backupData.workoutProgress)
  ) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.invalidWorkoutProgress),
      code: 'malformed',
    }
  }

  if (
    backupData.workoutSummary !== null &&
    !isWorkoutSummary(backupData.workoutSummary)
  ) {
    return {
      valid: false,
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.invalidWorkoutSummary),
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
      error: backupError(BACKUP_VALIDATION_ERROR_KEYS.invalidJson),
      code: 'invalid-json',
    }
  }
}
