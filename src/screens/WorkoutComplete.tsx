import { Card } from '../components/Card'
import { useTranslation } from '../hooks/useTranslation'
import type { WorkoutCompleteProps } from '../types/workout'
import './WorkoutComplete.css'

export function WorkoutComplete({ summary, onReturnHome }: WorkoutCompleteProps) {
  const { t } = useTranslation()
  const {
    totalExercises,
    completedExercises,
    totalCompletedSets,
    durationMinutes,
  } = summary

  return (
    <main className="workout-complete screen-shell">
      <Card className="workout-complete__card">
        <div className="workout-complete__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="rgba(184,217,38,0.25)"
              strokeWidth="1.5"
            />
            <path
              d="M14 24l7 7 13-14"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="workout-complete__title">{t('workout.completeTitle')}</h1>
        <p className="workout-complete__message">{t('workout.completeSubtitle')}</p>

        <dl className="workout-complete__stats">
          <div className="workout-complete__stat">
            <dt>{t('history.exercises')}</dt>
            <dd>
              {completedExercises} / {totalExercises}
            </dd>
          </div>
          <div className="workout-complete__stat">
            <dt>{t('history.sets')}</dt>
            <dd>{totalCompletedSets}</dd>
          </div>
          {durationMinutes !== null && (
            <div className="workout-complete__stat">
              <dt>{t('dashboard.duration')}</dt>
              <dd>{t('workout.summaryDuration', { minutes: durationMinutes })}</dd>
            </div>
          )}
        </dl>

        <button
          type="button"
          className="workout-complete__button sps-action-primary"
          onClick={onReturnHome}
        >
          {t('workout.returnHome')}
        </button>
      </Card>
    </main>
  )
}
