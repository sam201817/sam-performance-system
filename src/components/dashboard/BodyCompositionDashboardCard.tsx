import { Card } from '../Card'
import { useTranslation } from '../../hooks/useTranslation'
import type { BodyCompositionCardProps } from '../../types/workout'
import {
  formatLastUpdatedLabel,
  formatWeightTrendDisplay,
  getWeightTrendArrow,
} from '../../utils/dashboardDisplay'
import { formatMetricValue } from '../../utils/bodyMetricCalculations'
import './BodyCompositionDashboardCard.css'

type BodyCompositionDashboardCardProps = BodyCompositionCardProps & {
  daysSinceUpdate: number | null
}

export function BodyCompositionDashboardCard({
  summary,
  hasEntries,
  daysSinceUpdate,
  onOpenBodyComposition,
}: BodyCompositionDashboardCardProps) {
  const { t, language } = useTranslation()
  const showReminder = daysSinceUpdate !== null && daysSinceUpdate > 7
  const weightTrend = formatWeightTrendDisplay(summary.weightChangeKg)

  return (
    <Card className="body-dashboard-card" delay={0.12} aria-label={t('dashboard.bodyComposition')}>
      <div className="body-dashboard-card__header">
        <h2 className="body-dashboard-card__title">{t('dashboard.bodyComposition')}</h2>
        {showReminder && (
          <span className="body-dashboard-card__badge" role="status">
            {t('dashboard.updateCheckIn')}
          </span>
        )}
      </div>

      {!hasEntries ? (
        <>
          <p className="body-dashboard-card__empty" role="status">
            {t('dashboard.noBodyData')}
          </p>
          <button
            type="button"
            className="body-dashboard-card__button sps-action-primary"
            onClick={onOpenBodyComposition}
          >
            {t('dashboard.addFirstCheckIn')}
          </button>
        </>
      ) : (
        <>
          <div className="body-dashboard-card__layout">
            <div className="body-dashboard-card__primary">
              <strong className="body-dashboard-card__weight">
                {summary.latestWeightKg === null
                  ? '—'
                  : formatMetricValue('weightKg', summary.latestWeightKg)}
              </strong>

              {weightTrend ? (
                <span
                  className={`body-dashboard-card__trend body-dashboard-card__trend--${weightTrend.direction}`}
                >
                  {getWeightTrendArrow(weightTrend.direction)} {weightTrend.text}
                </span>
              ) : (
                <span className="body-dashboard-card__trend body-dashboard-card__trend--flat">
                  {t('bodyComposition.noPreviousReading')}
                </span>
              )}

              <div className="body-dashboard-card__updated">
                <span className="body-dashboard-card__updated-label">{t('dashboard.lastUpdated')}</span>
                <span className="body-dashboard-card__updated-value">
                  {formatLastUpdatedLabel(daysSinceUpdate, language)}
                </span>
              </div>
            </div>

            <div className="body-dashboard-card__secondary">
              <span className="body-dashboard-card__metric-label">{t('dashboard.bodyFat')}</span>
              <strong className="body-dashboard-card__metric-value">
                {summary.latestBodyFatPercent === null
                  ? '—'
                  : formatMetricValue('bodyFatPercent', summary.latestBodyFatPercent)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            className="body-dashboard-card__button body-dashboard-card__button--secondary"
            onClick={onOpenBodyComposition}
          >
            {t('dashboard.openBodyComposition')}
          </button>
        </>
      )}
    </Card>
  )
}
