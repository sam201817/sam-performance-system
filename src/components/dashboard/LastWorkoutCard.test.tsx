import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LastWorkoutCard } from './LastWorkoutCard'

describe('LastWorkoutCard', () => {
  it('shows empty state without history', () => {
    render(<LastWorkoutCard lastWorkout={null} onOpenSession={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Last Workout' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Your most recent session')
  })

  it('opens history detail when selected', async () => {
    const user = userEvent.setup()
    const onOpenSession = vi.fn()

    render(
      <LastWorkoutCard
        lastWorkout={{
          id: 'history-1',
          workoutName: '全身基礎重建',
          completedAt: '2026-07-22T10:00:00.000Z',
          durationMinutes: 55,
          totalVolume: 1200,
          completionPercentage: 86,
          averageRpe: 8,
        }}
        onOpenSession={onOpenSession}
      />,
    )

    await user.click(screen.getByRole('button', { name: /全身基礎重建/i }))
    expect(onOpenSession).toHaveBeenCalledWith('history-1')
    expect(screen.getByText('Good')).toBeInTheDocument()
    expect(screen.getByText('Volume')).toBeInTheDocument()
    expect(screen.getByText('Avg RPE')).toBeInTheDocument()
  })
})
