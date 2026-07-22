import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Profile } from './Profile'

describe('Profile screen', () => {
  it('renders profile links and navigates to settings and body composition', async () => {
    const user = userEvent.setup()
    const onOpenBodyComposition = vi.fn()
    const onOpenSettings = vi.fn()

    render(
      <Profile
        activeTab="profile"
        onNavigate={vi.fn()}
        onOpenBodyComposition={onOpenBodyComposition}
        onOpenSettings={onOpenSettings}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Body Composition/i }))
    expect(onOpenBodyComposition).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: /Settings/i }))
    expect(onOpenSettings).toHaveBeenCalledTimes(1)
  })
})
