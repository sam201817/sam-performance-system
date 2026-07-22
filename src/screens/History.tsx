import { BottomNav } from '../components/BottomNav'
import { HistoryCard } from '../components/history/HistoryCard'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { StatTile } from '../components/ui/StatTile'
import { useTranslation } from '../hooks/useTranslation'
import type { HistoryProps } from '../types/workout'
import { formatVolumeKg } from '../utils/workoutHistoryCalculations'
import './History.css'

export function History({
  sessions,
  statistics,
  activeTab,
  onNavigate,
  onOpenSession,
}: HistoryProps) {
  const { t } = useTranslation()
  const averageDuration =
    statistics.averageDurationMinutes === null
      ? '—'
      : `${statistics.averageDurationMinutes} ${t('dashboard.min')}`

  return (
    <>
      <main className="history screen-shell">
        <PageHeader title={t('history.title')} />

        <section className="history__stats" aria-label={t('history.title')}>
          <StatTile label={t('history.totalWorkouts')} value={String(statistics.totalWorkouts)} />
          <StatTile label={t('history.totalVolume')} value={formatVolumeKg(statistics.totalVolume)} />
          <StatTile label={t('history.averageDuration')} value={averageDuration} />
          <StatTile
            label={t('history.currentStreak')}
            value={`${statistics.currentStreak} ${t('dashboard.days')}`}
          />
        </section>

        {sessions.length === 0 ? (
          <EmptyState
            icon="workout"
            title={t('emptyStates.workoutsTitle')}
            description={t('emptyStates.workoutsDescription')}
            actionLabel={t('emptyStates.workoutsAction')}
            onAction={() => onNavigate('workout')}
          />
        ) : (
          <section className="history__list" aria-label={t('history.title')}>
            {sessions.map((session) => (
              <HistoryCard key={session.id} session={session} onOpen={onOpenSession} />
            ))}
          </section>
        )}
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </>
  )
}
