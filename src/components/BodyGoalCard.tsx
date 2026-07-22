import { Card } from './Card'
import './BodyGoalCard.css'

const CURRENT_WEIGHT = 106
const GOAL_WEIGHT = 90
const REMAINING = CURRENT_WEIGHT - GOAL_WEIGHT

export function BodyGoalCard() {
  return (
    <Card className="body-goal-card" delay={0.15}>
      <h2 className="body-goal-card__title">身體目標</h2>

      <div className="body-goal-card__direction" aria-hidden="true">
        <div className="body-goal-card__endpoint body-goal-card__endpoint--current">
          <span className="body-goal-card__dot" />
          <span className="body-goal-card__endpoint-label">106</span>
        </div>
        <div className="body-goal-card__line">
          <span className="body-goal-card__line-track" />
          <span className="body-goal-card__line-arrow">→</span>
        </div>
        <div className="body-goal-card__endpoint body-goal-card__endpoint--goal">
          <span className="body-goal-card__dot body-goal-card__dot--goal" />
          <span className="body-goal-card__endpoint-label">90</span>
        </div>
      </div>

      <div className="body-goal-card__stats">
        <div className="body-goal-card__stat">
          <span className="body-goal-card__stat-label">目前</span>
          <span className="body-goal-card__stat-value">
            {CURRENT_WEIGHT} <span className="body-goal-card__unit">kg</span>
          </span>
        </div>
        <div className="body-goal-card__stat">
          <span className="body-goal-card__stat-label">目標</span>
          <span className="body-goal-card__stat-value">
            {GOAL_WEIGHT} <span className="body-goal-card__unit">kg</span>
          </span>
        </div>
        <div className="body-goal-card__stat body-goal-card__stat--remaining">
          <span className="body-goal-card__stat-label">還有</span>
          <span className="body-goal-card__stat-value body-goal-card__stat-value--accent">
            {REMAINING} <span className="body-goal-card__unit">kg</span>
          </span>
        </div>
      </div>

      <p className="body-goal-card__note">先保住力量，再穩定下降。</p>
    </Card>
  )
}
