import type { DailyCheckInEntry, DailyCheckInHistory } from '../types/dailyCheckIn'
import { DAILY_CHECK_IN_VERSION } from '../types/dailyCheckIn'
import { CHECK_IN_NOTES_MAX_LENGTH } from './dailyCheckInValidation'
import { getEntryDateKey, getLocalDateKey } from './bodyMetricCalculations'

const STORAGE_KEY = 'sps.daily-check-in.v1'

function sortCheckInsNewestFirst(
  entries: readonly DailyCheckInEntry[],
): DailyCheckInEntry[] {
  return [...entries].sort(
    (left, right) => new Date(right.recordedAt).getTime() - new Date(left.recordedAt).getTime(),
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isValidScaleValue(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5
}

function isDailyCheckInEntry(value: unknown): value is DailyCheckInEntry {
  if (!isRecord(value)) return false

  const entry = value as Partial<DailyCheckInEntry>
  if (
    typeof entry.id !== 'string' ||
    typeof entry.recordedAt !== 'string' ||
    entry.version !== DAILY_CHECK_IN_VERSION
  ) {
    return false
  }

  if (
    !isValidScaleValue(entry.fatigue) ||
    !isValidScaleValue(entry.sleepQuality) ||
    !isValidScaleValue(entry.motivation) ||
    !isValidScaleValue(entry.muscleSoreness)
  ) {
    return false
  }

  if (entry.notes !== null && typeof entry.notes !== 'string') return false
  if (entry.notes !== null && entry.notes.length > CHECK_IN_NOTES_MAX_LENGTH) return false
  if (!Number.isFinite(Date.parse(entry.recordedAt))) return false

  return true
}

export function isDailyCheckInHistory(value: unknown): value is DailyCheckInHistory {
  if (!isRecord(value)) return false
  return (
    value.version === DAILY_CHECK_IN_VERSION &&
    Array.isArray(value.entries) &&
    value.entries.every(isDailyCheckInEntry)
  )
}

function createEmptyHistory(): DailyCheckInHistory {
  return {
    version: DAILY_CHECK_IN_VERSION,
    entries: [],
  }
}

export function loadDailyCheckInHistory(): DailyCheckInHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyHistory()

    const parsed: unknown = JSON.parse(raw)
    if (!isDailyCheckInHistory(parsed)) return createEmptyHistory()

    return {
      version: DAILY_CHECK_IN_VERSION,
      entries: sortCheckInsNewestFirst(parsed.entries),
    }
  } catch {
    return createEmptyHistory()
  }
}

export function saveDailyCheckInHistory(history: DailyCheckInHistory): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: DAILY_CHECK_IN_VERSION,
        entries: sortCheckInsNewestFirst(history.entries),
      }),
    )
  } catch {
    /* storage unavailable */
  }
}

export function createDailyCheckInEntryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `check-in-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function findCheckInForDate(
  history: DailyCheckInHistory,
  date: Date = new Date(),
): DailyCheckInEntry | null {
  const targetKey = getLocalDateKey(date)
  return (
    history.entries.find((entry) => getEntryDateKey(entry.recordedAt) === targetKey) ?? null
  )
}

export function addDailyCheckInEntry(
  history: DailyCheckInHistory,
  entry: Omit<DailyCheckInEntry, 'id' | 'version'> & { id?: string },
): DailyCheckInHistory {
  const entryDateKey = getEntryDateKey(entry.recordedAt)
  const withoutSameDay = entryDateKey
    ? history.entries.filter((existing) => getEntryDateKey(existing.recordedAt) !== entryDateKey)
    : history.entries

  const nextEntry: DailyCheckInEntry = {
    ...entry,
    id: entry.id ?? createDailyCheckInEntryId(),
    version: DAILY_CHECK_IN_VERSION,
  }

  if (!isDailyCheckInEntry(nextEntry)) {
    return history
  }

  return {
    version: DAILY_CHECK_IN_VERSION,
    entries: sortCheckInsNewestFirst([nextEntry, ...withoutSameDay]),
  }
}

export function updateDailyCheckInEntry(
  history: DailyCheckInHistory,
  entryId: string,
  updates: Omit<DailyCheckInEntry, 'id' | 'version'>,
): DailyCheckInHistory {
  const existing = history.entries.find((entry) => entry.id === entryId)
  if (!existing) return history

  const nextEntry: DailyCheckInEntry = {
    ...updates,
    id: entryId,
    version: DAILY_CHECK_IN_VERSION,
  }

  if (!isDailyCheckInEntry(nextEntry)) {
    return history
  }

  const entryDateKey = getEntryDateKey(nextEntry.recordedAt)
  const filtered = history.entries.filter((entry) => {
    if (entry.id === entryId) return false
    if (!entryDateKey) return true
    return getEntryDateKey(entry.recordedAt) !== entryDateKey
  })

  return {
    version: DAILY_CHECK_IN_VERSION,
    entries: sortCheckInsNewestFirst([nextEntry, ...filtered]),
  }
}

export function clearDailyCheckInHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
}

export function hasTodayCheckIn(history: DailyCheckInHistory, date: Date = new Date()): boolean {
  return findCheckInForDate(history, date) !== null
}
