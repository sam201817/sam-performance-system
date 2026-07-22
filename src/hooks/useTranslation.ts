import { createContext, useContext } from 'react'
import {
  DEFAULT_LANGUAGE,
  translate,
  type SupportedLanguage,
  type TranslationParams,
} from '../i18n'

export type TranslationContextValue = {
  language: SupportedLanguage
  t: (key: string, params?: TranslationParams) => string
}

export const I18nContext = createContext<TranslationContextValue | null>(null)

export function useTranslation(): TranslationContextValue {
  const context = useContext(I18nContext)
  if (context) {
    return context
  }

  return {
    language: DEFAULT_LANGUAGE,
    t: (key: string, params?: TranslationParams) => translate(DEFAULT_LANGUAGE, key, params),
  }
}

export function createTranslationValue(language: SupportedLanguage): TranslationContextValue {
  return {
    language,
    t: (key: string, params?: TranslationParams) => translate(language, key, params),
  }
}
