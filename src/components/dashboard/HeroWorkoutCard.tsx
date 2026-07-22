import { Card } from '../Card'
import type { WorkoutSession } from '../../data/todayWorkout'
import { useTranslation } from '../../hooks/useTranslation'
import type { WorkoutStatus } from '../../types/workoutProgress'
import './HeroWorkoutCard.css'

type HeroWorkoutCardProps = {
  session: WorkoutSession
  workoutStatus: WorkoutStatus
  hasWorkoutHistory: boolean
  onStartWorkout: () => void
}

export function HeroWorkoutCard({
  session,
  workoutStatus,
  hasWorkoutHistory,
  onStartWorkout,
}: HeroWorkoutCardProps) {
  const { t } = useTranslation()
  const isActive = workoutStatus === 'active'
  const { title, duration, exercises } = session

  return (
    <Card className="hero-workout-card" delay={0.05} aria-label={t('dashboard.todayFocus')}>
      <div className="hero-workout-card__content">
        <div className="hero-workout-card__header">
          <span className="hero-workout-card__eyebrow session-label">{t('dashboard.todayFocus')}</span>
          <h2 className="hero-workout-card__title">{title}</h2>
          <p className="hero-workout-card__meta">
            {t('dashboard.exercisesMeta', { count: exercises.length, duration })}
          </p>
        </div>

        {!hasWorkoutHistory && (
          <p className="hero-workout-card__onboarding" role="status">
            {t('dashboard.onboarding')}
          </p>
        )}

        <div className="hero-workout-card__actions">
          <button
            type="button"
            className={`hero-workout-card__button sps-action-primary${isActive ? ' hero-workout-card__button--resume' : ''}`}
            onClick={onStartWorkout}
          >
            {isActive ? t('buttons.resumeWorkout') : t('buttons.startWorkout')}
          </button>

          {isActive && (
            <p className="hero-workout-card__status" role="status">
              {t('dashboard.workoutInProgress')}
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
