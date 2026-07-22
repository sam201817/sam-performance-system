import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import {
  PREFERENCES_VERSION,
  type ThemePreference,
  type UserPreferences,
  type WeightUnit,
} from '../types/settings'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isWeightUnit(value: unknown): value is WeightUnit {
  return value === 'metric' || value === 'imperial'
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'system'
}

export function isUserPreferences(value: unknown): value is UserPreferences {
  if (!isRecord(value)) return false
  return (
    value.version === PREFERENCES_VERSION &&
    isWeightUnit(value.weightUnit) &&
    isThemePreference(value.theme)
  )
}

export function createDefaultPreferences(): UserPreferences {
  return {
    version: PREFERENCES_VERSION,
    weightUnit: 'metric',
    theme: 'system',
  }
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(SPS_STORAGE_KEYS.preferences)
    if (!raw) return createDefaultPreferences()

    const parsed: unknown = JSON.parse(raw)
    if (!isUserPreferences(parsed)) return createDefaultPreferences()

    return parsed
  } catch {
    return createDefaultPreferences()
  }
}

export function savePreferences(preferences: UserPreferences): void {
  try {
    if (!isUserPreferences(preferences)) return
    localStorage.setItem(SPS_STORAGE_KEYS.preferences, JSON.stringify(preferences))
  } catch {
    /* storage unavailable */
  }
}

export function formatWeightUnitLabel(unit: WeightUnit): string {
  return unit === 'metric' ? 'Metric (kg)' : 'Imperial (lb)'
}
