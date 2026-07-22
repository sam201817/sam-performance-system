import { useTranslation } from '../../hooks/useTranslation'
import './RestTimer.css'

type RestTimerProps = {
  display: string
  isRunning: boolean
  isPaused: boolean
  isComplete: boolean
  onPause: () => void
  onResume: () => void
  onSkip: () => void
  onRestart: () => void
}

export function RestTimer({
  display,
  isRunning,
  isPaused,
  isComplete,
  onPause,
  onResume,
  onSkip,
  onRestart,
}: RestTimerProps) {
  const { t } = useTranslation()

  const statusText = isComplete
    ? t('workout.restComplete')
    : isPaused
      ? t('workout.restPaused')
      : isRunning
        ? t('workout.restRunning')
        : t('workout.restTimer')

  return (
    <section className="rest-timer" aria-label={t('workout.restTimer')}>
      <div className="rest-timer__header">
        <span className="rest-timer__label">{t('workout.restLabel')}</span>
        <span
          className="rest-timer__status"
          aria-live="polite"
          aria-atomic="true"
        >
          {statusText}
        </span>
      </div>

      <p className="rest-timer__time" aria-hidden="true">
        {display}
      </p>

      <div className="rest-timer__controls">
        {isRunning ? (
          <button type="button" className="rest-timer__button" onClick={onPause}>
            {t('workout.pause')}
          </button>
        ) : (
          <button
            type="button"
            className="rest-timer__button"
            onClick={onResume}
            disabled={isComplete}
          >
            {t('workout.resume')}
          </button>
        )}
        <button type="button" className="rest-timer__button" onClick={onRestart}>
          {t('workout.restart')}
        </button>
        <button type="button" className="rest-timer__button rest-timer__button--accent" onClick={onSkip}>
          {t('workout.skip')}
        </button>
      </div>
    </section>
  )
}
