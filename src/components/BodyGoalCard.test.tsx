import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { BodyGoalCard } from './BodyGoalCard'

describe('BodyGoalCard', () => {
  it('shows invitation state without entries', async () => {
    const user = userEvent.setup()
    const onOpen = vi.fn()

    render(
      <BodyGoalCard
        summary={{
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
        }}
        hasEntries={false}
        onOpenBodyComposition={onOpen}
      />,
    )

    expect(screen.getByRole('heading', { name: '身體組成' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '新增第一次量測' }))
    expect(onOpen).toHaveBeenCalledTimes(1)
  })

  it('shows latest metrics when entries exist', () => {
    render(
      <BodyGoalCard
        summary={{
          latestWeightKg: 80,
          previousWeightKg: 81,
          weightChangeKg: -1,
          latestBodyFatPercent: 18,
          previousBodyFatPercent: 19,
          bodyFatChangePercent: -1,
          latestMuscleMassKg: null,
          previousMuscleMassKg: null,
          muscleMassChangeKg: null,
          latestWaistCm: null,
          previousWaistCm: null,
          waistChangeCm: null,
          lastUpdatedAt: '2026-07-22T10:00:00.000Z',
        }}
        hasEntries
        onOpenBodyComposition={vi.fn()}
      />,
    )

    expect(screen.getByText('80 kg')).toBeInTheDocument()
    expect(screen.getByText('18%')).toBeInTheDocument()
  })
})
