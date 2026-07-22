import { useId } from 'react'
import type { ExerciseLog } from '../../types/workoutProgress'
import { countCompletedSets } from '../../utils/workoutProgressFactory'
import { SetRow } from './SetRow'
import './SetTracker.css'

type SetTrackerProps = {
  exerciseLog: ExerciseLog
  onExerciseLogChange: (log: ExerciseLog) => void
  onSetComplete: () => void
}

export function SetTracker({
  exerciseLog,
  onExerciseLogChange,
  onSetComplete,
}: SetTrackerProps) {
  const baseId = useId()
  const completedSets = countCompletedSets(exerciseLog)
  const totalSets = exerciseLog.sets.length

  function updateSet(setNumber: number, nextSet: ExerciseLog['sets'][number]) {
    onExerciseLogChange({
      ...exerciseLog,
      sets: exerciseLog.sets.map((set) =>
        set.setNumber === setNumber ? nextSet : set,
      ),
    })
  }

  return (
    <section className="set-tracker" aria-label="組數紀錄">
      <div className="set-tracker__summary">
        <span className="set-tracker__label">完成組數</span>
        <span className="set-tracker__count">
          {completedSets} / {totalSets}
        </span>
      </div>

      <div className="set-tracker__list">
        {exerciseLog.sets.map((set) => (
          <SetRow
            key={set.setNumber}
            set={set}
            inputIdPrefix={`${baseId}-set-${set.setNumber}`}
            onChange={(nextSet) => updateSet(set.setNumber, nextSet)}
            onComplete={onSetComplete}
          />
        ))}
      </div>
    </section>
  )
}
