import { useTranslation } from '../../hooks/useTranslation'
import type { ChartPoint } from '../../types/bodyMetrics'
import { EmptyState } from '../ui/EmptyState'
import './MetricTrendChart.css'

type MetricTrendChartProps = {
  label: string
  points: ChartPoint[]
}

export function MetricTrendChart({ label, points }: MetricTrendChartProps) {
  const { t } = useTranslation()

  if (points.length === 0) {
    return (
      <div className="metric-trend-chart metric-trend-chart--empty">
        <EmptyState
          icon="chart"
          title={t('emptyStates.trendTitle')}
          description={t('emptyStates.trendDescription')}
          compact
        />
      </div>
    )
  }

  const width = 320
  const height = 140
  const padding = 16
  const plotWidth = width - padding * 2
  const plotHeight = height - padding * 2

  const coordinates = points.map((point) => ({
    x: padding + point.x * plotWidth,
    y: padding + point.y * plotHeight,
  }))

  const polyline = coordinates.map((point) => `${point.x},${point.y}`).join(' ')
  const description = t('bodyComposition.trendReadings', {
    metric: label,
    count: points.length,
  })

  return (
    <div className="metric-trend-chart" role="img" aria-label={description}>
      <svg
        className="metric-trend-chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <polyline
          className="metric-trend-chart__line"
          fill="none"
          points={polyline}
        />
        {coordinates.map((point, index) => (
          <circle
            key={points[index].id}
            className="metric-trend-chart__point"
            cx={point.x}
            cy={point.y}
            r={points.length === 1 ? 5 : 3.5}
          />
        ))}
      </svg>
    </div>
  )
}
