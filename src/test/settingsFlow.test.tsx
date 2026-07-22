import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { createValidBackup } from './backupFixtures'
import { completeDailyCheckIn } from './checkInHelpers'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import { WORKOUT_HISTORY_VERSION } from '../types/workoutHistory'
import { loadPreferences } from '../utils/preferencesStorage'
import { loadHistory } from '../utils/workoutHistoryStorage'

describe('settings flow', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  async function openSettings(user: ReturnType<typeof userEvent.setup>) {
    await completeDailyCheckIn(user)
    await user.click(screen.getByRole('button', { name: '我的' }))
    await user.click(screen.getByRole('button', { name: /設定/i }))
    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument()
  }

  it('refreshes app state after restore', async () => {
    const user = userEvent.setup()
    localStorage.setItem(SPS_STORAGE_KEYS.bodyMetrics, JSON.stringify({
      version: BODY_METRIC_VERSION,
      entries: [{
        id: 'old-body',
        recordedAt: '2026-07-20T08:00:00.000Z',
        weightKg: 90,
        bodyFatPercent: null,
        muscleMassKg: null,
        waistCm: null,
        notes: null,
        version: BODY_METRIC_VERSION,
      }],
    }))

    render(<App />)
    await openSettings(user)

    const backup = createValidBackup()
    backup.data.bodyMetrics.entries = [{
      id: 'restored-body',
      recordedAt: '2026-07-22T08:00:00.000Z',
      weightKg: 75,
      bodyFatPercent: null,
      muscleMassKg: null,
      waistCm: null,
      notes: null,
      version: BODY_METRIC_VERSION,
    }]

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([JSON.stringify(backup)], 'sps-backup-2026-07-22.json', {
      type: 'application/json',
    })

    await user.upload(fileInput, file)
    await user.click(screen.getByRole('button', { name: '還原備份' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/備份還原成功/i)
    })

    await user.click(screen.getByRole('button', { name: '返回' }))
    await user.click(screen.getByRole('button', { name: /身體組成/i }))
    expect(screen.getByText('體重: 75 kg')).toBeInTheDocument()
  })

  it('returns to first-use state after reset', async () => {
    const user = userEvent.setup()

    render(<App />)
    await openSettings(user)

    await user.click(screen.getByRole('button', { name: '重設所有資料' }))
    await user.click(screen.getByRole('button', { name: '繼續' }))
    await user.click(screen.getByRole('button', { name: '是的，刪除所有資料' }))

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /每日狀態/i })).toBeInTheDocument()
    })

    expect(loadHistory().sessions).toHaveLength(0)
    expect(loadPreferences().weightUnit).toBe('metric')
  })

  it('exports backup from settings', async () => {
    const user = userEvent.setup()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    render(<App />)
    await openSettings(user)
    await user.click(screen.getByRole('button', { name: '匯出完整備份' }))

    expect(screen.getByText(/已匯出備份 sps-backup-/i)).toBeInTheDocument()
    expect(click).toHaveBeenCalled()

    click.mockRestore()
  })

  it('cancels restore confirmation without applying backup', async () => {
    const user = userEvent.setup()
    localStorage.setItem(SPS_STORAGE_KEYS.bodyMetrics, JSON.stringify({
      version: BODY_METRIC_VERSION,
      entries: [{
        id: 'keep-body',
        recordedAt: '2026-07-22T08:00:00.000Z',
        weightKg: 88,
        bodyFatPercent: null,
        muscleMassKg: null,
        waistCm: null,
        notes: null,
        version: BODY_METRIC_VERSION,
      }],
    }))

    render(<App />)
    await openSettings(user)

    const backup = createValidBackup()
    backup.data.bodyMetrics.entries = [{
      id: 'would-restore',
      recordedAt: '2026-07-22T08:00:00.000Z',
      weightKg: 75,
      bodyFatPercent: null,
      muscleMassKg: null,
      waistCm: null,
      notes: null,
      version: BODY_METRIC_VERSION,
    }]

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    await user.upload(fileInput, new File([JSON.stringify(backup)], 'backup.json', {
      type: 'application/json',
    }))

    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(screen.queryByRole('dialog', { name: '還原備份？' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '返回' }))
    await user.click(screen.getByRole('button', { name: /身體組成/i }))
    expect(screen.getByText('體重: 88 kg')).toBeInTheDocument()
  })

  it('shows invalid backup feedback without changing data', async () => {
    const user = userEvent.setup()
    localStorage.setItem(SPS_STORAGE_KEYS.workoutHistory, JSON.stringify({
      version: WORKOUT_HISTORY_VERSION,
      sessions: [{
        id: 'keep-me',
        sessionId: 'full-body-rebuild-v1',
        workoutName: 'Keep',
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

    render(<App />)
    await openSettings(user)

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File(['{bad-json'], 'broken.json', { type: 'application/json' })
    await user.upload(fileInput, file)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/不是有效的 JSON/i)
    })

    expect(loadHistory().sessions[0]?.id).toBe('keep-me')
  })
})
