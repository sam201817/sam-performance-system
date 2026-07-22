import { Card } from '../Card'
import type { LastWorkoutSummary } from '../../types/dashboard'
import { getSessionRating } from '../../utils/sessionRating'
import {
  formatDurationMinutes,
  formatRelativeWorkoutDate,
  formatVolumeKg,
} from '../../utils/workoutHistoryCalculations'
import './LastWorkoutCard.css'

type LastWorkoutCardProps = {
  lastWorkout: LastWorkoutSummary | null
  onOpenSession: (sessionId: string) => void
}

export function LastWorkoutCard({ lastWorkout, onOpenSession }: LastWorkoutCardProps) {
  if (!lastWorkout) {
    return (
      <Card className="last-workout-card" delay={0.16} aria-label="Last Workout">
        <h2 className="last-workout-card__title">Last Workout</h2>
        <p className="last-workout-card__empty" role="status">
          Your most recent session will appear here after you finish a workout.
        </p>
      </Card>
    )
  }

  const rating = getSessionRating(lastWorkout.completionPercentage, lastWorkout.averageRpe)
  const accessibleLabel = `${lastWorkout.workoutName}, ${formatRelativeWorkoutDate(lastWorkout.completedAt)}, ${formatVolumeKg(lastWorkout.totalVolume)}, ${formatDurationMinutes(lastWorkout.durationMinutes)}, ${lastWorkout.completionPercentage}% complete, ${rating.label}`

  return (
    <Card className="last-workout-card" delay={0.16} aria-label="Last Workout">
      <h2 className="last-workout-card__title">Last Workout</h2>

      <button
        type="button"
        className="last-workout-card__button"
        aria-label={accessibleLabel}
        onClick={() => onOpenSession(lastWorkout.id)}
      >
        <div className="last-workout-card__top">
          <span className="last-workout-card__name">{lastWorkout.workoutName}</span>
          <span className={`last-workout-card__badge last-workout-card__badge--${rating.variant}`}>
            {rating.label}
          </span>
        </div>

        <span className="last-workout-card__date">
          {formatRelativeWorkoutDate(lastWorkout.completedAt)}
        </span>

        <div className="last-workout-card__stats">
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">Volume</span>
            <strong className="last-workout-card__stat-value">
              {formatVolumeKg(lastWorkout.totalVolume)}
            </strong>
          </div>
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">Duration</span>
            <strong className="last-workout-card__stat-value">
              {formatDurationMinutes(lastWorkout.durationMinutes)}
            </strong>
          </div>
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">Completion</span>
            <strong className="last-workout-card__stat-value">
              {lastWorkout.completionPercentage}%
            </strong>
          </div>
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">Avg RPE</span>
            <strong className="last-workout-card__stat-value">
              {lastWorkout.averageRpe ?? '—'}
            </strong>
          </div>
        </div>
      </button>
    </Card>
  )
}
