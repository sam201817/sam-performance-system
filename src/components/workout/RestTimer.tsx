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
  const statusText = isComplete
    ? '休息完成'
    : isPaused
      ? '休息已暫停'
      : isRunning
        ? '休息進行中'
        : '休息計時'

  return (
    <section className="rest-timer" aria-label="休息計時">
      <div className="rest-timer__header">
        <span className="rest-timer__label">Rest</span>
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
            暫停
          </button>
        ) : (
          <button
            type="button"
            className="rest-timer__button"
            onClick={onResume}
            disabled={isComplete}
          >
            繼續
          </button>
        )}
        <button type="button" className="rest-timer__button" onClick={onRestart}>
          重來
        </button>
        <button type="button" className="rest-timer__button rest-timer__button--accent" onClick={onSkip}>
          跳過
        </button>
      </div>
    </section>
  )
}
