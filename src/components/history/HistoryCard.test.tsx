import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { HistoryCard } from './HistoryCard'
import { buildHistorySession } from '../../utils/workoutHistoryFactory'
import { createWorkoutProgress } from '../../utils/workoutProgressFactory'
import { TODAY_WORKOUT } from '../../data/todayWorkout'

describe('HistoryCard', () => {
  it('renders session details and supports keyboard activation', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()
    const session = buildHistorySession(
      {
        ...createWorkoutProgress(TODAY_WORKOUT),
        completedAt: '2026-07-21T10:00:00.000Z',
      },
      TODAY_WORKOUT,
      'history-card-1',
    )

    render(<HistoryCard session={session} onOpen={onOpen} />)

    const card = screen.getByRole('button', { name: /全身基礎重建/i })
    expect(card).toHaveAccessibleName()
    expect(screen.getByText('已完成')).toBeInTheDocument()

    await user.click(card)
    expect(onOpen).toHaveBeenCalledWith('history-card-1')
  })
})
