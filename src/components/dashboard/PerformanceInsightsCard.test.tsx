import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PerformanceInsightsCard } from './PerformanceInsightsCard'

describe('PerformanceInsightsCard', () => {
  it('shows empty state without insights', () => {
    render(<PerformanceInsightsCard insights={[]} />)

    expect(screen.getByRole('heading', { name: '表現分析' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('完成訓練與每日狀態紀錄後')
  })

  it('renders insight cards with accessible labels', () => {
    render(
      <PerformanceInsightsCard
        insights={[
          {
            id: 'training-current-streak',
            title: '3-day training streak',
            description: 'You have trained on consecutive days.',
            category: 'training',
            severity: 'positive',
            icon: 'streak',
            priority: 85,
          },
        ]}
      />,
    )

    expect(screen.getByRole('heading', { name: '3-day training streak' })).toBeInTheDocument()
    expect(
      screen.getByLabelText('3-day training streak. You have trained on consecutive days.'),
    ).toBeInTheDocument()
    expect(screen.getByText('正向')).toBeInTheDocument()
  })
})
