import { Card } from './Card'
import { useTranslation } from '../hooks/useTranslation'
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
  const { t, language } = useTranslation()

  return (
    <Card className="body-goal-card" delay={0.15}>
      <h2 className="body-goal-card__title">{t('dashboard.bodyComposition')}</h2>

      {!hasEntries ? (
        <>
          <p className="body-goal-card__note">
            {t('dashboard.noBodyData')}
          </p>
          <button
            type="button"
            className="body-goal-card__button sps-action-primary"
            onClick={onOpenBodyComposition}
          >
            {t('dashboard.addFirstCheckIn')}
          </button>
        </>
      ) : (
        <>
          <div className="body-goal-card__stats body-goal-card__stats--compact">
            <div className="body-goal-card__stat">
              <span className="body-goal-card__stat-label">{t('metrics.weight')}</span>
              <span className="body-goal-card__stat-value">
                {summary.latestWeightKg === null
                  ? '—'
                  : formatMetricValue('weightKg', summary.latestWeightKg)}
              </span>
              <span className="body-goal-card__stat-change">
                {formatChangeValue('weightKg', summary.weightChangeKg) ??
                  t('bodyComposition.noPreviousReading')}
              </span>
            </div>
            <div className="body-goal-card__stat">
              <span className="body-goal-card__stat-label">{t('metrics.bodyFat')}</span>
              <span className="body-goal-card__stat-value">
                {summary.latestBodyFatPercent === null
                  ? '—'
                  : formatMetricValue('bodyFatPercent', summary.latestBodyFatPercent)}
              </span>
            </div>
            <div className="body-goal-card__stat">
              <span className="body-goal-card__stat-label">{t('dashboard.lastUpdated')}</span>
              <span className="body-goal-card__stat-value body-goal-card__stat-value--small">
                {summary.lastUpdatedAt
                  ? formatRelativeBodyDate(summary.lastUpdatedAt, language)
                  : '—'}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="body-goal-card__button sps-action-primary"
            onClick={onOpenBodyComposition}
          >
            {t('dashboard.openBodyComposition')}
          </button>
        </>
      )}
    </Card>
  )
}
