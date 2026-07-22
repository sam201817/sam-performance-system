import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { loadHistory } from '../utils/workoutHistoryStorage'

describe('workout history integration', () => {
  it('opens history from progress tab after completing a workout', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(screen.getByRole('button', { name: '開始今日訓練' }))

    for (let step = 0; step < 6; step += 1) {
      await user.click(screen.getByRole('button', { name: '下一個' }))
      if (screen.queryByRole('button', { name: '仍要繼續' })) {
        await user.click(screen.getByRole('button', { name: '仍要繼續' }))
      }
    }

    await user.click(screen.getByRole('button', { name: '完成訓練' }))
    if (screen.queryByRole('button', { name: '仍要繼續' })) {
      await user.click(screen.getByRole('button', { name: '仍要繼續' }))
    }

    expect(screen.getByRole('heading', { name: '訓練完成' })).toBeInTheDocument()
    expect(loadHistory().sessions).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: '返回首頁' }))
    await user.click(screen.getByRole('button', { name: '進度' }))

    expect(screen.getByRole('heading', { name: 'Workout History' })).toBeInTheDocument()
    expect(screen.getByText('Total Workouts')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /全身基礎重建/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /全身基礎重建/i }))
    expect(screen.getByRole('heading', { level: 1, name: '全身基礎重建' })).toBeInTheDocument()
  })
})
