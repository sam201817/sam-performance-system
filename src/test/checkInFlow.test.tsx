import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { completeDailyCheckIn } from './checkInHelpers'
import {
  findCheckInForDate,
  loadDailyCheckInHistory,
  saveDailyCheckInHistory,
} from '../utils/dailyCheckInStorage'

describe('daily check-in integration', () => {
  it('gates the dashboard until today check-in is completed', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByRole('heading', { name: '每日狀態' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '開始訓練' })).not.toBeInTheDocument()

    await completeDailyCheckIn(user)

    expect(screen.getByRole('button', { name: '開始訓練' })).toBeInTheDocument()
    expect(findCheckInForDate(loadDailyCheckInHistory())).not.toBeNull()
  })

  it('opens check-in for edit from dashboard readiness card', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    await user.click(screen.getByRole('button', { name: '更新狀態' }))
    expect(screen.getByRole('heading', { name: '每日狀態' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '取消' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(screen.getByRole('heading', { name: '今日狀態' })).toBeInTheDocument()
  })

  it('updates the same-day check-in without creating duplicates', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    await user.click(screen.getByRole('button', { name: '更新狀態' }))
    await user.click(screen.getByRole('button', { name: '動機 5' }))
    await user.click(screen.getByRole('button', { name: '更新狀態' }))

    expect(loadDailyCheckInHistory().entries).toHaveLength(1)
    expect(loadDailyCheckInHistory().entries[0].motivation).toBe(5)
  })

  it('requires daily check-in before starting a workout from bottom nav', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    const history = loadDailyCheckInHistory()
    saveDailyCheckInHistory({ version: history.version, entries: [] })

    await user.click(screen.getByRole('button', { name: '訓練' }))

    expect(screen.getByRole('heading', { name: '每日狀態' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '完成訓練' })).not.toBeInTheDocument()
  })
})
