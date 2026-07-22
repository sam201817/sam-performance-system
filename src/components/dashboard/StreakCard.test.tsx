import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StreakCard } from './StreakCard'

describe('StreakCard', () => {
  it('shows onboarding message without workout history', () => {
    render(
      <StreakCard
        hasWorkoutHistory={false}
        streak={{ currentStreak: 0, longestStreak: 0, totalCompletedWorkouts: 0 }}
      />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('完成第一次訓練')
  })

  it('shows streak metrics when history exists', () => {
    render(
      <StreakCard
        hasWorkoutHistory
        streak={{ currentStreak: 3, longestStreak: 5, totalCompletedWorkouts: 12 }}
      />,
    )

    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('5 天')).toBeInTheDocument()
    expect(screen.getByText('12')).toBeInTheDocument()
  })
})
