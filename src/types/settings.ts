export const PREFERENCES_VERSION = 1 as const

export type WeightUnit = 'metric' | 'imperial'

export type ThemePreference = 'system'

export type UserPreferences = {
  version: typeof PREFERENCES_VERSION
  weightUnit: WeightUnit
  theme: ThemePreference
}

export type SettingsFeedbackType =
  | 'backup-exported'
  | 'restore-success'
  | 'restore-invalid'
  | 'restore-unsupported'
  | 'reset-success'
  | 'error'

export type SettingsFeedback = {
  type: SettingsFeedbackType
  message: string
}
