import { Card } from '../Card'
import { useTranslation } from '../../hooks/useTranslation'
import type { LastWorkoutSummary } from '../../types/dashboard'
import { getSessionRating, type SessionRatingVariant } from '../../utils/sessionRating'
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

function getSessionRatingKey(variant: SessionRatingVariant): string {
  if (variant === 'needs-improvement') {
    return 'sessionRating.needsImprovement'
  }

  return `sessionRating.${variant}`
}

export function LastWorkoutCard({ lastWorkout, onOpenSession }: LastWorkoutCardProps) {
  const { t } = useTranslation()

  if (!lastWorkout) {
    return (
      <Card className="last-workout-card" delay={0.16} aria-label={t('dashboard.lastWorkout')}>
        <h2 className="last-workout-card__title">{t('dashboard.lastWorkout')}</h2>
        <p className="last-workout-card__empty" role="status">
          {t('history.empty')}
        </p>
      </Card>
    )
  }

  const rating = getSessionRating(lastWorkout.completionPercentage, lastWorkout.averageRpe)
  const ratingLabel = t(getSessionRatingKey(rating.variant))
  const accessibleLabel = `${lastWorkout.workoutName}, ${formatRelativeWorkoutDate(lastWorkout.completedAt)}, ${formatVolumeKg(lastWorkout.totalVolume)}, ${formatDurationMinutes(lastWorkout.durationMinutes)}, ${t('history.percentComplete', { value: lastWorkout.completionPercentage })}, ${ratingLabel}`

  return (
    <Card className="last-workout-card" delay={0.16} aria-label={t('dashboard.lastWorkout')}>
      <h2 className="last-workout-card__title">{t('dashboard.lastWorkout')}</h2>

      <button
        type="button"
        className="last-workout-card__button"
        aria-label={accessibleLabel}
        onClick={() => onOpenSession(lastWorkout.id)}
      >
        <div className="last-workout-card__top">
          <span className="last-workout-card__name">{lastWorkout.workoutName}</span>
          <span className={`last-workout-card__badge last-workout-card__badge--${rating.variant}`}>
            {ratingLabel}
          </span>
        </div>

        <span className="last-workout-card__date">
          {formatRelativeWorkoutDate(lastWorkout.completedAt)}
        </span>

        <div className="last-workout-card__stats">
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">{t('dashboard.volume')}</span>
            <strong className="last-workout-card__stat-value">
              {formatVolumeKg(lastWorkout.totalVolume)}
            </strong>
          </div>
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">{t('dashboard.duration')}</span>
            <strong className="last-workout-card__stat-value">
              {formatDurationMinutes(lastWorkout.durationMinutes)}
            </strong>
          </div>
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">{t('dashboard.completion')}</span>
            <strong className="last-workout-card__stat-value">
              {lastWorkout.completionPercentage}%
            </strong>
          </div>
          <div className="last-workout-card__stat">
            <span className="last-workout-card__stat-label">{t('dashboard.avgRpe')}</span>
            <strong className="last-workout-card__stat-value">
              {lastWorkout.averageRpe ?? '—'}
            </strong>
          </div>
        </div>
      </button>
    </Card>
  )
}
