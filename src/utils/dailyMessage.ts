const MESSAGES = [
  'Ready to improve.',
  'Consistency beats intensity.',
  'One workout at a time.',
] as const

export function getDailyMessage(date: Date = new Date()): string {
  const dayKey =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  return MESSAGES[dayKey % MESSAGES.length]
}

export function getGreetingTitle(date: Date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning, Sam'
  if (hour < 18) return 'Good afternoon, Sam'
  return 'Good evening, Sam'
}

export function formatDashboardDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
