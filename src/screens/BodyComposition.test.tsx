import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BodyComposition } from './BodyComposition'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'

describe('BodyComposition screen', () => {
  it('renders empty state and opens the form', async () => {
    const user = userEvent.setup()

    render(
      <BodyComposition
        history={{ version: BODY_METRIC_VERSION, entries: [] }}
        activeTab="profile"
        onNavigate={vi.fn()}
        onSaveEntry={vi.fn()}
        onDeleteEntry={vi.fn()}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Body Composition' })).toBeInTheDocument()
    expect(screen.getByText(/No body check-ins yet/i)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Check-in Today' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
