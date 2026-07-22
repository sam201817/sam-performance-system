import type { BodyMetricField, MetricTrendData, TrendMetricId } from '../../types/bodyMetrics'
import {
  formatChangeValue,
  formatMetricValue,
  getMetricLabel,
} from '../../utils/bodyMetricCalculations'
import { MetricTrendChart } from './MetricTrendChart'
import './MetricTrend.css'

const METRIC_OPTIONS: TrendMetricId[] = [
  'weightKg',
  'bodyFatPercent',
  'muscleMassKg',
  'waistCm',
]

type MetricTrendProps = {
  selectedMetric: TrendMetricId
  trend: MetricTrendData
  onMetricChange: (metric: TrendMetricId) => void
}

function formatTrendValue(metric: BodyMetricField, value: number | null): string {
  return value === null ? '—' : formatMetricValue(metric, value)
}

export function MetricTrend({ selectedMetric, trend, onMetricChange }: MetricTrendProps) {
  const label = getMetricLabel(selectedMetric)

  return (
    <section className="metric-trend" aria-label="Body metric trend">
      <div className="metric-trend__selector" role="tablist" aria-label="Metric selector">
        {METRIC_OPTIONS.map((metric) => {
          const selected = metric === selectedMetric
          return (
            <button
              key={metric}
              type="button"
              role="tab"
              className={`metric-trend__tab${selected ? ' metric-trend__tab--active' : ''}`}
              aria-selected={selected}
              onClick={() => onMetricChange(metric)}
            >
              {getMetricLabel(metric)}
            </button>
          )
        })}
      </div>

      <div className="metric-trend__summary">
        <div>
          <span className="metric-trend__label">Latest</span>
          <strong className="metric-trend__value">
            {formatTrendValue(selectedMetric, trend.latestValue)}
          </strong>
        </div>
        <div>
          <span className="metric-trend__label">Change</span>
          <strong className="metric-trend__value">
            {formatChangeValue(selectedMetric, trend.absoluteChange) ?? '—'}
          </strong>
        </div>
        <div>
          <span className="metric-trend__label">Min</span>
          <strong className="metric-trend__value">
            {formatTrendValue(selectedMetric, trend.minimum)}
          </strong>
        </div>
        <div>
          <span className="metric-trend__label">Max</span>
          <strong className="metric-trend__value">
            {formatTrendValue(selectedMetric, trend.maximum)}
          </strong>
        </div>
      </div>

      <MetricTrendChart label={label} points={trend.points} />
    </section>
  )
}
