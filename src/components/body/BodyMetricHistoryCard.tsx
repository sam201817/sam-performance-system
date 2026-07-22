import { useState } from 'react'
import type { BodyMetricEntry } from '../../types/bodyMetrics'
import {
  formatMetricValue,
  formatRelativeBodyDate,
  getMetricLabel,
} from '../../utils/bodyMetricCalculations'
import './BodyMetricHistoryCard.css'

type BodyMetricHistoryCardProps = {
  entry: BodyMetricEntry
  onEdit: (entryId: string) => void
  onDelete: (entryId: string) => void
}

function buildMetricLines(entry: BodyMetricEntry): string[] {
  const lines: string[] = []

  if (entry.weightKg !== null) {
    lines.push(`${getMetricLabel('weightKg')}: ${formatMetricValue('weightKg', entry.weightKg)}`)
  }
  if (entry.bodyFatPercent !== null) {
    lines.push(
      `${getMetricLabel('bodyFatPercent')}: ${formatMetricValue('bodyFatPercent', entry.bodyFatPercent)}`,
    )
  }
  if (entry.muscleMassKg !== null) {
    lines.push(
      `${getMetricLabel('muscleMassKg')}: ${formatMetricValue('muscleMassKg', entry.muscleMassKg)}`,
    )
  }
  if (entry.waistCm !== null) {
    lines.push(`${getMetricLabel('waistCm')}: ${formatMetricValue('waistCm', entry.waistCm)}`)
  }

  return lines
}

export function BodyMetricHistoryCard({ entry, onEdit, onDelete }: BodyMetricHistoryCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const metricLines = buildMetricLines(entry)

  return (
    <article className="body-metric-history-card">
      <div className="body-metric-history-card__header">
        <h3 className="body-metric-history-card__date">
          {formatRelativeBodyDate(entry.recordedAt)}
        </h3>
        <div className="body-metric-history-card__actions">
          <button
            type="button"
            className="body-metric-history-card__action"
            onClick={() => onEdit(entry.id)}
          >
            Edit
          </button>
          {!confirmDelete ? (
            <button
              type="button"
              className="body-metric-history-card__action body-metric-history-card__action--danger"
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </button>
          ) : (
            <div className="body-metric-history-card__confirm" role="status">
              <span>Delete this check-in?</span>
              <button
                type="button"
                className="body-metric-history-card__action"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="body-metric-history-card__action body-metric-history-card__action--danger"
                onClick={() => onDelete(entry.id)}
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>

      <ul className="body-metric-history-card__metrics">
        {metricLines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>

      {entry.notes && (
        <p className="body-metric-history-card__notes">{entry.notes}</p>
      )}
    </article>
  )
}
