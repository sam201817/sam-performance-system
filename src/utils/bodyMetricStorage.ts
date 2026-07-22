import type { BodyMetricEntry, BodyMetricHistory } from '../types/bodyMetrics'
import { BODY_METRIC_VERSION } from '../types/bodyMetrics'
import { BODY_METRIC_LIMITS, NOTES_MAX_LENGTH } from './bodyMetricValidation'
import { getEntryDateKey, getLocalDateKey, sortEntriesNewestFirst } from './bodyMetricCalculations'

const STORAGE_KEY = 'sps.body-metrics.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isValidMetricValue(
  field: keyof typeof BODY_METRIC_LIMITS,
  value: unknown,
): value is number | null {
  if (value === null) return true
  if (typeof value !== 'number' || !Number.isFinite(value)) return false
  const { min, max } = BODY_METRIC_LIMITS[field]
  return value > min && value < max
}

function hasAtLeastOneMetric(entry: BodyMetricEntry): boolean {
  return (
    entry.weightKg !== null ||
    entry.bodyFatPercent !== null ||
    entry.muscleMassKg !== null ||
    entry.waistCm !== null
  )
}

function isBodyMetricEntry(value: unknown): value is BodyMetricEntry {
  if (!isRecord(value)) return false

  const entry = value as Partial<BodyMetricEntry>
  if (
    typeof entry.id !== 'string' ||
    typeof entry.recordedAt !== 'string' ||
    entry.version !== BODY_METRIC_VERSION
  ) {
    return false
  }

  if (
    !isValidMetricValue('weightKg', entry.weightKg) ||
    !isValidMetricValue('bodyFatPercent', entry.bodyFatPercent) ||
    !isValidMetricValue('muscleMassKg', entry.muscleMassKg) ||
    !isValidMetricValue('waistCm', entry.waistCm)
  ) {
    return false
  }

  if (entry.notes !== null && typeof entry.notes !== 'string') return false
  if (entry.notes !== null && entry.notes.length > NOTES_MAX_LENGTH) return false
  if (!Number.isFinite(Date.parse(entry.recordedAt))) return false

  const normalized: BodyMetricEntry = {
    id: entry.id,
    recordedAt: entry.recordedAt,
    weightKg: entry.weightKg ?? null,
    bodyFatPercent: entry.bodyFatPercent ?? null,
    muscleMassKg: entry.muscleMassKg ?? null,
    waistCm: entry.waistCm ?? null,
    notes: entry.notes ?? null,
    version: BODY_METRIC_VERSION,
  }

  return hasAtLeastOneMetric(normalized)
}

export function isBodyMetricHistory(value: unknown): value is BodyMetricHistory {
  if (!isRecord(value)) return false
  return (
    value.version === BODY_METRIC_VERSION &&
    Array.isArray(value.entries) &&
    value.entries.every(isBodyMetricEntry)
  )
}

function createEmptyHistory(): BodyMetricHistory {
  return {
    version: BODY_METRIC_VERSION,
    entries: [],
  }
}

export function loadBodyMetricHistory(): BodyMetricHistory {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createEmptyHistory()

    const parsed: unknown = JSON.parse(raw)
    if (!isBodyMetricHistory(parsed)) return createEmptyHistory()

    return {
      version: BODY_METRIC_VERSION,
      entries: sortEntriesNewestFirst(parsed.entries),
    }
  } catch {
    return createEmptyHistory()
  }
}

export function saveBodyMetricHistory(history: BodyMetricHistory): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: BODY_METRIC_VERSION,
        entries: sortEntriesNewestFirst(history.entries),
      }),
    )
  } catch {
    /* storage unavailable */
  }
}

export function createBodyMetricEntryId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `body-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export function findEntryForDate(
  history: BodyMetricHistory,
  date: Date = new Date(),
): BodyMetricEntry | null {
  const targetKey = getLocalDateKey(date)
  return (
    history.entries.find((entry) => getEntryDateKey(entry.recordedAt) === targetKey) ?? null
  )
}

export function addBodyMetricEntry(
  history: BodyMetricHistory,
  entry: Omit<BodyMetricEntry, 'id' | 'version'> & { id?: string },
): BodyMetricHistory {
  const entryDateKey = getEntryDateKey(entry.recordedAt)
  const withoutSameDay = entryDateKey
    ? history.entries.filter((existing) => getEntryDateKey(existing.recordedAt) !== entryDateKey)
    : history.entries

  const nextEntry: BodyMetricEntry = {
    ...entry,
    id: entry.id ?? createBodyMetricEntryId(),
    version: BODY_METRIC_VERSION,
  }

  if (!isBodyMetricEntry(nextEntry)) {
    return history
  }

  return {
    version: BODY_METRIC_VERSION,
    entries: sortEntriesNewestFirst([nextEntry, ...withoutSameDay]),
  }
}

export function updateBodyMetricEntry(
  history: BodyMetricHistory,
  entryId: string,
  updates: Omit<BodyMetricEntry, 'id' | 'version'>,
): BodyMetricHistory {
  const existing = history.entries.find((entry) => entry.id === entryId)
  if (!existing) return history

  const nextEntry: BodyMetricEntry = {
    ...updates,
    id: entryId,
    version: BODY_METRIC_VERSION,
  }

  if (!isBodyMetricEntry(nextEntry)) {
    return history
  }

  const entryDateKey = getEntryDateKey(nextEntry.recordedAt)
  const filtered = history.entries.filter((entry) => {
    if (entry.id === entryId) return false
    if (!entryDateKey) return true
    return getEntryDateKey(entry.recordedAt) !== entryDateKey
  })

  return {
    version: BODY_METRIC_VERSION,
    entries: sortEntriesNewestFirst([nextEntry, ...filtered]),
  }
}

export function deleteBodyMetricEntry(
  history: BodyMetricHistory,
  entryId: string,
): BodyMetricHistory {
  const nextEntries = history.entries.filter((entry) => entry.id !== entryId)
  if (nextEntries.length === history.entries.length) return history

  return {
    version: BODY_METRIC_VERSION,
    entries: nextEntries,
  }
}

export function clearBodyMetricHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* storage unavailable */
  }
}
