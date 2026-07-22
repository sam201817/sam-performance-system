import { Card } from '../Card'
import type { WeeklyTrainingSummary } from '../../types/dashboard'
import { formatVolumeKg } from '../../utils/workoutHistoryCalculations'
import './TrainingSummaryCard.css'

type TrainingSummaryCardProps = {
  summary: WeeklyTrainingSummary
  hasWorkoutHistory: boolean
}

export function TrainingSummaryCard({ summary, hasWorkoutHistory }: TrainingSummaryCardProps) {
  if (!hasWorkoutHistory) {
    return (
      <Card className="training-summary-card" delay={0.14} aria-label="This Week">
        <h2 className="training-summary-card__title">This Week</h2>
        <p className="training-summary-card__empty" role="status">
          Complete your first workout to start tracking weekly progress.
        </p>
      </Card>
    )
  }

  const averageDuration =
    summary.averageDurationMinutes === null
      ? '—'
      : `${summary.averageDurationMinutes} min`

  const progressPercent = Math.min(100, Math.max(0, summary.completionPercent))

  return (
    <Card className="training-summary-card" delay={0.14} aria-label="This Week">
      <h2 className="training-summary-card__title">This Week</h2>

      <div
        className="training-summary-card__progress"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Weekly completion ${progressPercent}%`}
      >
        <div className="training-summary-card__progress-track">
          <div
            className="training-summary-card__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="training-summary-card__progress-value">{progressPercent}%</span>
      </div>

      <div className="training-summary-card__grid">
        <div className="training-summary-card__stat">
          <span className="training-summary-card__label">Workouts</span>
          <strong className="training-summary-card__value">
            {summary.completedWorkouts} / {summary.targetWorkouts}
          </strong>
        </div>
        <div className="training-summary-card__stat">
          <span className="training-summary-card__label">Volume</span>
          <strong className="training-summary-card__value">
            {formatVolumeKg(summary.totalVolume)}
          </strong>
        </div>
        <div className="training-summary-card__stat">
          <span className="training-summary-card__label">Avg duration</span>
          <strong className="training-summary-card__value">{averageDuration}</strong>
        </div>
      </div>
    </Card>
  )
}
