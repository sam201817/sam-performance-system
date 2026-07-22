import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { WorkoutHistoryDetail } from './WorkoutHistoryDetail'
import { buildHistorySession } from '../utils/workoutHistoryFactory'
import { createWorkoutProgress, updateExerciseLog } from '../utils/workoutProgressFactory'
import { TODAY_WORKOUT } from '../data/todayWorkout'

describe('WorkoutHistoryDetail', () => {
  it('renders read-only workout and exercise details', async () => {
    const user = userEvent.setup()
    const onBack = vi.fn()

    let progress = createWorkoutProgress(TODAY_WORKOUT)
    progress = updateExerciseLog(progress, TODAY_WORKOUT.exercises[0].id, (log) => ({
      ...log,
      sets: log.sets.map((set, index) =>
        index === 0
          ? { ...set, actualReps: '10', weight: '24 kg', rpe: 8, completed: true }
          : set,
      ),
    }))

    const session = buildHistorySession(
      { ...progress, completedAt: '2026-07-21T10:00:00.000Z' },
      TODAY_WORKOUT,
      'history-detail-1',
    )

    render(<WorkoutHistoryDetail session={session} onBack={onBack} />)

    expect(screen.getByRole('heading', { level: 1, name: TODAY_WORKOUT.title })).toBeInTheDocument()
    const exerciseHeading = screen.getByRole('heading', {
      level: 2,
      name: TODAY_WORKOUT.exercises[0].name,
    })
    const exerciseCard = exerciseHeading.closest('article')
    expect(exerciseCard).not.toBeNull()
    expect(within(exerciseCard as HTMLElement).getByText('Completed')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '返回訓練紀錄' }))
    expect(onBack).toHaveBeenCalledTimes(1)
  })
})
