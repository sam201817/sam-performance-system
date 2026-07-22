import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import { buildDashboardOverview } from '../utils/dashboardCalculations'
import { Dashboard } from './Dashboard'

const emptyBodySummary = {
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

const checkInSummary = {
  score: 82,
  statusLabel: 'Ready to train',
  fatigue: 2,
  sleepQuality: 4,
  motivation: 4,
  muscleSoreness: 2,
  hasNote: false,
}

describe('Dashboard', () => {
  it('renders performance overview sections', () => {
    const now = new Date('2026-07-22T10:00:00.000Z')
    const overview = buildDashboardOverview([], emptyBodySummary, now)

    render(
      <Dashboard
        session={TODAY_WORKOUT}
        workoutStatus="idle"
        onStartWorkout={vi.fn()}
        activeTab="home"
        onNavigate={vi.fn()}
        overview={overview}
        bodySummary={emptyBodySummary}
        hasBodyEntries={false}
        onOpenBodyComposition={vi.fn()}
        onOpenHistorySession={vi.fn()}
        checkInSummary={checkInSummary}
        onEditCheckIn={vi.fn()}
        insights={[]}
      />,
    )

    expect(screen.getByRole('heading', { name: '今日狀態' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: TODAY_WORKOUT.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '身體組成' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '本週訓練' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '最近訓練' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '連續訓練' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '快速概覽' })).not.toBeInTheDocument()
  })

  it('starts workout from hero card', async () => {
    const user = userEvent.setup()
    const onStartWorkout = vi.fn()
    const overview = buildDashboardOverview([], emptyBodySummary)

    render(
      <Dashboard
        session={TODAY_WORKOUT}
        workoutStatus="idle"
        onStartWorkout={onStartWorkout}
        activeTab="home"
        onNavigate={vi.fn()}
        overview={overview}
        bodySummary={emptyBodySummary}
        hasBodyEntries={false}
        onOpenBodyComposition={vi.fn()}
        onOpenHistorySession={vi.fn()}
        checkInSummary={checkInSummary}
        onEditCheckIn={vi.fn()}
        insights={[]}
      />,
    )

    await user.click(screen.getByRole('button', { name: '開始訓練' }))
    expect(onStartWorkout).toHaveBeenCalledTimes(1)
  })
})
