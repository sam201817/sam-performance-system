import { useEffect, useState } from 'react'
import { Card } from './Card'
import {
  cycleMetricState,
  loadReadinessMetrics,
  saveReadinessMetrics,
  type MetricKey,
  type MetricState,
  type ReadinessMetrics,
} from '../utils/readinessStorage'
import './ReadinessCard.css'

const SCORE = 82
const RING_RADIUS = 52
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

const METRIC_ROWS: { key: MetricKey; label: string }[] = [
  { key: 'sleep', label: '睡眠' },
  { key: 'energy', label: '精神' },
  { key: 'stomach', label: '胃部狀況' },
]

function stateClassName(state: MetricState): string {
  switch (state) {
    case '良好':
      return 'readiness-card__metric-value--good'
    case '普通':
      return 'readiness-card__metric-value--neutral'
    case '不佳':
      return 'readiness-card__metric-value--poor'
    default:
      return 'readiness-card__metric-value--pending'
  }
}

function getInitialProgress(): number {
  if (typeof window === 'undefined') return 0
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? SCORE : 0
}

export function ReadinessCard() {
  const [metrics, setMetrics] = useState<ReadinessMetrics>(loadReadinessMetrics)
  const [progress, setProgress] = useState(getInitialProgress)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const duration = 1100
    const start = performance.now()
    let frame = 0

    function tick(now: number) {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * SCORE))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [])

  function handleMetricClick(key: MetricKey) {
    setMetrics((prev) => {
      const next = { ...prev, [key]: cycleMetricState(prev[key]) }
      saveReadinessMetrics(next)
      return next
    })
  }

  const strokeOffset =
    RING_CIRCUMFERENCE - (progress / 100) * RING_CIRCUMFERENCE

  return (
    <Card className="readiness-card" delay={0.05}>
      <div className="readiness-card__top">
        <div className="readiness-card__ring-wrap">
          <svg
            className="readiness-card__ring"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle
              className="readiness-card__ring-track"
              cx="60"
              cy="60"
              r={RING_RADIUS}
            />
            <circle
              className="readiness-card__ring-progress"
              cx="60"
              cy="60"
              r={RING_RADIUS}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={strokeOffset}
            />
          </svg>
          <div className="readiness-card__ring-center">
            <span className="readiness-card__score">{progress}</span>
            <span className="readiness-card__score-label">準備度</span>
          </div>
        </div>

        <div className="readiness-card__info">
          <h2 className="readiness-card__title">今日狀態</h2>
          <span className="readiness-card__status">狀態良好</span>
        </div>
      </div>

      <ul className="readiness-card__metrics">
        {METRIC_ROWS.map(({ key, label }) => (
          <li key={key}>
            <button
              type="button"
              className="readiness-card__metric"
              onClick={() => handleMetricClick(key)}
            >
              <span className="readiness-card__metric-label">{label}</span>
              <span
                className={`readiness-card__metric-value ${stateClassName(metrics[key])}`}
              >
                {metrics[key]}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  )
}
