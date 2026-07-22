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
    expect(screen.getByText(/7 個動作/)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('完成第一次訓練')

    await user.click(screen.getByRole('button', { name: '開始訓練' }))
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

    expect(screen.getByRole('button', { name: '繼續訓練' })).toBeInTheDocument()
    expect(screen.getByText(/訓練進行中/)).toBeInTheDocument()
    expect(screen.queryByRole('status', { name: /Welcome to SPS/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '繼續訓練' }))
    expect(onStart).toHaveBeenCalledTimes(1)
  })
})
