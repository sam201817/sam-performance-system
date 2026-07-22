import type { SetLog } from '../../types/workoutProgress'
import { RpeSelector } from './RpeSelector'
import './SetRow.css'

type SetRowProps = {
  set: SetLog
  inputIdPrefix: string
  onChange: (set: SetLog) => void
  onComplete: () => void
}

export function SetRow({ set, inputIdPrefix, onChange, onComplete }: SetRowProps) {
  const repsId = `${inputIdPrefix}-reps`
  const weightId = `${inputIdPrefix}-weight`

  function toggleComplete() {
    const nextCompleted = !set.completed
    onChange({ ...set, completed: nextCompleted })
    if (nextCompleted) onComplete()
  }

  return (
    <div className={`set-row${set.completed ? ' set-row--completed' : ''}`}>
      <div className="set-row__header">
        <span className="set-row__number">Set {set.setNumber}</span>
        {set.completed && (
          <span className="set-row__status" aria-label="已完成">
            已完成
          </span>
        )}
      </div>

      <div className="set-row__fields">
        <div className="set-row__field">
          <label className="set-row__label" htmlFor={repsId}>
            實際次數
          </label>
          <input
            id={repsId}
            className="set-row__input"
            type="text"
            inputMode="text"
            value={set.actualReps}
            onChange={(event) => onChange({ ...set, actualReps: event.target.value })}
          />
        </div>

        <div className="set-row__field">
          <label className="set-row__label" htmlFor={weightId}>
            重量
          </label>
          <input
            id={weightId}
            className="set-row__input"
            type="text"
            inputMode="text"
            value={set.weight}
            onChange={(event) => onChange({ ...set, weight: event.target.value })}
          />
        </div>
      </div>

      <RpeSelector
        id={inputIdPrefix}
        value={set.rpe}
        onChange={(rpe) => onChange({ ...set, rpe })}
      />

      <button
        type="button"
        className={`set-row__complete sps-action-primary${set.completed ? ' set-row__complete--done' : ''}`}
        aria-pressed={set.completed}
        onClick={toggleComplete}
      >
        {set.completed ? '取消完成' : '完成組數'}
      </button>
    </div>
  )
}
