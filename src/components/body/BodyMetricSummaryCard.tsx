import { useTranslation } from '../../hooks/useTranslation'
import type { BodyMetricField, BodyMetricSummary } from '../../types/bodyMetrics'
import {
  formatChangeValue,
  formatMetricValue,
} from '../../utils/bodyMetricCalculations'
import './BodyMetricSummaryCard.css'

type SummaryItem = {
  field: BodyMetricField
  latest: number | null
  change: number | null
}

type BodyMetricSummaryCardProps = {
  summary: BodyMetricSummary
}

function buildItems(summary: BodyMetricSummary): SummaryItem[] {
  return [
    { field: 'weightKg', latest: summary.latestWeightKg, change: summary.weightChangeKg },
    {
      field: 'bodyFatPercent',
      latest: summary.latestBodyFatPercent,
      change: summary.bodyFatChangePercent,
    },
    {
      field: 'muscleMassKg',
      latest: summary.latestMuscleMassKg,
      change: summary.muscleMassChangeKg,
    },
    { field: 'waistCm', latest: summary.latestWaistCm, change: summary.waistChangeCm },
  ]
}

export function BodyMetricSummaryCard({ summary }: BodyMetricSummaryCardProps) {
  const { t } = useTranslation()
  const items = buildItems(summary)

  return (
    <section className="body-metric-summary-card" aria-label={t('bodyComposition.currentMetrics')}>
      <div className="body-metric-summary-card__grid">
        {items.map(({ field, latest, change }) => (
          <div key={field} className="body-metric-summary-card__item">
            <span className="body-metric-summary-card__label">{t(`metrics.${field}`)}</span>
            <strong className="body-metric-summary-card__value">
              {latest === null ? '—' : formatMetricValue(field, latest)}
            </strong>
            <span className="body-metric-summary-card__change">
              {change === null ? t('bodyComposition.noPreviousReading') : formatChangeValue(field, change)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
