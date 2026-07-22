import { ExerciseHistoryCard } from '../components/history/ExerciseHistoryCard'
import { BackButton } from '../components/ui/BackButton'
import { useTranslation } from '../hooks/useTranslation'
import type { WorkoutHistoryDetailProps } from '../types/workout'
import {
  formatDurationMinutes,
  formatRelativeWorkoutDate,
  formatVolumeKg,
} from '../utils/workoutHistoryCalculations'
import './WorkoutHistoryDetail.css'

export function WorkoutHistoryDetail({ session, onBack }: WorkoutHistoryDetailProps) {
  const { t } = useTranslation()
  const relativeDate = formatRelativeWorkoutDate(session.completedAt)
  const completionLabel =
    session.completionPercentage >= 100
      ? t('history.completed')
      : t('history.percentComplete', { value: session.completionPercentage })

  return (
    <main className="history-detail screen-shell">
      <BackButton
        onClick={onBack}
        label={t('buttons.back')}
        ariaLabel={t('history.title')}
      />

      <header className="history-detail__header">
        <h1 className="history-detail__title">{session.workoutName}</h1>
        <p className="history-detail__meta">
          {relativeDate} · {formatDurationMinutes(session.durationMinutes)} · {formatVolumeKg(session.totalVolume)}
        </p>
        <p className="history-detail__status">{completionLabel}</p>
      </header>

      <section className="history-detail__summary" aria-label={t('history.title')}>
        <dl className="history-detail__stats">
          <div>
            <dt>{t('history.exercises')}</dt>
            <dd>
              {session.completedExercises}/{session.totalExercises}
            </dd>
          </div>
          <div>
            <dt>{t('history.sets')}</dt>
            <dd>
              {session.completedSets}/{session.totalSets}
            </dd>
          </div>
          <div>
            <dt>{t('history.averageRpe')}</dt>
            <dd>{session.averageRpe ?? '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="history-detail__exercises" aria-label={t('history.exercises')}>
        {session.exercises.map((exercise) => (
          <ExerciseHistoryCard key={exercise.exerciseId} exercise={exercise} />
        ))}
      </section>
    </main>
  )
}
