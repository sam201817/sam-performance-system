import { useTranslation } from '../../hooks/useTranslation'
import type { ExerciseHistory } from '../../types/workoutHistory'
import { formatVolumeKg } from '../../utils/workoutHistoryCalculations'
import './ExerciseHistoryCard.css'

type ExerciseHistoryCardProps = {
  exercise: ExerciseHistory
}

function formatRpe(value: number | null): string {
  return value === null ? '—' : String(value)
}

export function ExerciseHistoryCard({ exercise }: ExerciseHistoryCardProps) {
  const { t } = useTranslation()

  return (
    <article className="exercise-history-card" aria-labelledby={`exercise-${exercise.exerciseId}`}>
      <header className="exercise-history-card__header">
        <h2 className="exercise-history-card__title" id={`exercise-${exercise.exerciseId}`}>
          {exercise.exerciseName}
        </h2>
        <p className="exercise-history-card__summary">
          {exercise.completedSets}/{exercise.totalSets} sets · {formatVolumeKg(exercise.totalVolume)} · RPE {formatRpe(exercise.averageRpe)}
        </p>
      </header>

      <ul className="exercise-history-card__sets">
        {exercise.sets.map((set) => (
          <li key={set.setNumber} className="exercise-history-card__set">
            <span className="exercise-history-card__set-label">
              {t('history.setNumber', { number: set.setNumber })}
            </span>
            <span>{set.weight}</span>
            <span>{set.reps}</span>
            <span>RPE {formatRpe(set.rpe)}</span>
            <span>{set.volume === null ? '—' : formatVolumeKg(set.volume)}</span>
            <span className="exercise-history-card__set-status">
              {set.completed ? t('history.setCompleted') : t('history.setIncomplete')}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
