import { BottomNav } from '../components/BottomNav'
import { HistoryCard } from '../components/history/HistoryCard'
import { HistorySectionHeader } from '../components/history/HistorySectionHeader'
import { HistoryStat } from '../components/history/HistoryStat'
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
  const averageDuration =
    statistics.averageDurationMinutes === null
      ? '—'
      : `${statistics.averageDurationMinutes} min`

  return (
    <>
      <main className="history screen-shell">
        <HistorySectionHeader title="Workout History" />

        <section className="history__stats" aria-label="Workout statistics">
          <HistoryStat label="Total Workouts" value={String(statistics.totalWorkouts)} />
          <HistoryStat label="Total Volume" value={formatVolumeKg(statistics.totalVolume)} />
          <HistoryStat label="Average Duration" value={averageDuration} />
          <HistoryStat label="Current Streak" value={`${statistics.currentStreak} days`} />
        </section>

        {sessions.length === 0 ? (
          <p className="history__empty" role="status">
            No completed workouts yet. Finish a session to build your history.
          </p>
        ) : (
          <section className="history__list" aria-label="Completed workouts">
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
