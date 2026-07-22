/**
 * Safely parse common rest duration strings into seconds.
 * Supports formats like "45 sec", "60 秒", "1 min", "1.5 min".
 * Falls back to 60 seconds when parsing fails.
 */
export function parseRestDuration(rest: string | undefined): number {
  if (!rest) return 60

  const normalized = rest.trim().toLowerCase()

  const secondsMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:sec|秒|s)(?:\s|$)/)
  if (secondsMatch) {
    const value = Number(secondsMatch[1])
    return Number.isFinite(value) ? Math.max(0, Math.round(value)) : 60
  }

  const minutesMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:min|分|minute|minutes)(?:\s|$)/)
  if (minutesMatch) {
    const value = Number(minutesMatch[1])
    return Number.isFinite(value) ? Math.max(0, Math.round(value * 60)) : 60
  }

  const digitsOnly = normalized.match(/^(\d+)$/)
  if (digitsOnly) {
    const value = Number(digitsOnly[1])
    return Number.isFinite(value) ? Math.max(0, value) : 60
  }

  return 60
}

export function formatTimerDisplay(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds)
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
