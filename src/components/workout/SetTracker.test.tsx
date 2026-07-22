import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { createExerciseLog } from '../../utils/workoutProgressFactory'
import { TODAY_WORKOUT } from '../../data/todayWorkout'
import { SetTracker } from './SetTracker'

describe('SetTracker', () => {
  it('renders set rows and completion summary', () => {
    const exerciseLog = createExerciseLog(TODAY_WORKOUT.exercises[0])

    render(
      <SetTracker
        exerciseLog={exerciseLog}
        onExerciseLogChange={() => undefined}
        onSetComplete={() => undefined}
      />,
    )

    expect(screen.getByLabelText('組數紀錄')).toBeInTheDocument()
    expect(screen.getByText('0 / 3')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: '完成組數' })).toHaveLength(3)
  })

  it('calls onSetComplete when a set is completed', async () => {
    const user = userEvent.setup()
    const onSetComplete = vi.fn()
    const exerciseLog = createExerciseLog(TODAY_WORKOUT.exercises[0])

    render(
      <SetTracker
        exerciseLog={exerciseLog}
        onExerciseLogChange={() => undefined}
        onSetComplete={onSetComplete}
      />,
    )

    await user.click(screen.getAllByRole('button', { name: '完成組數' })[0])
    expect(onSetComplete).toHaveBeenCalledTimes(1)
  })
})
