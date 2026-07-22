import { Card } from './Card'
import type { BodyCompositionCardProps } from '../types/workout'
import {
  formatChangeValue,
  formatMetricValue,
  formatRelativeBodyDate,
} from '../utils/bodyMetricCalculations'
import './BodyGoalCard.css'

export function BodyGoalCard({
  summary,
  hasEntries,
  onOpenBodyComposition,
}: BodyCompositionCardProps) {
  return (
    <Card className="body-goal-card" delay={0.15}>
      <h2 className="body-goal-card__title">Body Composition</h2>

      {!hasEntries ? (
        <>
          <p className="body-goal-card__note">
            Start tracking weight, body fat, muscle, and waist to see progress here.
          </p>
          <button
            type="button"
            className="body-goal-card__button sps-action-primary"
            onClick={onOpenBodyComposition}
          >
            Add First Check-in
          </button>
        </>
      ) : (
        <>
          <div className="body-goal-card__stats body-goal-card__stats--compact">
            <div className="body-goal-card__stat">
              <span className="body-goal-card__stat-label">Weight</span>
              <span className="body-goal-card__stat-value">
                {summary.latestWeightKg === null
                  ? '—'
                  : formatMetricValue('weightKg', summary.latestWeightKg)}
              </span>
              <span className="body-goal-card__stat-change">
                {formatChangeValue('weightKg', summary.weightChangeKg) ?? 'No previous reading'}
              </span>
            </div>
            <div className="body-goal-card__stat">
              <span className="body-goal-card__stat-label">Body Fat</span>
              <span className="body-goal-card__stat-value">
                {summary.latestBodyFatPercent === null
                  ? '—'
                  : formatMetricValue('bodyFatPercent', summary.latestBodyFatPercent)}
              </span>
            </div>
            <div className="body-goal-card__stat">
              <span className="body-goal-card__stat-label">Updated</span>
              <span className="body-goal-card__stat-value body-goal-card__stat-value--small">
                {summary.lastUpdatedAt
                  ? formatRelativeBodyDate(summary.lastUpdatedAt)
                  : '—'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="body-goal-card__button sps-action-primary"
            onClick={onOpenBodyComposition}
          >
            Open Body Composition
          </button>
        </>
      )}
    </Card>
  )
}
