import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MetricTrend } from './MetricTrend'
import { buildMetricTrendData } from '../../utils/bodyMetricCalculations'
import { BODY_METRIC_VERSION } from '../../types/bodyMetrics'

describe('MetricTrend', () => {
  it('shows empty trend state and switches metrics', async () => {
    const user = userEvent.setup()
    const onMetricChange = vi.fn()
    const entries = [
      {
        id: '1',
        recordedAt: '2026-07-22T10:00:00.000Z',
        weightKg: 80,
        bodyFatPercent: null,
        muscleMassKg: null,
        waistCm: null,
        notes: null,
        version: BODY_METRIC_VERSION,
      },
    ]

    render(
      <MetricTrend
        selectedMetric="weightKg"
        trend={buildMetricTrendData(entries, 'weightKg')}
        onMetricChange={onMetricChange}
      />,
    )

    expect(screen.getByRole('img', { name: /體重 trend/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: '體重' })).toHaveAttribute('aria-selected', 'true')

    await user.click(screen.getByRole('tab', { name: '體脂' }))
    expect(onMetricChange).toHaveBeenCalledWith('bodyFatPercent')
  })

  it('shows empty state when a metric has no readings', () => {
    render(
      <MetricTrend
        selectedMetric="bodyFatPercent"
        trend={buildMetricTrendData([], 'bodyFatPercent')}
        onMetricChange={vi.fn()}
      />,
    )

    expect(screen.getByText(/Not enough data/i)).toBeInTheDocument()
  })
})
