import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(
      <EmptyState
        icon="workout"
        title="No workouts yet"
        description="Complete your first session."
      />,
    )

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No workouts yet' })).toBeInTheDocument()
    expect(screen.getByText('Complete your first session.')).toBeInTheDocument()
  })

  it('renders optional action button', async () => {
    const user = userEvent.setup()
    const onAction = vi.fn()

    render(
      <EmptyState
        icon="body"
        title="No data"
        description="Add a check-in."
        actionLabel="Add check-in"
        onAction={onAction}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Add check-in' }))
    expect(onAction).toHaveBeenCalledTimes(1)
  })
})
