import { useEffect, useState } from 'react'
import { Card } from './Card'
import { useTranslation } from '../hooks/useTranslation'
import type { DailyCheckInSummary } from '../types/dailyCheckIn'
import { getMetricDisplayClass } from '../utils/dailyCheckInCalculations'
import './ReadinessCard.css'

const METRIC_ROWS = [
  { key: 'sleepQuality' as const, labelKey: 'readiness.sleep' },
  { key: 'motivation' as const, labelKey: 'readiness.motivation' },
  { key: 'fatigue' as const, labelKey: 'readiness.fatigue' },
  { key: 'muscleSoreness' as const, labelKey: 'readiness.soreness' },
]

const RING_RADIUS = 52
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

type ReadinessCardProps = {
  summary: DailyCheckInSummary
  onEditCheckIn: () => void
}

function getInitialProgress(score: number): number {
  if (typeof window === 'undefined') return score
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? score : 0
}

function getReadinessStatusKey(score: number): string {
  if (score >= 80) return 'readiness.readyToTrain'
  if (score >= 60) return 'readiness.moderateReadiness'
  return 'readiness.takeItEasy'
}

export function ReadinessCard({ summary, onEditCheckIn }: ReadinessCardProps) {
  const { t } = useTranslation()
  const [progress, setProgress] = useState(() => getInitialProgress(summary.score))

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const duration = 900
    const start = performance.now()
    let frame = 0

    function tick(now: number) {
      const elapsed = now - start
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setProgress(Math.round(eased * summary.score))
      if (t < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [summary.score])

  const strokeOffset =
    RING_CIRCUMFERENCE - (progress / 100) * RING_CIRCUMFERENCE

  return (
    <Card className="readiness-card" delay={0.08} aria-label={t('readiness.title')}>
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
            <span className="readiness-card__score-label">{t('readiness.title')}</span>
          </div>
        </div>

        <div className="readiness-card__info">
          <h2 className="readiness-card__title">{t('readiness.todayCheckIn')}</h2>
          <span className="readiness-card__status">{t(getReadinessStatusKey(summary.score))}</span>
          {summary.hasNote && (
            <span className="readiness-card__note-indicator">{t('readiness.noteSaved')}</span>
          )}
        </div>
      </div>

      <ul className="readiness-card__metrics">
        {METRIC_ROWS.map(({ key, labelKey }) => (
          <li key={key}>
            <div className="readiness-card__metric">
              <span className="readiness-card__metric-label">{t(labelKey)}</span>
              <span
                className={`readiness-card__metric-value ${getMetricDisplayClass(key, summary[key])}`}
              >
                {summary[key]}/5
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="readiness-card__edit"
        onClick={onEditCheckIn}
      >
        {t('readiness.updateCheckIn')}
      </button>
    </Card>
  )
}
