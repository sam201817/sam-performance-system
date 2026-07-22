import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BottomNav } from './BottomNav'

describe('BottomNav', () => {
  it('navigates enabled tabs and blocks disabled tabs', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    render(<BottomNav activeTab="home" onNavigate={onNavigate} />)

    await user.click(screen.getByRole('button', { name: '首頁' }))
    expect(onNavigate).toHaveBeenCalledWith('home')

    await user.click(screen.getByRole('button', { name: '訓練' }))
    expect(onNavigate).toHaveBeenCalledWith('workout')

    const progressTab = screen.getByRole('button', { name: '進度' })
    expect(progressTab).toBeDisabled()
    expect(progressTab).toHaveAttribute('aria-disabled', 'true')

    await user.click(progressTab)
    expect(onNavigate).toHaveBeenCalledTimes(2)
  })
})
