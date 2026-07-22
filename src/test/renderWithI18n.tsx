import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement } from 'react'
import { I18nProvider } from '../i18n/I18nProvider'
import type { SupportedLanguage } from '../i18n'

type RenderWithI18nOptions = RenderOptions & {
  language?: SupportedLanguage
}

export function renderWithI18n(
  ui: ReactElement,
  { language = 'zh-TW', ...options }: RenderWithI18nOptions = {},
) {
  return render(<I18nProvider language={language}>{ui}</I18nProvider>, options)
}
