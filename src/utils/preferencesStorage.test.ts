import { describe, expect, it } from 'vitest'
import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { PREFERENCES_VERSION } from '../types/settings'
import {
  createDefaultPreferences,
  formatWeightUnitLabel,
  loadPreferences,
  savePreferences,
} from './preferencesStorage'

describe('preferencesStorage', () => {
  it('loads default preferences when none are stored', () => {
    expect(loadPreferences()).toEqual(createDefaultPreferences())
  })

  it('persists and reloads preferences', () => {
    const preferences = {
      version: PREFERENCES_VERSION,
      weightUnit: 'imperial' as const,
      theme: 'system' as const,
    }

    savePreferences(preferences)
    expect(loadPreferences()).toEqual(preferences)
    expect(localStorage.getItem(SPS_STORAGE_KEYS.preferences)).toBeTruthy()
  })

  it('falls back to defaults for invalid stored preferences', () => {
    localStorage.setItem(SPS_STORAGE_KEYS.preferences, '{"weightUnit":"metric"}')
    expect(loadPreferences()).toEqual(createDefaultPreferences())
  })

  it('formats weight unit labels', () => {
    expect(formatWeightUnitLabel('metric')).toBe('Metric (kg)')
    expect(formatWeightUnitLabel('imperial')).toBe('Imperial (lb)')
  })
})
