/**
 * Shared localStorage JSON helpers with graceful failure handling.
 * Returns fallback values on read/parse/validation errors; write returns success flag.
 */

export function readJsonStorage<T>(
  key: string,
  guard: (value: unknown) => value is T,
  fallback: T,
): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback

    const parsed: unknown = JSON.parse(raw)
    if (!guard(parsed)) return fallback

    return parsed
  } catch {
    return fallback
  }
}

export function writeJsonStorage(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeJsonStorage(key: string): boolean {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}
