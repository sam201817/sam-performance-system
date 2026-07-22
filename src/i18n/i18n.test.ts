import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import {
  DEFAULT_LANGUAGE,
  getLocaleTag,
  translate,
} from '../i18n'
import {
  detectBrowserLanguage,
  resolveLanguage,
  clearStoredLanguage,
} from '../i18n/languageStorage'
import {
  createDefaultPreferences,
  loadPreferences,
  savePreferences,
} from '../utils/preferencesStorage'

describe('i18n', () => {
  it('translates nested keys with interpolation', () => {
    expect(translate('en', 'dashboard.exercises', { count: 3 })).toBe('3 exercises')
    expect(translate('zh-TW', 'dashboard.exercises', { count: 3 })).toBe('3 個動作')
  })

  it('falls back to default language for missing keys', () => {
    expect(translate('en', 'missing.key.path')).toBe('missing.key.path')
  })

  it('returns locale tags for formatting', () => {
    expect(getLocaleTag('zh-TW')).toBe('zh-TW')
    expect(getLocaleTag('en')).toBe('en-US')
  })
})

describe('languageStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    clearStoredLanguage()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('detects Traditional Chinese browser languages', () => {
    vi.stubGlobal('navigator', { language: 'zh-TW', languages: ['zh-TW'] })
    expect(detectBrowserLanguage()).toBe('zh-TW')

    vi.stubGlobal('navigator', { language: 'zh-Hant-TW', languages: ['zh-Hant-TW'] })
    expect(detectBrowserLanguage()).toBe('zh-TW')
  })

  it('defaults to English for non-Chinese browser languages', () => {
    vi.stubGlobal('navigator', { language: 'en-US', languages: ['en-US'] })
    expect(detectBrowserLanguage()).toBe('en')
  })

  it('uses stored preference when available', () => {
    expect(resolveLanguage('en')).toBe('en')
    expect(resolveLanguage('zh-TW')).toBe('zh-TW')
  })

  it('persists language in preferences', () => {
    savePreferences({
      ...createDefaultPreferences(),
      language: 'en',
    })

    expect(loadPreferences().language).toBe('en')
  })

  it('defaults preferences language using browser detection', () => {
    vi.stubGlobal('navigator', { language: 'en-US', languages: ['en-US'] })
    expect(createDefaultPreferences().language).toBe('en')
    expect(DEFAULT_LANGUAGE).toBe('zh-TW')
  })
})
