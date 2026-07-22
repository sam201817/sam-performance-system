import { en, type LocaleMessages } from '../locales/en'
import { zhTW } from '../locales/zh-TW'

export const SUPPORTED_LANGUAGES = ['zh-TW', 'en'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh-TW'

export const locales: Record<SupportedLanguage, LocaleMessages> = {
  'zh-TW': zhTW,
  en,
}

export type TranslationParams = Record<string, string | number>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getNestedValue(source: LocaleMessages, key: string): unknown {
  return key.split('.').reduce<unknown>((current, segment) => {
    if (!isRecord(current)) return undefined
    return current[segment]
  }, source)
}

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template

  return Object.entries(params).reduce(
    (result, [paramKey, paramValue]) =>
      result.replace(new RegExp(`\\{\\{${paramKey}\\}\\}`, 'g'), String(paramValue)),
    template,
  )
}

export function translate(
  language: SupportedLanguage,
  key: string,
  params?: TranslationParams,
): string {
  const value = getNestedValue(locales[language], key)

  if (typeof value === 'string') {
    return interpolate(value, params)
  }

  if (language !== DEFAULT_LANGUAGE) {
    return translate(DEFAULT_LANGUAGE, key, params)
  }

  return key
}

export function getLocaleArray(
  language: SupportedLanguage,
  key: string,
): readonly string[] {
  const value = getNestedValue(locales[language], key)
  if (Array.isArray(value) && value.every((entry) => typeof entry === 'string')) {
    return value
  }

  if (language !== DEFAULT_LANGUAGE) {
    return getLocaleArray(DEFAULT_LANGUAGE, key)
  }

  return []
}

export function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return value === 'zh-TW' || value === 'en'
}

export function getLanguageLabel(language: SupportedLanguage, locale: SupportedLanguage): string {
  return translate(locale, language === 'zh-TW' ? 'settings.languageZhTW' : 'settings.languageEn')
}

export function getLocaleTag(language: SupportedLanguage): string {
  return language === 'zh-TW' ? 'zh-TW' : 'en-US'
}
