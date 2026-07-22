import type { QuickStatsSummary } from '../../types/dashboard'
import { formatMetricValue } from '../../utils/bodyMetricCalculations'
import { formatQuickStatVolume } from '../../utils/dashboardCalculations'
import { DashboardSection } from './DashboardSection'
import { QuickMetricTile } from './QuickMetricTile'
import './QuickStatsRow.css'

type QuickStatsRowProps = {
  stats: QuickStatsSummary
  hasWorkoutHistory: boolean
}

export function QuickStatsRow({ stats, hasWorkoutHistory }: QuickStatsRowProps) {
  if (!hasWorkoutHistory) {
    return null
  }

  const averageDuration =
    stats.averageWorkoutDurationMinutes === null
      ? '—'
      : `${stats.averageWorkoutDurationMinutes} min`

  return (
    <DashboardSection title="Quick Stats">
      <div className="quick-stats-row">
        <QuickMetricTile label="Total workouts" value={String(stats.totalWorkouts)} />
        <QuickMetricTile label="Total volume" value={formatQuickStatVolume(stats.totalVolume)} />
        <QuickMetricTile label="Avg duration" value={averageDuration} />
        <QuickMetricTile
          label="Latest body fat"
          value={
            stats.latestBodyFatPercent === null
              ? '—'
              : formatMetricValue('bodyFatPercent', stats.latestBodyFatPercent)
          }
        />
        <QuickMetricTile
          label="Latest weight"
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
