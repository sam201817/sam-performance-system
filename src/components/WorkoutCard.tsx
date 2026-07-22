import { Card } from './Card'
import { SESSION_LABEL, WORKOUT_FOCUS_TAGS } from '../constants/workout'
import type { WorkoutCardProps } from '../types/workout'
import './WorkoutCard.css'

function MovementGraphic() {
  return (
    <svg
      className="workout-card__graphic"
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(184,217,38,0.08)" strokeWidth="1" />
      <path
        d="M18 52 Q40 18 62 52"
        fill="none"
        stroke="rgba(184,217,38,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28 48 Q40 28 52 48"
        fill="none"
        stroke="rgba(184,217,38,0.2)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="32" r="4" fill="rgba(184,217,38,0.5)" />
      <circle cx="24" cy="50" r="3" fill="rgba(255,255,255,0.12)" />
      <circle cx="56" cy="50" r="3" fill="rgba(255,255,255,0.12)" />
    </svg>
  )
}

export function WorkoutCard({ session, workoutStatus, onStartWorkout }: WorkoutCardProps) {
  const { title, duration, exercises } = session
  const isActive = workoutStatus === 'active'

  return (
    <Card className="workout-card" delay={0.1}>
      <MovementGraphic />

      <span className="workout-card__label session-label">{SESSION_LABEL}</span>
      <h2 className="workout-card__title">{title}</h2>
      <p className="workout-card__details">
        {duration} · {exercises.length} 個動作
      </p>

      <div className="workout-card__tags">
        {WORKOUT_FOCUS_TAGS.map((tag) => (
          <span key={tag} className="workout-card__tag">
            {tag}
          </span>
        ))}
      </div>

      <button
        type="button"
        className={`workout-card__button sps-action-primary${isActive ? ' workout-card__button--resume' : ''}`}
        onClick={onStartWorkout}
      >
        {isActive ? '繼續訓練' : '開始今日訓練'}
      </button>

      {isActive && (
        <p className="workout-card__confirmation" role="status">
          訓練進行中，可隨時回來繼續。
        </p>
      )}
    </Card>
  )
}
