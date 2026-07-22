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

    expect(screen.getByRole('heading', { name: '身體組成' })).toBeInTheDocument()
    expect(screen.getAllByText(/尚無量測資料/i).length).toBeGreaterThanOrEqual(1)

    await user.click(screen.getByRole('button', { name: '新增今日量測' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
