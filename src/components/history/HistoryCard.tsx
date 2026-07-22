import { useTranslation } from '../../hooks/useTranslation'
import type { WorkoutHistorySession } from '../../types/workoutHistory'
import {
  formatDurationMinutes,
  formatRelativeWorkoutDate,
  formatVolumeKg,
} from '../../utils/workoutHistoryCalculations'
import './HistoryCard.css'

type HistoryCardProps = {
  session: WorkoutHistorySession
  onOpen: (sessionId: string) => void
}

export function HistoryCard({ session, onOpen }: HistoryCardProps) {
  const { t } = useTranslation()
  const relativeDate = formatRelativeWorkoutDate(session.completedAt)
  const accessibleLabel = `${session.workoutName}, ${relativeDate}, ${formatDurationMinutes(session.durationMinutes)}, ${formatVolumeKg(session.totalVolume)}, ${t('history.completed')}`

  return (
    <button
      type="button"
      className="history-card"
      aria-label={accessibleLabel}
      onClick={() => onOpen(session.id)}
    >
      <div className="history-card__header">
        <h2 className="history-card__title">{session.workoutName}</h2>
        <span className="history-card__date">{relativeDate}</span>
      </div>

      <div className="history-card__meta">
        <span>{formatDurationMinutes(session.durationMinutes)}</span>
        <span className="history-card__divider" aria-hidden="true">
          ·
        </span>
        <span>{formatVolumeKg(session.totalVolume)}</span>
      </div>

      <span className="history-card__status">{t('history.completed')}</span>
    </button>
  )
}
