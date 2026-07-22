import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { History } from './History'
import { buildHistorySession } from '../utils/workoutHistoryFactory'
import { createWorkoutProgress } from '../utils/workoutProgressFactory'
import { TODAY_WORKOUT } from '../data/todayWorkout'

describe('History screen', () => {
  it('renders statistics and session cards', async () => {
    const user = userEvent.setup()
    const onOpenSession = vi.fn()
    const session = buildHistorySession(
      {
        ...createWorkoutProgress(TODAY_WORKOUT),
        completedAt: '2026-07-21T10:00:00.000Z',
      },
      TODAY_WORKOUT,
      'history-screen-1',
    )

    render(
      <History
        sessions={[session]}
        statistics={{
          totalWorkouts: 1,
          totalVolume: session.totalVolume,
          averageDurationMinutes: session.durationMinutes,
          currentStreak: 1,
        }}
        activeTab="progress"
        onNavigate={vi.fn()}
        onOpenSession={onOpenSession}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Workout History' })).toBeInTheDocument()
    expect(screen.getByText('Total Workouts')).toBeInTheDocument()
    expect(screen.getByText('Total Volume')).toBeInTheDocument()
    expect(screen.getByText('Average Duration')).toBeInTheDocument()
    expect(screen.getByText('Current Streak')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /全身基礎重建/i }))
    expect(onOpenSession).toHaveBeenCalledWith('history-screen-1')
  })

  it('renders an empty state when no sessions exist', () => {
    render(
      <History
        sessions={[]}
        statistics={{
          totalWorkouts: 0,
          totalVolume: 0,
          averageDurationMinutes: null,
          currentStreak: 0,
        }}
        activeTab="progress"
        onNavigate={vi.fn()}
        onOpenSession={vi.fn()}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('No completed workouts yet')
  })
})
