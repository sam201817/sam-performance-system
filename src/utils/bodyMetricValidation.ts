import type { BodyMetricDraft, BodyMetricEntry, BodyMetricField } from '../types/bodyMetrics'

export const BODY_METRIC_LIMITS = {
  weightKg: { min: 20, max: 400 },
  bodyFatPercent: { min: 1, max: 70 },
  muscleMassKg: { min: 5, max: 150 },
  waistCm: { min: 30, max: 250 },
} as const

export const NOTES_MAX_LENGTH = 300

export type BodyMetricFieldErrors = Partial<Record<BodyMetricField | 'notes' | 'form', string>>

function parseOptionalNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const parsed = Number(trimmed)
  return Number.isFinite(parsed) ? parsed : Number.NaN
}

function validateMetricField(
  field: BodyMetricField,
  value: string,
): { value: number | null; error?: string } {
  const parsed = parseOptionalNumber(value)
  if (parsed === null) {
    return { value: null }
  }

  if (Number.isNaN(parsed)) {
    return { value: null, error: 'Enter a valid number.' }
  }

  const { min, max } = BODY_METRIC_LIMITS[field]
  if (parsed <= min || parsed >= max) {
    return {
      value: null,
      error: `Must be greater than ${min} and less than ${max}.`,
    }
  }

  return { value: parsed }
}

export function validateBodyMetricDraft(draft: BodyMetricDraft): {
  errors: BodyMetricFieldErrors
  values: Pick<BodyMetricEntry, BodyMetricField | 'notes'> | null
} {
  const errors: BodyMetricFieldErrors = {}

  const weight = validateMetricField('weightKg', draft.weightKg)
  const bodyFat = validateMetricField('bodyFatPercent', draft.bodyFatPercent)
  const muscleMass = validateMetricField('muscleMassKg', draft.muscleMassKg)
  const waist = validateMetricField('waistCm', draft.waistCm)

  if (weight.error) errors.weightKg = weight.error
  if (bodyFat.error) errors.bodyFatPercent = bodyFat.error
  if (muscleMass.error) errors.muscleMassKg = muscleMass.error
  if (waist.error) errors.waistCm = waist.error

  const notes = draft.notes.trim()
  if (notes.length > NOTES_MAX_LENGTH) {
    errors.notes = `Notes must be ${NOTES_MAX_LENGTH} characters or fewer.`
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: null }
  }

  const hasMetric =
    weight.value !== null ||
    bodyFat.value !== null ||
    muscleMass.value !== null ||
    waist.value !== null

  if (!hasMetric) {
    return {
      errors: { form: 'Enter at least one body metric before saving.' },
      values: null,
    }
  }

  return {
    errors: {},
    values: {
      weightKg: weight.value,
      bodyFatPercent: bodyFat.value,
      muscleMassKg: muscleMass.value,
      waistCm: waist.value,
      notes: notes.length > 0 ? notes : null,
    },
  }
}

export function entryToDraft(entry: BodyMetricEntry): BodyMetricDraft {
  return {
    weightKg: entry.weightKg === null ? '' : String(entry.weightKg),
    bodyFatPercent: entry.bodyFatPercent === null ? '' : String(entry.bodyFatPercent),
    muscleMassKg: entry.muscleMassKg === null ? '' : String(entry.muscleMassKg),
    waistCm: entry.waistCm === null ? '' : String(entry.waistCm),
    notes: entry.notes ?? '',
  }
}

export function createEmptyBodyMetricDraft(): BodyMetricDraft {
  return {
    weightKg: '',
    bodyFatPercent: '',
    muscleMassKg: '',
    waistCm: '',
    notes: '',
  }
}
