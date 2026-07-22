import { Card } from '../Card'
import type { StreakSummary } from '../../types/dashboard'
import './StreakCard.css'

type StreakCardProps = {
  streak: StreakSummary
  hasWorkoutHistory: boolean
}

export function StreakCard({ streak, hasWorkoutHistory }: StreakCardProps) {
  return (
    <Card className="streak-card" delay={0.18} aria-label="Training streak">
      <h2 className="streak-card__title">Streak</h2>

      {!hasWorkoutHistory ? (
        <p className="streak-card__empty" role="status">
          Build consistency one workout at a time.
        </p>
      ) : (
        <div className="streak-card__layout">
          <div className="streak-card__hero">
            <span className="streak-card__hero-label">Current streak</span>
            <strong className="streak-card__hero-value">{streak.currentStreak}</strong>
            <span className="streak-card__hero-unit">days</span>
          </div>

          <div className="streak-card__secondary">
            <div className="streak-card__metric">
              <span className="streak-card__metric-label">Longest</span>
              <strong className="streak-card__metric-value">{streak.longestStreak} days</strong>
            </div>
            <div className="streak-card__metric">
              <span className="streak-card__metric-label">Total workouts</span>
              <strong className="streak-card__metric-value">{streak.totalCompletedWorkouts}</strong>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
