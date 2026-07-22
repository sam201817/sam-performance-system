import { useState } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import type { DailyCheckInDraft, DailyCheckInEntry } from '../../types/dailyCheckIn'
import {
  createEmptyDailyCheckInDraft,
  entryToDraft,
  validateDailyCheckInDraft,
  type DailyCheckInFieldErrors,
} from '../../utils/dailyCheckInValidation'
import { CheckInScaleSelector } from './CheckInScaleSelector'
import './DailyCheckInForm.css'

const METRIC_FIELDS = [
  {
    field: 'fatigue' as const,
    labelKey: 'dailyCheckIn.fatigue',
    lowKey: 'dailyCheckIn.fatigueFresh',
    highKey: 'dailyCheckIn.fatigueExhausted',
  },
  {
    field: 'sleepQuality' as const,
    labelKey: 'dailyCheckIn.sleepQuality',
    lowKey: 'dailyCheckIn.sleepPoor',
    highKey: 'dailyCheckIn.sleepGreat',
  },
  {
    field: 'motivation' as const,
    labelKey: 'dailyCheckIn.motivation',
    lowKey: 'dailyCheckIn.motivationLow',
    highKey: 'dailyCheckIn.motivationHigh',
  },
  {
    field: 'muscleSoreness' as const,
    labelKey: 'dailyCheckIn.muscleSoreness',
    lowKey: 'dailyCheckIn.sorenessNone',
    highKey: 'dailyCheckIn.sorenessHigh',
  },
]

type DailyCheckInFormProps = {
  entry: DailyCheckInEntry | null
  submitLabel: string
  onSubmit: (values: Omit<DailyCheckInEntry, 'id' | 'version'>) => void
}

export function DailyCheckInForm({ entry, submitLabel, onSubmit }: DailyCheckInFormProps) {
  const { t } = useTranslation()
  const [draft, setDraft] = useState<DailyCheckInDraft>(
    entry ? entryToDraft(entry) : createEmptyDailyCheckInDraft(),
  )
  const [errors, setErrors] = useState<DailyCheckInFieldErrors>({})

  function updateMetric(
    field: keyof Pick<DailyCheckInDraft, 'fatigue' | 'sleepQuality' | 'motivation' | 'muscleSoreness'>,
    value: number,
  ) {
    setDraft((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
  }

  function handleSubmit() {
    const result = validateDailyCheckInDraft(draft)
    setErrors(result.errors)
    if (!result.values) return

    onSubmit({
      recordedAt: entry?.recordedAt ?? new Date().toISOString(),
      ...result.values,
    })
  }

  return (
    <form
      className="daily-check-in-form"
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <div className="daily-check-in-form__fields">
        {METRIC_FIELDS.map(({ field, labelKey, lowKey, highKey }) => (
          <CheckInScaleSelector
            key={field}
            id={`check-in-${field}`}
            label={t(labelKey)}
            lowLabel={t(lowKey)}
            highLabel={t(highKey)}
            value={draft[field]}
            error={errors[field]}
            onChange={(value) => updateMetric(field, value)}
          />
        ))}

        <div className="daily-check-in-form__notes">
          <label className="daily-check-in-form__notes-label" htmlFor="check-in-notes">
            {t('bodyComposition.notesOptional')}
          </label>
          <textarea
            id="check-in-notes"
            className="daily-check-in-form__notes-input"
            value={draft.notes}
            aria-invalid={errors.notes ? true : undefined}
            aria-describedby={errors.notes ? 'check-in-notes-error' : undefined}
            onChange={(event) => {
              setDraft((current) => ({ ...current, notes: event.target.value }))
              setErrors((current) => ({ ...current, notes: undefined }))
            }}
          />
          {errors.notes && (
            <p className="daily-check-in-form__notes-error" id="check-in-notes-error" role="alert">
              {errors.notes}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="daily-check-in-form__submit sps-action-primary">
        {submitLabel}
      </button>
    </form>
  )
}
