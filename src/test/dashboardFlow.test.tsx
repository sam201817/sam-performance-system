import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { completeDailyCheckIn } from './checkInHelpers'

describe('dashboard flow integration', () => {
  it('opens last workout detail from dashboard and returns to dashboard', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    await user.click(screen.getByRole('button', { name: 'Start Workout' }))

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

    await user.click(screen.getByRole('button', { name: '返回首頁' }))

    expect(screen.getByRole('heading', { name: 'Last Workout' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Quick Stats' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /全身基礎重建/i }))
    expect(screen.getByRole('heading', { level: 1, name: '全身基礎重建' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '返回訓練紀錄' }))
    expect(screen.getByRole('button', { name: 'Start Workout' })).toBeInTheDocument()
  })
})
