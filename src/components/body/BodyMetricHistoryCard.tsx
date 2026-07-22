import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import type { BodyMetricEntry, BodyMetricField } from '../../types/bodyMetrics'
import {
  formatMetricValue,
  formatRelativeBodyDate,
} from '../../utils/bodyMetricCalculations'
import './BodyMetricHistoryCard.css'

type BodyMetricHistoryCardProps = {
  entry: BodyMetricEntry
  onEdit: (entryId: string) => void
  onDelete: (entryId: string) => void
}

const METRIC_FIELDS: BodyMetricField[] = [
  'weightKg',
  'bodyFatPercent',
  'muscleMassKg',
  'waistCm',
]

export function BodyMetricHistoryCard({ entry, onEdit, onDelete }: BodyMetricHistoryCardProps) {
  const { t, language } = useTranslation()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const metricLines = METRIC_FIELDS.flatMap((field) => {
    const value = entry[field]
    if (value === null) return []
    return [`${t(`metrics.${field}`)}: ${formatMetricValue(field, value)}`]
  })

  return (
    <article className="body-metric-history-card">
      <div className="body-metric-history-card__header">
        <h3 className="body-metric-history-card__date">
          {formatRelativeBodyDate(entry.recordedAt, language)}
        </h3>
        <div className="body-metric-history-card__actions">
          <button
            type="button"
            className="body-metric-history-card__action"
            onClick={() => onEdit(entry.id)}
          >
            {t('bodyComposition.edit')}
          </button>
          {!confirmDelete ? (
            <button
              type="button"
              className="body-metric-history-card__action body-metric-history-card__action--danger"
              onClick={() => setConfirmDelete(true)}
            >
              {t('bodyComposition.delete')}
            </button>
          ) : (
            <div className="body-metric-history-card__confirm" role="status">
              <span>{t('bodyComposition.deleteConfirm')}</span>
              <button
                type="button"
                className="body-metric-history-card__action"
                onClick={() => setConfirmDelete(false)}
              >
                {t('buttons.cancel')}
              </button>
              <button
                type="button"
                className="body-metric-history-card__action body-metric-history-card__action--danger"
                onClick={() => onDelete(entry.id)}
              >
                {t('buttons.confirm')}
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
