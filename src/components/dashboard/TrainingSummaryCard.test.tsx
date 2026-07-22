import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TrainingSummaryCard } from './TrainingSummaryCard'

describe('TrainingSummaryCard', () => {
  it('shows onboarding message without workout history', () => {
    render(
      <TrainingSummaryCard
        hasWorkoutHistory={false}
        summary={{
          completedWorkouts: 0,
          targetWorkouts: 3,
          completionPercent: 0,
          totalVolume: 0,
          averageDurationMinutes: null,
        }}
      />,
    )

    expect(screen.getByRole('heading', { name: '本週訓練' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('完成第一次訓練')
  })

  it('shows weekly metrics when history exists', () => {
    render(
      <TrainingSummaryCard
        hasWorkoutHistory
        summary={{
          completedWorkouts: 2,
          targetWorkouts: 3,
          completionPercent: 67,
          totalVolume: 2400,
          averageDurationMinutes: 50,
        }}
      />,
    )

    expect(screen.getByText('2 / 3')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '完成率 67%' })).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
    expect(screen.getByText('2,400 kg')).toBeInTheDocument()
    expect(screen.getByText('50 分鐘')).toBeInTheDocument()
  })
})
