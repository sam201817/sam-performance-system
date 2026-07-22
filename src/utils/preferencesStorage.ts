import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import { translate, type SupportedLanguage } from '../i18n'
import { resolveLanguage } from '../i18n/languageStorage'
import { isRecord } from './guards/isRecord'
import { readJsonStorage, writeJsonStorage } from './storage/jsonStorage'
import {
  PREFERENCES_VERSION,
  type AppLanguage,
  type ThemePreference,
  type UserPreferences,
  type WeightUnit,
} from '../types/settings'

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
  const parsed = readJsonStorage(
    SPS_STORAGE_KEYS.preferences,
    isUserPreferences,
    createDefaultPreferences(),
  )
  return normalizePreferences(parsed)
}

export function savePreferences(preferences: UserPreferences): boolean {
  const normalized = normalizePreferences(preferences)
  return writeJsonStorage(SPS_STORAGE_KEYS.preferences, normalized)
}

export function formatWeightUnitLabel(unit: WeightUnit, language: SupportedLanguage): string {
  const key = unit === 'metric' ? 'settings.unitsMetric' : 'settings.unitsImperial'
  return translate(language, key)
}
