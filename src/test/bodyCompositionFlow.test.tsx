import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { completeDailyCheckIn } from './checkInHelpers'
import { loadBodyMetricHistory } from '../utils/bodyMetricStorage'

describe('body composition integration', () => {
  it('opens body composition from profile tab and updates dashboard', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    await user.click(screen.getByRole('button', { name: '我的' }))
    await user.click(screen.getByRole('button', { name: /身體組成/i }))
    expect(screen.getByRole('heading', { name: '身體組成' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '新增今日量測' }))
    const dialog = screen.getByRole('dialog')
    await user.type(within(dialog).getByLabelText(/體重/i), '82')
    await user.type(within(dialog).getByLabelText(/體脂/i), '18')
    await user.click(within(dialog).getByRole('button', { name: '儲存' }))

    expect(loadBodyMetricHistory().entries).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: '首頁' }))
    expect(screen.getByText('82 kg')).toBeInTheDocument()
    expect(screen.getByText('18%')).toBeInTheDocument()
  })

  it('updates today entry without duplicating and supports delete', async () => {
    const user = userEvent.setup()

    render(<App />)
    await completeDailyCheckIn(user)

    await user.click(screen.getByRole('button', { name: '我的' }))
    await user.click(screen.getByRole('button', { name: /身體組成/i }))
    await user.click(screen.getByRole('button', { name: '新增今日量測' }))

    let dialog = screen.getByRole('dialog')
    await user.type(within(dialog).getByLabelText(/體重/i), '82')
    await user.click(within(dialog).getByRole('button', { name: '儲存' }))

    await user.click(screen.getByRole('button', { name: '更新今日量測' }))
    dialog = screen.getByRole('dialog')
    await user.clear(within(dialog).getByLabelText(/體重/i))
    await user.type(within(dialog).getByLabelText(/體重/i), '81')
    await user.click(within(dialog).getByRole('button', { name: '儲存' }))

    expect(loadBodyMetricHistory().entries).toHaveLength(1)
    expect(loadBodyMetricHistory().entries[0].weightKg).toBe(81)

    await user.click(screen.getByRole('button', { name: '刪除' }))
    await user.click(screen.getByRole('button', { name: '確認' }))

    expect(loadBodyMetricHistory().entries).toHaveLength(0)
  })
})
