import { describe, expect, it } from 'vitest'
import { translate } from '../i18n'
import { createValidBackup } from '../test/backupFixtures'
import {
  BACKUP_VALIDATION_ERROR_KEYS,
  ERROR_MESSAGE_KEYS,
  parseBackupJson,
  validateBackupPayload,
} from './backupValidation'

describe('backupValidation', () => {
  it('accepts a valid backup payload', () => {
    const backup = createValidBackup()
    expect(validateBackupPayload(backup)).toEqual({
      valid: true,
      backup,
    })
  })

  it('rejects malformed JSON', () => {
    expect(parseBackupJson('{not-json')).toEqual({
      valid: false,
      error: translate('zh-TW', ERROR_MESSAGE_KEYS['invalid-json']),
      code: 'invalid-json',
    })
  })

  it('rejects malformed backup objects', () => {
    expect(validateBackupPayload({ schemaVersion: 1 })).toMatchObject({
      valid: false,
      code: 'malformed',
    })
  })

  it('rejects unsupported schema versions', () => {
    const backup = createValidBackup({ schemaVersion: 99 as never })
    expect(validateBackupPayload(backup)).toEqual({
      valid: false,
      error: translate('zh-TW', BACKUP_VALIDATION_ERROR_KEYS.unsupportedSchema, {
        version: '99',
      }),
      code: 'unsupported-version',
    })
  })

  it('rejects invalid nested workout history', () => {
    const backup = createValidBackup()
    backup.data.workoutHistory = { version: 1, sessions: 'bad' } as never

    expect(validateBackupPayload(backup)).toMatchObject({
      valid: false,
      code: 'malformed',
    })
  })

  it('rejects invalid body metrics, check-ins, preferences, and workout state', () => {
    const invalidCases = [
      { field: 'bodyMetrics', value: { version: 1, entries: 'bad' } },
      { field: 'dailyCheckIn', value: { version: 1, entries: 'bad' } },
      { field: 'preferences', value: { weightUnit: 'metric' } },
      { field: 'workoutProgress', value: { sessionId: 1 } },
      { field: 'workoutSummary', value: { totalExercises: 'x' } },
    ] as const

    for (const testCase of invalidCases) {
      const backup = createValidBackup()
      backup.data = {
        ...backup.data,
        [testCase.field]: testCase.value,
      } as typeof backup.data

      expect(validateBackupPayload(backup).valid).toBe(false)
    }
  })

  it('rejects backups missing export metadata', () => {
    expect(validateBackupPayload(createValidBackup({ exportedAt: 'invalid-date' }))).toMatchObject({
      valid: false,
      code: 'malformed',
    })
    expect(validateBackupPayload(createValidBackup({ appVersion: '' }))).toMatchObject({
      valid: false,
      code: 'malformed',
    })
  })
})
