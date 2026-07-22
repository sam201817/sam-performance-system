import type { DailyCheckInDraft, DailyCheckInEntry } from '../types/dailyCheckIn'
import { CHECK_IN_SCALE_MAX, CHECK_IN_SCALE_MIN } from '../types/dailyCheckIn'

export const CHECK_IN_NOTES_MAX_LENGTH = 300

export type DailyCheckInFieldErrors = Partial<
  Record<CheckInMetricField | 'notes' | 'form', string>
>

type CheckInMetricField = 'fatigue' | 'sleepQuality' | 'motivation' | 'muscleSoreness'

const REQUIRED_METRICS: CheckInMetricField[] = [
  'fatigue',
  'sleepQuality',
  'motivation',
  'muscleSoreness',
]

function isValidScaleValue(value: number | null): value is number {
  return (
    value !== null &&
    Number.isInteger(value) &&
    value >= CHECK_IN_SCALE_MIN &&
    value <= CHECK_IN_SCALE_MAX
  )
}

export function createEmptyDailyCheckInDraft(): DailyCheckInDraft {
  return {
    fatigue: null,
    sleepQuality: null,
    motivation: null,
    muscleSoreness: null,
    notes: '',
  }
}

export function entryToDraft(entry: DailyCheckInEntry): DailyCheckInDraft {
  return {
    fatigue: entry.fatigue,
    sleepQuality: entry.sleepQuality,
    motivation: entry.motivation,
    muscleSoreness: entry.muscleSoreness,
    notes: entry.notes ?? '',
  }
}

export function validateDailyCheckInDraft(draft: DailyCheckInDraft): {
  errors: DailyCheckInFieldErrors
  values: Pick<DailyCheckInEntry, CheckInMetricField | 'notes'> | null
} {
  const errors: DailyCheckInFieldErrors = {}

  for (const field of REQUIRED_METRICS) {
    if (!isValidScaleValue(draft[field])) {
      errors[field] = 'Select a rating from 1 to 5.'
    }
  }

  const trimmedNotes = draft.notes.trim()
  if (trimmedNotes.length > CHECK_IN_NOTES_MAX_LENGTH) {
    errors.notes = `Notes must be ${CHECK_IN_NOTES_MAX_LENGTH} characters or fewer.`
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: null }
  }

  return {
    errors: {},
    values: {
      fatigue: draft.fatigue as number,
      sleepQuality: draft.sleepQuality as number,
      motivation: draft.motivation as number,
      muscleSoreness: draft.muscleSoreness as number,
      notes: trimmedNotes.length > 0 ? trimmedNotes : null,
    },
  }
}
