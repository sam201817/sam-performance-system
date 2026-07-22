import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TODAY_WORKOUT } from '../../data/todayWorkout'
import { HeroWorkoutCard } from './HeroWorkoutCard'

describe('HeroWorkoutCard', () => {
  it('shows start workout for a fresh session', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()

    render(
      <HeroWorkoutCard
        session={TODAY_WORKOUT}
        workoutStatus="idle"
        hasWorkoutHistory={false}
        onStartWorkout={onStart}
      />,
    )

    expect(screen.getByRole('heading', { name: TODAY_WORKOUT.title })).toBeInTheDocument()
    expect(screen.getByText(/7 exercises/)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Start your first workout')

    await user.click(screen.getByRole('button', { name: 'Start Workout' }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })

  it('shows resume workout when session is active', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()

    render(
      <HeroWorkoutCard
        session={TODAY_WORKOUT}
        workoutStatus="active"
        hasWorkoutHistory
        onStartWorkout={onStart}
      />,
    )

    expect(screen.getByRole('button', { name: 'Resume Workout' })).toBeInTheDocument()
    expect(screen.getByText(/Workout in progress/)).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: /Welcome to SPS/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Resume Workout' }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
