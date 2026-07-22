import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DailyCheckIn } from './DailyCheckIn'

describe('DailyCheckIn screen', () => {
  it('submits a new daily check-in', async () => {
    const user = userEvent.setup()
    const onSaveEntry = vi.fn()

    render(
      <DailyCheckIn
        history={{ version: 1, entries: [] }}
        allowCancel={false}
        onSaveEntry={onSaveEntry}
        onCancel={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Daily Check-in' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Fatigue 3' }))
    await user.click(screen.getByRole('button', { name: 'Sleep quality 4' }))
    await user.click(screen.getByRole('button', { name: 'Motivation 5' }))
    await user.click(screen.getByRole('button', { name: 'Muscle soreness 2' }))
    await user.click(screen.getByRole('button', { name: 'Save & Continue' }))

    expect(onSaveEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        fatigue: 3,
        sleepQuality: 4,
        motivation: 5,
        muscleSoreness: 2,
      }),
      null,
    )
  })

  it('allows cancel when editing from dashboard', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <DailyCheckIn
        history={{
          version: 1,
          entries: [{
            id: 'entry-1',
            recordedAt: new Date().toISOString(),
            fatigue: 3,
            sleepQuality: 4,
            motivation: 4,
            muscleSoreness: 2,
            notes: null,
            version: 1,
          }],
        }}
        allowCancel
        onSaveEntry={vi.fn()}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
