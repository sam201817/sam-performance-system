import { APP_METADATA } from '../data/appMetadata'
import {
  BACKUP_SCHEMA_VERSION,
  type SpsBackupData,
  type SpsBackupPayload,
} from '../types/backup'
import { loadDailyCheckInHistory } from './dailyCheckInStorage'
import { loadBodyMetricHistory } from './bodyMetricStorage'
import { loadPreferences } from './preferencesStorage'
import { loadHistory } from './workoutHistoryStorage'
import { loadRawWorkoutProgress, loadWorkoutSummary } from './workoutProgressStorage'

export function collectBackupData(): SpsBackupData {
  return {
    workoutHistory: loadHistory(),
    bodyMetrics: loadBodyMetricHistory(),
    dailyCheckIn: loadDailyCheckInHistory(),
    preferences: loadPreferences(),
    workoutProgress: loadRawWorkoutProgress(),
    workoutSummary: loadWorkoutSummary(),
  }
}

export function buildBackupPayload(): SpsBackupPayload {
  return {
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    appVersion: APP_METADATA.version,
    data: collectBackupData(),
  }
}

export function serializeBackup(payload: SpsBackupPayload): string {
  return JSON.stringify(payload, null, 2)
}

export function formatBackupFilename(date = new Date()): string {
  const dateKey = date.toISOString().slice(0, 10)
  return `sps-backup-${dateKey}.json`
}

export function downloadJsonFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

export function downloadBackup(payload: SpsBackupPayload = buildBackupPayload()): string {
  const filename = formatBackupFilename(new Date(payload.exportedAt))
  downloadJsonFile(filename, serializeBackup(payload))
  return filename
}
