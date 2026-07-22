import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ReadinessCard } from './ReadinessCard'

describe('ReadinessCard', () => {
  it('renders today check-in summary and edit action', async () => {
    const user = userEvent.setup()
    const onEditCheckIn = vi.fn()

    render(
      <ReadinessCard
        summary={{
          score: 82,
          statusLabel: 'Ready to train',
          fatigue: 2,
          sleepQuality: 4,
          motivation: 4,
          muscleSoreness: 2,
          hasNote: true,
        }}
        onEditCheckIn={onEditCheckIn}
      />,
    )

    expect(screen.getByRole('heading', { name: "Today's Check-in" })).toBeInTheDocument()
    expect(screen.getByText('Ready to train')).toBeInTheDocument()
    expect(screen.getAllByText('4/5')).toHaveLength(2)
    expect(screen.getByText('Note saved')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Update Check-in' }))
    expect(onEditCheckIn).toHaveBeenCalledTimes(1)
  })
})
