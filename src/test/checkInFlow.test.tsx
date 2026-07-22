import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { completeDailyCheckIn } from './checkInHelpers'
import { findCheckInForDate, loadDailyCheckInHistory } from '../utils/dailyCheckInStorage'

describe('daily check-in integration', () => {
  it('gates the dashboard until today check-in is completed', async () => {
    const user = userEvent.setup()

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Daily Check-in' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Start Workout' })).not.toBeInTheDocument()

    await completeDailyCheckIn(user)

    expect(screen.getByRole('button', { name: 'Start Workout' })).toBeInTheDocument()
    expect(findCheckInForDate(loadDailyCheckInHistory())).not.toBeNull()
  })

  it('opens check-in for edit from dashboard readiness card', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    await user.click(screen.getByRole('button', { name: 'Update Check-in' }))
    expect(screen.getByRole('heading', { name: 'Daily Check-in' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getByRole('heading', { name: "Today's Check-in" })).toBeInTheDocument()
  })

  it('updates the same-day check-in without creating duplicates', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    await user.click(screen.getByRole('button', { name: 'Update Check-in' }))
    await user.click(screen.getByRole('button', { name: 'Motivation 5' }))
    await user.click(screen.getByRole('button', { name: 'Update Check-in' }))

    expect(loadDailyCheckInHistory().entries).toHaveLength(1)
    expect(loadDailyCheckInHistory().entries[0].motivation).toBe(5)
  })
})
