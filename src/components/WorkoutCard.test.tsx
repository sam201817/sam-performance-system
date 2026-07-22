import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import { WorkoutCard } from './WorkoutCard'

describe('WorkoutCard', () => {
  it('shows start state when no active workout', () => {
    render(
      <WorkoutCard
        session={TODAY_WORKOUT}
        workoutStatus="idle"
        onStartWorkout={() => undefined}
      />,
    )

    expect(screen.getByRole('button', { name: '開始今日訓練' })).toBeEnabled()
  })

  it('shows resume state when workout is active', async () => {
    const user = userEvent.setup()
    const onStartWorkout = vi.fn()

    render(
      <WorkoutCard
        session={TODAY_WORKOUT}
        workoutStatus="active"
        onStartWorkout={onStartWorkout}
      />,
    )

    const button = screen.getByRole('button', { name: '繼續訓練' })
    expect(button).toBeEnabled()
    await user.click(button)
    expect(onStartWorkout).toHaveBeenCalledTimes(1)
  })
})
