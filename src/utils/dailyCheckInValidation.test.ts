import { describe, expect, it } from 'vitest'
import { createEmptyDailyCheckInDraft, validateDailyCheckInDraft } from './dailyCheckInValidation'

describe('dailyCheckInValidation', () => {
  it('requires all metric ratings', () => {
    const result = validateDailyCheckInDraft(createEmptyDailyCheckInDraft())

    expect(result.values).toBeNull()
    expect(result.errors.fatigue).toBeDefined()
    expect(result.errors.sleepQuality).toBeDefined()
    expect(result.errors.motivation).toBeDefined()
    expect(result.errors.muscleSoreness).toBeDefined()
  })

  it('accepts a complete draft with optional notes', () => {
    const result = validateDailyCheckInDraft({
      fatigue: 3,
      sleepQuality: 4,
      motivation: 5,
      muscleSoreness: 2,
      notes: ' Slept well ',
    })

    expect(result.errors).toEqual({})
    expect(result.values).toEqual({
      fatigue: 3,
      sleepQuality: 4,
      motivation: 5,
      muscleSoreness: 2,
      notes: 'Slept well',
    })
  })

  it('rejects notes that exceed the max length', () => {
    const result = validateDailyCheckInDraft({
      fatigue: 3,
      sleepQuality: 4,
      motivation: 5,
      muscleSoreness: 2,
      notes: 'x'.repeat(301),
    })

    expect(result.values).toBeNull()
    expect(result.errors.notes).toBeDefined()
  })
})
