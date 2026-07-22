import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BodyMetricHistoryCard } from './BodyMetricHistoryCard'
import { BODY_METRIC_VERSION } from '../../types/bodyMetrics'

describe('BodyMetricHistoryCard', () => {
  it('supports edit and inline delete confirmation', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()
    const onDelete = vi.fn()

    render(
      <BodyMetricHistoryCard
        entry={{
          id: 'entry-1',
          recordedAt: '2026-07-21T10:00:00.000Z',
          weightKg: 80,
          bodyFatPercent: 18,
          muscleMassKg: null,
          waistCm: null,
          notes: 'Recovery week',
          version: BODY_METRIC_VERSION,
        }}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    )

    expect(screen.getByText('Weight: 80 kg')).toBeInTheDocument()
    expect(screen.getByText('Recovery week')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit' }))
    expect(onEdit).toHaveBeenCalledWith('entry-1')

    await user.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByRole('status')).toHaveTextContent('Delete this check-in?')

    await user.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onDelete).toHaveBeenCalledWith('entry-1')
  })
})
