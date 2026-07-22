import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BodyMetricForm } from './BodyMetricForm'

describe('BodyMetricForm', () => {
  it('renders labels and saves a valid check-in', async () => {
    const user = userEvent.setup()
    const onSave = vi.fn()
    const onCancel = vi.fn()

    render(
      <BodyMetricForm
        entry={null}
        title="New Body Check-in"
        onSave={onSave}
        onCancel={onCancel}
      />,
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByLabelText(/Weight/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Body fat/i)).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Weight/i), '82.5')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        weightKg: 82.5,
        bodyFatPercent: null,
      }),
    )
  })

  it('shows validation messages for invalid values', async () => {
    const user = userEvent.setup()

    render(
      <BodyMetricForm
        entry={null}
        title="New Body Check-in"
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    )

    await user.type(screen.getByLabelText(/Weight/i), '400')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(screen.getByRole('alert')).toHaveTextContent(/Must be greater than 20/)
  })

  it('cancels without saving', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(
      <BodyMetricForm
        entry={null}
        title="New Body Check-in"
        onSave={vi.fn()}
        onCancel={onCancel}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
