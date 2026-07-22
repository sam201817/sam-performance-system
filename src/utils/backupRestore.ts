import type { RestoreResult, SpsBackupPayload } from '../types/backup'
import { collectBackupData } from './backupData'
import { parseBackupJson, validateBackupPayload } from './backupValidation'
import { saveDailyCheckInHistory } from './dailyCheckInStorage'
import { saveBodyMetricHistory } from './bodyMetricStorage'
import { savePreferences } from './preferencesStorage'
import { saveHistory } from './workoutHistoryStorage'
import {
  clearWorkoutProgress,
  clearWorkoutSummary,
  saveWorkoutProgress,
  saveWorkoutSummary,
} from './workoutProgressStorage'
import type { SpsBackupData } from '../types/backup'

export function applyBackupData(data: SpsBackupData): void {
  saveHistory(data.workoutHistory)
  saveBodyMetricHistory(data.bodyMetrics)
  saveDailyCheckInHistory(data.dailyCheckIn)
  savePreferences(data.preferences)

  if (data.workoutProgress) {
    saveWorkoutProgress(data.workoutProgress)
  } else {
    clearWorkoutProgress()
  }

  if (data.workoutSummary) {
    saveWorkoutSummary(data.workoutSummary)
  } else {
    clearWorkoutSummary()
  }
}

export function restoreSpsBackup(backup: SpsBackupPayload): RestoreResult {
  const validation = validateBackupPayload(backup)
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      code: validation.code,
    }
  }

  const snapshot = collectBackupData()

  try {
    applyBackupData(validation.backup.data)
    return { success: true }
  } catch {
    try {
      applyBackupData(snapshot)
    } catch {
      /* best-effort rollback */
    }

    return {
      success: false,
      error: 'Restore failed. Your existing data was preserved.',
      code: 'restore-failed',
    }
  }
}

export async function restoreSpsBackupFromText(text: string): Promise<RestoreResult> {
  const parsed = parseBackupJson(text)
  if (!parsed.valid) {
    return {
      success: false,
      error: parsed.error,
      code: parsed.code,
    }
  }

  return restoreSpsBackup(parsed.backup)
}

export async function restoreSpsBackupFromFile(file: File): Promise<RestoreResult> {
  const text = await file.text()
  return restoreSpsBackupFromText(text)
}
