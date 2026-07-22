import { useTranslation } from '../../hooks/useTranslation'
import type { WorkoutControlsProps } from '../../types/workout'
import './WorkoutControls.css'

export function WorkoutControls({
  currentIndex,
  total,
  onPrevious,
  onNext,
  onFinish,
}: WorkoutControlsProps) {
  const { t } = useTranslation()
  const isFirst = currentIndex === 0
  const isLast = currentIndex === total - 1

  return (
    <nav className="workout-controls" aria-label={t('workout.controlsNav')}>
      <button
        type="button"
        className="workout-controls__button workout-controls__button--secondary"
        onClick={onPrevious}
        disabled={isFirst}
        aria-disabled={isFirst}
      >
        {t('workout.previous')}
      </button>

      {isLast ? (
        <button
          type="button"
          className="workout-controls__button workout-controls__button--primary sps-action-primary"
          onClick={onFinish}
        >
          {t('workout.finish')}
        </button>
      ) : (
        <button
          type="button"
          className="workout-controls__button workout-controls__button--primary sps-action-primary"
          onClick={onNext}
        >
          {t('workout.next')}
        </button>
      )}
    </nav>
  )
}
