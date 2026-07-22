import { useId, useState } from 'react'
import { SESSION_LABEL } from '../constants/workout'
import { useRestTimer } from '../hooks/useRestTimer'
import { useTranslation } from '../hooks/useTranslation'
import { BackButton } from '../components/ui/BackButton'
import { ExerciseProgress } from '../components/workout/ExerciseProgress'
import { SetTracker } from '../components/workout/SetTracker'
import { RestTimer } from '../components/workout/RestTimer'
import { WorkoutControls } from '../components/workout/WorkoutControls'
import { AdvanceConfirm } from '../components/workout/AdvanceConfirm'
import { EmptyState } from '../components/ui/EmptyState'
import { parseRestDuration } from '../utils/parseRestDuration'
import {
  clampExerciseIndex,
  hasIncompleteSets,
  updateExerciseLog,
} from '../utils/workoutProgressFactory'
import type { AdvanceAction } from '../types/workoutProgress'
import type { WorkoutProps } from '../types/workout'
import './Workout.css'

export function Workout({
  session,
  progress,
  onProgressChange,
  onBack,
  onFinish,
}: WorkoutProps) {
  const { t } = useTranslation()
  const { title, exercises } = session
  const total = exercises.length
  const index = clampExerciseIndex(progress.currentExerciseIndex, total)
  const exercise = exercises[index]
  const exerciseLog = progress.exerciseLogs[index]
  const titleId = useId()
  const timer = useRestTimer()
  const [pendingAdvance, setPendingAdvance] = useState<AdvanceAction | null>(null)

  if (!exercise || !exerciseLog) {
    return (
      <main className="workout-screen screen-shell">
        <BackButton onClick={onBack} />
        <EmptyState
          icon="workout"
          title={t('emptyStates.workoutTitle')}
          description={t('emptyStates.workoutDescription')}
        />
      </main>
    )
  }

  function persistIndex(nextIndex: number) {
    onProgressChange({
      ...progress,
      currentExerciseIndex: clampExerciseIndex(nextIndex, total),
    })
  }

  function handleExerciseLogChange(nextLog: typeof exerciseLog) {
    onProgressChange(updateExerciseLog(progress, exercise.id, () => nextLog))
  }

  function handleSetComplete() {
    timer.start(parseRestDuration(exercise.rest))
  }

  function performAdvance(action: AdvanceAction) {
    timer.skip()
    setPendingAdvance(null)

    if (action === 'next') {
      persistIndex(index + 1)
      return
    }

    onFinish({
      ...progress,
      currentExerciseIndex: index,
    })
  }

  function tryAdvance(action: AdvanceAction) {
    if (hasIncompleteSets(exerciseLog)) {
      setPendingAdvance(action)
      return
    }
    performAdvance(action)
  }

  return (
    <main className="workout-screen screen-shell">
      <header className="workout-screen__header">
        <BackButton onClick={onBack} />
        <div className="workout-screen__heading">
          <span className="workout-screen__label session-label">{SESSION_LABEL}</span>
          <h1 className="workout-screen__title">{title}</h1>
        </div>
      </header>

      <ExerciseProgress current={index + 1} total={total} />

      <div aria-live="polite" aria-atomic="true" className="workout-screen__exercise">
        <section className="workout-screen__exercise-header" aria-labelledby={titleId}>
          <h2 id={titleId} className="workout-screen__exercise-name">
            {exercise.name}
          </h2>
          {exercise.notes && (
            <p className="workout-screen__exercise-notes">{exercise.notes}</p>
          )}
        </section>

        <SetTracker
          exerciseLog={exerciseLog}
          onExerciseLogChange={handleExerciseLogChange}
          onSetComplete={handleSetComplete}
        />
      </div>

      {timer.isVisible && (
        <RestTimer
          display={timer.display}
          isRunning={timer.isRunning}
          isPaused={timer.isPaused}
          isComplete={timer.isComplete}
          onPause={timer.pause}
          onResume={timer.resume}
          onSkip={timer.skip}
          onRestart={timer.restart}
        />
      )}

      {pendingAdvance && (
        <AdvanceConfirm
          onCancel={() => setPendingAdvance(null)}
          onConfirm={() => performAdvance(pendingAdvance)}
        />
      )}

      <WorkoutControls
        currentIndex={index}
        total={total}
        onPrevious={() => {
          timer.skip()
          setPendingAdvance(null)
          persistIndex(index - 1)
        }}
        onNext={() => tryAdvance('next')}
        onFinish={() => tryAdvance('finish')}
      />
    </main>
  )
}
