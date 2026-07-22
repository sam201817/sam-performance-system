import { useTranslation } from '../../hooks/useTranslation'
import type { QuickStatsSummary } from '../../types/dashboard'
import { formatMetricValue } from '../../utils/bodyMetricCalculations'
import { formatQuickStatVolume } from '../../utils/dashboardCalculations'
import { StatTile } from '../ui/StatTile'
import { DashboardSection } from './DashboardSection'
import './QuickStatsRow.css'

type QuickStatsRowProps = {
  stats: QuickStatsSummary
  hasWorkoutHistory: boolean
}

export function QuickStatsRow({ stats, hasWorkoutHistory }: QuickStatsRowProps) {
  const { t } = useTranslation()

  if (!hasWorkoutHistory) {
    return null
  }

  const averageDuration =
    stats.averageWorkoutDurationMinutes === null
      ? '—'
      : `${stats.averageWorkoutDurationMinutes} ${t('dashboard.min')}`

  return (
    <DashboardSection title={t('dashboard.quickStats')}>
      <div className="quick-stats-row">
        <StatTile variant="centered" label={t('dashboard.totalWorkouts')} value={String(stats.totalWorkouts)} />
        <StatTile variant="centered" label={t('dashboard.totalVolume')} value={formatQuickStatVolume(stats.totalVolume)} />
        <StatTile variant="centered" label={t('dashboard.avgDuration')} value={averageDuration} />
        <StatTile
          variant="centered"
          label={t('dashboard.latestBodyFat')}
          value={
            stats.latestBodyFatPercent === null
              ? '—'
              : formatMetricValue('bodyFatPercent', stats.latestBodyFatPercent)
          }
        />
        <StatTile
          variant="centered"
          label={t('dashboard.latestWeight')}
          value={
            stats.latestWeightKg === null
              ? '—'
              : formatMetricValue('weightKg', stats.latestWeightKg)
          }
        />
      </div>
    </DashboardSection>
  )
}
