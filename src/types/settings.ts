export const PREFERENCES_VERSION = 2 as const

export type WeightUnit = 'metric' | 'imperial'

export type ThemePreference = 'system'

export type AppLanguage = 'zh-TW' | 'en'

export type UserPreferences = {
  version: typeof PREFERENCES_VERSION
  weightUnit: WeightUnit
  theme: ThemePreference
  language: AppLanguage
}

export type SettingsFeedbackType =
  | 'backup-exported'
  | 'restore-success'
  | 'restore-invalid'
  | 'restore-unsupported'
  | 'reset-success'
  | 'language-updated'
  | 'error'

export type SettingsFeedback = {
  type: SettingsFeedbackType
  message: string
}
