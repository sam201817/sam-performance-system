import { useTranslation } from '../../hooks/useTranslation'
import type { ExerciseProgressProps } from '../../types/workout'
import './ExerciseProgress.css'

export function ExerciseProgress({ current, total }: ExerciseProgressProps) {
  const { t } = useTranslation()
  const percent = total > 0 ? (current / total) * 100 : 0

  return (
    <section className="exercise-progress" aria-label={t('workout.exerciseProgressLabel')}>
      <div className="exercise-progress__header">
        <span className="exercise-progress__label">{t('workout.exerciseProgressLabel')}</span>
        <span className="exercise-progress__count">
          {current} / {total}
        </span>
      </div>
      <div
        className="exercise-progress__track"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={t('workout.exerciseProgress', { current, total })}
      >
        <span
          className="exercise-progress__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  )
}
