import { ExerciseHistoryCard } from '../components/history/ExerciseHistoryCard'
import { BackButton } from '../components/ui/BackButton'
import type { WorkoutHistoryDetailProps } from '../types/workout'
import {
  formatDurationMinutes,
  formatRelativeWorkoutDate,
  formatVolumeKg,
} from '../utils/workoutHistoryCalculations'
import './WorkoutHistoryDetail.css'

export function WorkoutHistoryDetail({ session, onBack }: WorkoutHistoryDetailProps) {
  const relativeDate = formatRelativeWorkoutDate(session.completedAt)
  const completionLabel =
    session.completionPercentage >= 100 ? 'Completed' : `${session.completionPercentage}% complete`

  return (
    <main className="history-detail screen-shell">
      <BackButton onClick={onBack} label="返回" ariaLabel="返回訓練紀錄" />

      <header className="history-detail__header">
        <h1 className="history-detail__title">{session.workoutName}</h1>
        <p className="history-detail__meta">
          {relativeDate} · {formatDurationMinutes(session.durationMinutes)} · {formatVolumeKg(session.totalVolume)}
        </p>
        <p className="history-detail__status">{completionLabel}</p>
      </header>

      <section className="history-detail__summary" aria-label="Workout summary">
        <dl className="history-detail__stats">
          <div>
            <dt>Exercises</dt>
            <dd>
              {session.completedExercises}/{session.totalExercises}
            </dd>
          </div>
          <div>
            <dt>Sets</dt>
            <dd>
              {session.completedSets}/{session.totalSets}
            </dd>
          </div>
          <div>
            <dt>Average RPE</dt>
            <dd>{session.averageRpe ?? '—'}</dd>
          </div>
        </dl>
      </section>

      <section className="history-detail__exercises" aria-label="Exercise history">
        {session.exercises.map((exercise) => (
          <ExerciseHistoryCard key={exercise.exerciseId} exercise={exercise} />
        ))}
      </section>
    </main>
  )
}
