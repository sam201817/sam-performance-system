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
    await user.click(screen.getByRole('button', { name: /Body Composition/i }))
    expect(screen.getByRole('heading', { name: 'Body Composition' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Check-in Today' }))
    const dialog = screen.getByRole('dialog')
    await user.type(within(dialog).getByLabelText(/Weight/i), '82')
    await user.type(within(dialog).getByLabelText(/Body fat/i), '18')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

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
    await user.click(screen.getByRole('button', { name: /Body Composition/i }))
    await user.click(screen.getByRole('button', { name: 'Add Check-in Today' }))

    let dialog = screen.getByRole('dialog')
    await user.type(within(dialog).getByLabelText(/Weight/i), '82')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    await user.click(screen.getByRole('button', { name: 'Update Today' }))
    dialog = screen.getByRole('dialog')
    await user.clear(within(dialog).getByLabelText(/Weight/i))
    await user.type(within(dialog).getByLabelText(/Weight/i), '81')
    await user.click(within(dialog).getByRole('button', { name: 'Save' }))

    expect(loadBodyMetricHistory().entries).toHaveLength(1)
    expect(loadBodyMetricHistory().entries[0].weightKg).toBe(81)

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    await user.click(screen.getByRole('button', { name: 'Confirm' }))

    expect(loadBodyMetricHistory().entries).toHaveLength(0)
  })
})
