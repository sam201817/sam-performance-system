import type { BodyMetricField, BodyMetricSummary } from '../../types/bodyMetrics'
import {
  formatChangeValue,
  formatMetricValue,
  getMetricLabel,
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
  const items = buildItems(summary)

  return (
    <section className="body-metric-summary-card" aria-label="Current body metrics">
      <div className="body-metric-summary-card__grid">
        {items.map(({ field, latest, change }) => (
          <div key={field} className="body-metric-summary-card__item">
            <span className="body-metric-summary-card__label">{getMetricLabel(field)}</span>
            <strong className="body-metric-summary-card__value">
              {latest === null ? '—' : formatMetricValue(field, latest)}
            </strong>
            <span className="body-metric-summary-card__change">
              {change === null ? 'No previous reading' : formatChangeValue(field, change)}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
