import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { translate, type SupportedLanguage } from '../i18n'
import { resolveLanguage } from '../i18n/languageStorage'
import {
  PREFERENCES_VERSION,
  type AppLanguage,
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

function isAppLanguage(value: unknown): value is AppLanguage {
  return value === 'zh-TW' || value === 'en'
}

function isLegacyPreferences(value: Record<string, unknown>): boolean {
  return (
    (value.version === 1 || value.version === PREFERENCES_VERSION) &&
    isWeightUnit(value.weightUnit) &&
    isThemePreference(value.theme)
  )
}

export function isUserPreferences(value: unknown): value is UserPreferences {
  if (!isRecord(value)) return false
  if (!isLegacyPreferences(value)) return false
  if (value.language !== undefined && !isAppLanguage(value.language)) return false
  return true
}

export function normalizePreferences(raw: Partial<UserPreferences> & { version?: number }): UserPreferences {
  return {
    version: PREFERENCES_VERSION,
    weightUnit: raw.weightUnit === 'imperial' ? 'imperial' : 'metric',
    theme: 'system',
    language: resolveLanguage(isAppLanguage(raw.language) ? raw.language : undefined),
  }
}

export function createDefaultPreferences(): UserPreferences {
  return normalizePreferences({})
}

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(SPS_STORAGE_KEYS.preferences)
    if (!raw) return createDefaultPreferences()

    const parsed: unknown = JSON.parse(raw)
    if (!isUserPreferences(parsed)) return createDefaultPreferences()

    return normalizePreferences(parsed)
  } catch {
    return createDefaultPreferences()
  }
}

export function savePreferences(preferences: UserPreferences): void {
  try {
    const normalized = normalizePreferences(preferences)
    localStorage.setItem(SPS_STORAGE_KEYS.preferences, JSON.stringify(normalized))
  } catch {
    /* storage unavailable */
  }
}

export function formatWeightUnitLabel(unit: WeightUnit, language: SupportedLanguage): string {
  const key = unit === 'metric' ? 'settings.unitsMetric' : 'settings.unitsImperial'
  return translate(language, key)
}
