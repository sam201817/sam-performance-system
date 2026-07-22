import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BodyCompositionDashboardCard } from './BodyCompositionDashboardCard'

const emptySummary = {
  latestWeightKg: null,
  previousWeightKg: null,
  weightChangeKg: null,
  latestBodyFatPercent: null,
  previousBodyFatPercent: null,
  bodyFatChangePercent: null,
  latestMuscleMassKg: null,
  previousMuscleMassKg: null,
  muscleMassChangeKg: null,
  latestWaistCm: null,
  previousWaistCm: null,
  waistChangeCm: null,
  lastUpdatedAt: null,
}

describe('BodyCompositionDashboardCard', () => {
  it('invites first check-in without entries', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()

    render(
      <BodyCompositionDashboardCard
        summary={emptySummary}
        hasEntries={false}
        daysSinceUpdate={null}
        onOpenBodyComposition={onOpen}
      />,
    )

    await user.click(screen.getByRole('button', { name: '新增第一次量測' }))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('shows subtle reminder when data is older than 7 days', () => {
    render(
      <BodyCompositionDashboardCard
        summary={{
          ...emptySummary,
          latestWeightKg: 80,
          latestBodyFatPercent: 18,
          lastUpdatedAt: '2026-07-10T10:00:00.000Z',
        }}
        hasEntries
        daysSinceUpdate={8}
        onOpenBodyComposition={vi.fn()}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('更新量測')
    expect(screen.getByText('80 kg')).toBeInTheDocument()
    expect(screen.getByText('8 天前')).toBeInTheDocument()
  })

  it('does not show reminder within 7 days', () => {
    render(
      <BodyCompositionDashboardCard
        summary={{
          ...emptySummary,
          latestWeightKg: 80,
          latestBodyFatPercent: 18,
          lastUpdatedAt: '2026-07-20T10:00:00.000Z',
        }}
        hasEntries
        daysSinceUpdate={2}
        onOpenBodyComposition={vi.fn()}
      />,
    )

    expect(screen.queryByText('更新量測')).not.toBeInTheDocument()
  })
})
