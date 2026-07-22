import { useMemo, type ReactNode } from 'react'
import { createTranslationValue, I18nContext } from '../hooks/useTranslation'
import type { SupportedLanguage } from '../i18n'

type I18nProviderProps = {
  language: SupportedLanguage
  children: ReactNode
}

export function I18nProvider({ language, children }: I18nProviderProps) {
  const value = useMemo(() => createTranslationValue(language), [language])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
