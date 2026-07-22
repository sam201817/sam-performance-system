import { BottomNav } from '../components/BottomNav'
import { HistoryCard } from '../components/history/HistoryCard'
import { HistorySectionHeader } from '../components/history/HistorySectionHeader'
import { HistoryStat } from '../components/history/HistoryStat'
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
        <HistorySectionHeader title={t('history.title')} />

        <section className="history__stats" aria-label={t('history.title')}>
          <HistoryStat label={t('history.totalWorkouts')} value={String(statistics.totalWorkouts)} />
          <HistoryStat label={t('history.totalVolume')} value={formatVolumeKg(statistics.totalVolume)} />
          <HistoryStat label={t('history.averageDuration')} value={averageDuration} />
          <HistoryStat
            label={t('history.currentStreak')}
            value={`${statistics.currentStreak} ${t('dashboard.days')}`}
          />
        </section>

        {sessions.length === 0 ? (
          <p className="history__empty" role="status">
            {t('history.empty')}
          </p>
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
