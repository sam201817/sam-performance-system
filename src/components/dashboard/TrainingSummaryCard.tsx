import { Card } from '../Card'
import { useTranslation } from '../../hooks/useTranslation'
import type { WeeklyTrainingSummary } from '../../types/dashboard'
import { formatVolumeKg } from '../../utils/workoutHistoryCalculations'
import './TrainingSummaryCard.css'

type TrainingSummaryCardProps = {
  summary: WeeklyTrainingSummary
  hasWorkoutHistory: boolean
}

export function TrainingSummaryCard({ summary, hasWorkoutHistory }: TrainingSummaryCardProps) {
  const { t } = useTranslation()

  if (!hasWorkoutHistory) {
    return (
      <Card className="training-summary-card" delay={0.14} aria-label={t('dashboard.thisWeek')}>
        <h2 className="training-summary-card__title">{t('dashboard.thisWeek')}</h2>
        <p className="training-summary-card__empty" role="status">
          {t('dashboard.onboarding')}
        </p>
      </Card>
    )
  }

  const averageDuration =
    summary.averageDurationMinutes === null
      ? '—'
      : `${summary.averageDurationMinutes} ${t('dashboard.min')}`

  const progressPercent = Math.min(100, Math.max(0, summary.completionPercent))

  return (
    <Card className="training-summary-card" delay={0.14} aria-label={t('dashboard.thisWeek')}>
      <h2 className="training-summary-card__title">{t('dashboard.thisWeek')}</h2>

      <div
        className="training-summary-card__progress"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${t('dashboard.completion')} ${progressPercent}%`}
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
          <span className="training-summary-card__label">{t('dashboard.workouts')}</span>
          <strong className="training-summary-card__value">
            {summary.completedWorkouts} / {summary.targetWorkouts}
          </strong>
        </div>
        <div className="training-summary-card__stat">
          <span className="training-summary-card__label">{t('dashboard.volume')}</span>
          <strong className="training-summary-card__value">
            {formatVolumeKg(summary.totalVolume)}
          </strong>
        </div>
        <div className="training-summary-card__stat">
          <span className="training-summary-card__label">{t('dashboard.avgDuration')}</span>
          <strong className="training-summary-card__value">{averageDuration}</strong>
        </div>
      </div>
    </Card>
  )
}
