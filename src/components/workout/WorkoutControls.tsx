import type { WorkoutControlsProps } from '../../types/workout'
import './WorkoutControls.css'

export function WorkoutControls({
  currentIndex,
  total,
  onPrevious,
  onNext,
  onFinish,
}: WorkoutControlsProps) {
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1

  return (
    <nav className="workout-controls" aria-label="訓練動作導覽">
      <button
        type="button"
        className="workout-controls__button workout-controls__button--secondary"
        onClick={onPrevious}
        disabled={isFirst}
        aria-disabled={isFirst}
      >
        上一個
      </button>

      {isLast ? (
        <button
          type="button"
          className="workout-controls__button workout-controls__button--primary sps-action-primary"
          onClick={onFinish}
        >
          完成訓練
        </button>
      ) : (
        <button
          type="button"
          className="workout-controls__button workout-controls__button--primary sps-action-primary"
          onClick={onNext}
        >
          下一個
        </button>
      )}
    </nav>
  )
}
