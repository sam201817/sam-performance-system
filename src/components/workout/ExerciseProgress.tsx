import type { ExerciseProgressProps } from '../../types/workout'
import './ExerciseProgress.css'

export function ExerciseProgress({ current, total }: ExerciseProgressProps) {
  const percent = total > 0 ? (current / total) * 100 : 0

  return (
    <section className="exercise-progress" aria-label="訓練進度">
      <div className="exercise-progress__header">
        <span className="exercise-progress__label">動作進度</span>
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
        aria-label={`動作 ${current}，共 ${total} 個`}
      >
        <span
          className="exercise-progress__fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </section>
  )
}
