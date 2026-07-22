import { describe, expect, it } from 'vitest'
import {
  createEmptyBodyMetricDraft,
  validateBodyMetricDraft,
} from './bodyMetricValidation'

describe('bodyMetricValidation', () => {
  it('accepts valid decimal values', () => {
    const result = validateBodyMetricDraft({
      weightKg: '80.5',
      bodyFatPercent: '18.2',
      muscleMassKg: '32.4',
      waistCm: '84.5',
      notes: 'Feeling good',
    })

    expect(result.errors).toEqual({})
    expect(result.values).toEqual({
      weightKg: 80.5,
      bodyFatPercent: 18.2,
      muscleMassKg: 32.4,
      waistCm: 84.5,
      notes: 'Feeling good',
    })
  })

  it('allows empty fields to remain null', () => {
    const result = validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      weightKg: '82',
    })

    expect(result.values?.bodyFatPercent).toBeNull()
    expect(result.values?.muscleMassKg).toBeNull()
    expect(result.values?.waistCm).toBeNull()
  })

  it('requires at least one metric', () => {
    const result = validateBodyMetricDraft(createEmptyBodyMetricDraft())
    expect(result.errors.form).toBeTruthy()
    expect(result.values).toBeNull()
  })

  it('validates weight boundaries', () => {
    expect(validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      weightKg: '20',
    }).errors.weightKg).toBeTruthy()

    expect(validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      weightKg: '400',
    }).errors.weightKg).toBeTruthy()
  })

  it('validates body fat boundaries', () => {
    expect(validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      bodyFatPercent: '1',
    }).errors.bodyFatPercent).toBeTruthy()

    expect(validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      bodyFatPercent: '70',
    }).errors.bodyFatPercent).toBeTruthy()
  })

  it('validates muscle and waist boundaries', () => {
    expect(validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      muscleMassKg: '5',
    }).errors.muscleMassKg).toBeTruthy()

    expect(validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      waistCm: '30',
    }).errors.waistCm).toBeTruthy()
  })

  it('enforces notes length limit', () => {
    const result = validateBodyMetricDraft({
      ...createEmptyBodyMetricDraft(),
      weightKg: '80',
      notes: 'a'.repeat(301),
    })

    expect(result.errors.notes).toBeTruthy()
  })
})
