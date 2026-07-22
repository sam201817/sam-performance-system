export const DAILY_CHECK_IN_VERSION = 1 as const

export const CHECK_IN_SCALE_MIN = 1
export const CHECK_IN_SCALE_MAX = 5

export type CheckInMetricField =
  | 'fatigue'
  | 'sleepQuality'
  | 'motivation'
  | 'muscleSoreness'

export type DailyCheckInEntry = {
  id: string
  recordedAt: string
  fatigue: number
  sleepQuality: number
  motivation: number
  muscleSoreness: number
  notes: string | null
  version: typeof DAILY_CHECK_IN_VERSION
}

export type DailyCheckInHistory = {
  version: typeof DAILY_CHECK_IN_VERSION
  entries: DailyCheckInEntry[]
}

export type DailyCheckInDraft = {
  fatigue: number | null
  sleepQuality: number | null
  motivation: number | null
  muscleSoreness: number | null
  notes: string
}

export type DailyCheckInSummary = {
  score: number
  statusLabel: string
  fatigue: number
  sleepQuality: number
  motivation: number
  muscleSoreness: number
  hasNote: boolean
}

export type DailyCheckInProps = {
  history: DailyCheckInHistory
  allowCancel: boolean
  onSaveEntry: (
    values: Omit<DailyCheckInEntry, 'id' | 'version'>,
    entryId: string | null,
  ) => void
  onCancel: () => void
}
