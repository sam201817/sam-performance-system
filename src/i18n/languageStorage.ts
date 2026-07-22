import { SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  type SupportedLanguage,
} from './index'

const STORED_LANGUAGE_KEY = SPS_STORAGE_KEYS.language

function readStoredLanguage(): SupportedLanguage | null {
  try {
    const raw = localStorage.getItem(STORED_LANGUAGE_KEY)
    if (!raw) return null
    return isSupportedLanguage(raw) ? raw : null
  } catch {
    return null
  }
}

export function detectBrowserLanguage(): SupportedLanguage {
  if (typeof navigator === 'undefined') {
    return DEFAULT_LANGUAGE
  }

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language]

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase()

    if (
      normalized === 'zh-tw' ||
      normalized === 'zh-hant' ||
      normalized.startsWith('zh-tw') ||
      normalized.startsWith('zh-hant')
    ) {
      return 'zh-TW'
    }
  }

  return 'en'
}

export function resolveLanguage(storedLanguage: SupportedLanguage | undefined): SupportedLanguage {
  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage
  }

  const legacyStoredLanguage = readStoredLanguage()
  if (legacyStoredLanguage) {
    return legacyStoredLanguage
  }

  return detectBrowserLanguage()
}

export function persistLanguage(language: SupportedLanguage): void {
  try {
    localStorage.setItem(STORED_LANGUAGE_KEY, language)
  } catch {
    /* storage unavailable */
  }
}

export function clearStoredLanguage(): void {
  try {
    localStorage.removeItem(STORED_LANGUAGE_KEY)
  } catch {
    /* storage unavailable */
  }
}

export { STORED_LANGUAGE_KEY }
