import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { PREFERENCES_VERSION } from '../types/settings'
import {
  createDefaultPreferences,
  formatWeightUnitLabel,
  loadPreferences,
  savePreferences,
} from './preferencesStorage'

describe('preferencesStorage', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { language: 'zh-TW', languages: ['zh-TW'] })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads default preferences when none are stored', () => {
    expect(loadPreferences()).toEqual(createDefaultPreferences())
  })

  it('persists and reloads preferences', () => {
    const preferences = {
      version: PREFERENCES_VERSION,
      weightUnit: 'imperial' as const,
      theme: 'system' as const,
      language: 'en' as const,
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
    expect(formatWeightUnitLabel('metric', 'en')).toBe('Metric (kg)')
    expect(formatWeightUnitLabel('imperial', 'en')).toBe('Imperial (lb)')
    expect(formatWeightUnitLabel('metric', 'zh-TW')).toBe('公制 (kg)')
  })
})
