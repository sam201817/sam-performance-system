import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import type { BodyMetricDraft, BodyMetricEntry } from '../../types/bodyMetrics'
import {
  createEmptyBodyMetricDraft,
  entryToDraft,
  validateBodyMetricDraft,
} from '../../utils/bodyMetricValidation'
import { MetricInput } from './MetricInput'
import './BodyMetricForm.css'

type BodyMetricFormProps = {
  entry: BodyMetricEntry | null
  title: string
  onSave: (values: Omit<BodyMetricEntry, 'id' | 'version'>) => void
  onCancel: () => void
}

export function BodyMetricForm({ entry, title, onSave, onCancel }: BodyMetricFormProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const [draft, setDraft] = useState<BodyMetricDraft>(
    entry ? entryToDraft(entry) : createEmptyBodyMetricDraft(),
  )
  const [errors, setErrors] = useState<ReturnType<typeof validateBodyMetricDraft>['errors']>({})

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  function updateDraft(field: keyof BodyMetricDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors({})
  }

  function handleSubmit() {
    const result = validateBodyMetricDraft(draft)
    setErrors(result.errors)
    if (!result.values) return

    onSave({
      recordedAt: entry?.recordedAt ?? new Date().toISOString(),
      ...result.values,
    })
  }

  return (
    <div className="body-metric-form-overlay">
      <div
        ref={dialogRef}
        className="body-metric-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="body-metric-form-title"
        tabIndex={-1}
      >
        <h2 id="body-metric-form-title" className="body-metric-form__title">
          {title}
        </h2>

        <div className="body-metric-form__fields">
          <MetricInput
            label={t('metrics.weightKg')}
            unit={t('common.kg')}
            value={draft.weightKg}
            error={errors.weightKg}
            onChange={(value) => updateDraft('weightKg', value)}
          />
          <MetricInput
            label={t('metrics.bodyFatPercent')}
            unit={t('common.percent')}
            value={draft.bodyFatPercent}
            error={errors.bodyFatPercent}
            onChange={(value) => updateDraft('bodyFatPercent', value)}
          />
          <MetricInput
            label={t('metrics.muscleMassKg')}
            unit={t('common.kg')}
            value={draft.muscleMassKg}
            error={errors.muscleMassKg}
            onChange={(value) => updateDraft('muscleMassKg', value)}
          />
          <MetricInput
            label={t('metrics.waistCm')}
            unit={t('common.cm')}
            value={draft.waistCm}
            error={errors.waistCm}
            onChange={(value) => updateDraft('waistCm', value)}
          />

          <div className="metric-input">
            <label className="metric-input__label" htmlFor="body-metric-notes">
              {t('bodyComposition.notes')}
            </label>
            <textarea
              id="body-metric-notes"
              className="body-metric-form__notes"
              value={draft.notes}
              aria-invalid={errors.notes ? true : undefined}
              aria-describedby={errors.notes ? 'body-metric-notes-error' : undefined}
              onChange={(event) => updateDraft('notes', event.target.value)}
            />
            {errors.notes && (
              <p className="metric-input__error" id="body-metric-notes-error" role="alert">
                {errors.notes}
              </p>
            )}
          </div>

          {errors.form && (
            <p className="body-metric-form__form-error" role="alert">
              {errors.form}
            </p>
          )}
        </div>

        <div className="body-metric-form__actions">
          <button
            type="button"
            className="body-metric-form__button body-metric-form__button--secondary"
            onClick={onCancel}
          >
            {t('buttons.cancel')}
          </button>
          <button
            type="button"
            className="body-metric-form__button body-metric-form__button--primary sps-action-primary"
            onClick={handleSubmit}
          >
            {t('buttons.save')}
          </button>
        </div>
      </div>
    </div>
  )
}
