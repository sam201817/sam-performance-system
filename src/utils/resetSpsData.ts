import { ALL_SPS_STORAGE_KEYS } from '../constants/spsStorageKeys'

export function resetAllSpsData(): void {
  for (const key of ALL_SPS_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key)
    } catch {
      /* storage unavailable */
    }
  }
}

export function isSpsStorageKey(key: string): boolean {
  return ALL_SPS_STORAGE_KEYS.includes(key as (typeof ALL_SPS_STORAGE_KEYS)[number])
}
