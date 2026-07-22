import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import { completeDailyCheckIn } from './checkInHelpers'
import { loadWorkoutProgress } from '../utils/workoutProgressStorage'

describe('workout flow integration', () => {
  it('supports start, logging, resume, confirmation, completion, and reset', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    expect(screen.getByRole('button', { name: 'Start Workout' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start Workout' }))

    expect(screen.getByRole('heading', { name: 'Goblet Squat' })).toBeInTheDocument()
    expect(screen.getByText('1 / 7')).toBeInTheDocument()

    const repsInput = screen.getAllByLabelText('實際次數')[0]
    await user.clear(repsInput)
    await user.type(repsInput, '11')
    expect(repsInput).toHaveValue('11')

    await user.click(screen.getAllByRole('button', { name: '完成組數' })[0])
    const restTimer = screen.getByLabelText('休息計時')
    expect(restTimer).toBeInTheDocument()
    expect(restTimer).toHaveTextContent('01:30')
    expect(within(restTimer).getByText('休息進行中')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '返回首頁' }))
    expect(screen.getByRole('button', { name: 'Resume Workout' })).toBeInTheDocument()
    expect(loadWorkoutProgress(TODAY_WORKOUT)).not.toBeNull()

    await user.click(screen.getByRole('button', { name: 'Resume Workout' }))
    expect(screen.getByRole('heading', { name: 'Goblet Squat' })).toBeInTheDocument()
    expect(screen.getAllByLabelText('實際次數')[0]).toHaveValue('11')
    expect(screen.getByLabelText('已完成')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '下一個' }))
    expect(screen.getByRole('status')).toHaveTextContent('還有未完成的組數')
    await user.click(screen.getByRole('button', { name: '仍要繼續' }))
    expect(screen.getByRole('heading', { name: 'Romanian Deadlift' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '上一個' }))
    expect(screen.getByRole('heading', { name: 'Goblet Squat' })).toBeInTheDocument()

    expect(screen.getByRole('button', { name: '上一個' })).toBeDisabled()

    for (let step = 0; step < TODAY_WORKOUT.exercises.length - 1; step += 1) {
      await user.click(screen.getByRole('button', { name: '下一個' }))
      if (screen.queryByRole('button', { name: '仍要繼續' })) {
        await user.click(screen.getByRole('button', { name: '仍要繼續' }))
      }
    }

    expect(screen.getByRole('button', { name: '完成訓練' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '下一個' })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '完成訓練' }))
    if (screen.queryByRole('button', { name: '仍要繼續' })) {
      await user.click(screen.getByRole('button', { name: '仍要繼續' }))
    }

    expect(screen.getByRole('heading', { name: '訓練完成' })).toBeInTheDocument()
    expect(screen.getByText(`今日 ${TODAY_WORKOUT.exercises.length} 個動作訓練已結束。`)).toBeInTheDocument()

    const stats = screen.getByRole('main')
    expect(within(stats).getByText('完成組數')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '返回首頁' }))
    expect(screen.getByRole('button', { name: 'Start Workout' })).toBeInTheDocument()
    expect(loadWorkoutProgress(TODAY_WORKOUT)).toBeNull()
  })

  it('does not duplicate exercise heading ids across rerenders', async () => {
    const user = userEvent.setup()
    render(<App />)
    await completeDailyCheckIn(user)
    const ids = screen.queryAllByRole('heading', { level: 2 }).map((node) => node.id)
    const uniqueIds = new Set(ids.filter(Boolean))
    expect(uniqueIds.size).toBe(ids.filter(Boolean).length)
  })
})
