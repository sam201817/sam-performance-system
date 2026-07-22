import { useId } from 'react'
import { Card } from '../Card'
import type { ExerciseDetailProps } from '../../types/workout'
import './ExerciseDetail.css'

export function ExerciseDetail({ exercise }: ExerciseDetailProps) {
  const titleId = useId()

  return (
    <Card className="exercise-detail" aria-labelledby={titleId}>
      <h2 id={titleId} className="exercise-detail__name">
        {exercise.name}
      </h2>

      <dl className="exercise-detail__stats">
        <div className="exercise-detail__stat">
          <dt className="exercise-detail__stat-label">Sets</dt>
          <dd className="exercise-detail__stat-value">{exercise.sets}</dd>
        </div>
        <div className="exercise-detail__stat">
          <dt className="exercise-detail__stat-label">Reps</dt>
          <dd className="exercise-detail__stat-value">{exercise.reps}</dd>
        </div>
        <div className="exercise-detail__stat">
          <dt className="exercise-detail__stat-label">Weight</dt>
          <dd className="exercise-detail__stat-value">{exercise.weight}</dd>
        </div>
      </dl>

      {exercise.rest && (
        <div className="exercise-detail__meta">
          <span className="exercise-detail__meta-label">Rest</span>
          <span className="exercise-detail__meta-value">{exercise.rest}</span>
        </div>
      )}

      {exercise.notes && (
        <p className="exercise-detail__notes">{exercise.notes}</p>
      )}
    </Card>
  )
}
