import { Card } from '../Card'
import type { WorkoutSession } from '../../data/todayWorkout'
import type { WorkoutStatus } from '../../types/workoutProgress'
import './HeroWorkoutCard.css'

type HeroWorkoutCardProps = {
  session: WorkoutSession
  workoutStatus: WorkoutStatus
  hasWorkoutHistory: boolean
  onStartWorkout: () => void
}

export function HeroWorkoutCard({
  session,
  workoutStatus,
  hasWorkoutHistory,
  onStartWorkout,
}: HeroWorkoutCardProps) {
  const isActive = workoutStatus === 'active'
  const { title, duration, exercises } = session

  return (
    <Card className="hero-workout-card" delay={0.05} aria-label="Today's Focus">
      <div className="hero-workout-card__content">
        <div className="hero-workout-card__header">
          <span className="hero-workout-card__eyebrow session-label">Today&apos;s Focus</span>
          <h2 className="hero-workout-card__title">{title}</h2>
          <p className="hero-workout-card__meta">
            {exercises.length} exercises · {duration}
          </p>
        </div>

        {!hasWorkoutHistory && (
          <p className="hero-workout-card__onboarding" role="status">
            Start your first workout to build your performance history.
          </p>
        )}

        <div className="hero-workout-card__actions">
          <button
            type="button"
            className={`hero-workout-card__button sps-action-primary${isActive ? ' hero-workout-card__button--resume' : ''}`}
            onClick={onStartWorkout}
          >
            {isActive ? 'Resume Workout' : 'Start Workout'}
          </button>

          {isActive && (
            <p className="hero-workout-card__status" role="status">
              Workout in progress — pick up where you left off.
            </p>
          )}
        </div>
      </div>
    </Card>
  )
}
