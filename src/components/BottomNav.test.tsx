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
    expect(progressTab).toBeEnabled()
    await user.click(progressTab)
    expect(onNavigate).toHaveBeenCalledWith('progress')

    const profileTab = screen.getByRole('button', { name: '我的' })
    expect(profileTab).toBeEnabled()
    await user.click(profileTab)
    expect(onNavigate).toHaveBeenCalledWith('profile')
    expect(onNavigate).toHaveBeenCalledTimes(4)
  })
})
