/**
 * Extract a numeric weight in kilograms when the string contains one.
 * Returns null for bodyweight, time, distance, or non-numeric values.
 */
export function parseNumericWeight(weight: string): number | null {
  const normalized = weight.trim().toLowerCase()
  if (!normalized) return null

  if (/^(bw|bodyweight|體重|自重)$/.test(normalized)) {
    return null
  }

  const match = normalized.match(/(\d+(?:\.\d+)?)\s*(?:kg|公斤|kgs)?/)
  if (!match) return null

  const value = Number(match[1])
  return Number.isFinite(value) && value > 0 ? value : null
}

/**
 * Extract rep count for volume math. Ignores distance, time, and range-only strings.
 */
export function parseNumericReps(reps: string): number | null {
  const normalized = reps.trim().toLowerCase()
  if (!normalized) return null

  if (/(公尺|meter|m\b|秒|sec|min|分鐘|minute)/.test(normalized)) {
    return null
  }

  const match = normalized.match(/(\d+(?:\.\d+)?)/)
  if (!match) return null

  const value = Number(match[1])
  return Number.isFinite(value) && value > 0 ? value : null
}

export function calculateSetVolume(reps: string, weight: string): number | null {
  const numericReps = parseNumericReps(reps)
  const numericWeight = parseNumericWeight(weight)

  if (numericReps === null || numericWeight === null) {
    return null
  }

  return Math.round(numericReps * numericWeight)
}

export function calculateAverageRpe(values: readonly (number | null)[]): number | null {
  const valid = values.filter((value): value is number => value !== null)
  if (valid.length === 0) return null

  const total = valid.reduce((sum, value) => sum + value, 0)
  return Math.round((total / valid.length) * 10) / 10
}

export function calculateCompletionPercentage(completed: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((completed / total) * 100)
}

export function formatVolumeKg(volume: number): string {
  return `${volume.toLocaleString('en-US')} kg`
}

export function formatDurationMinutes(minutes: number): string {
  return `${minutes} min`
}

function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function dayDifference(from: Date, to: Date): number {
  const msPerDay = 86_400_000
  return Math.round(
    (startOfLocalDay(from).getTime() - startOfLocalDay(to).getTime()) / msPerDay,
  )
}

export function formatRelativeWorkoutDate(
  completedAt: string,
  now: Date = new Date(),
): string {
  const completedDate = new Date(completedAt)
  if (!Number.isFinite(completedDate.getTime())) {
    return 'Unknown'
  }

  const diffDays = dayDifference(now, completedDate)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays > 1 && diffDays < 7) return `${diffDays} days ago`
  if (diffDays >= 7 && diffDays < 14) return 'Last Week'

  return completedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: completedDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function calculateCurrentStreak(
  completedAtValues: readonly string[],
  now: Date = new Date(),
): number {
  if (completedAtValues.length === 0) return 0

  const uniqueDays = [...new Set(
    completedAtValues
      .map((value) => new Date(value))
      .filter((date) => Number.isFinite(date.getTime()))
      .map((date) => startOfLocalDay(date).getTime()),
  )].sort((a, b) => b - a)

  if (uniqueDays.length === 0) return 0

  const today = startOfLocalDay(now).getTime()
  const yesterday = today - 86_400_000
  const mostRecent = uniqueDays[0]

  if (mostRecent !== today && mostRecent !== yesterday) {
    return 0
  }

  let streak = 1
  for (let index = 1; index < uniqueDays.length; index += 1) {
    const expected = uniqueDays[index - 1] - 86_400_000
    if (uniqueDays[index] === expected) {
      streak += 1
      continue
    }
    break
  }

  return streak
}

export function sortSessionsNewestFirst<T extends { completedAt: string }>(
  sessions: readonly T[],
): T[] {
  return [...sessions].sort(
    (left, right) => Date.parse(right.completedAt) - Date.parse(left.completedAt),
  )
}
