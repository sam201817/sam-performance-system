const MESSAGES = [
  '今天，把身體再找回來一點。',
  '穩定累積，比一次做到極限更重要。',
  '今天的訓練，是明天球場上的底氣。',
] as const

export function getDailyMessage(): string {
  const now = new Date()
  const dayKey =
    now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  return MESSAGES[dayKey % MESSAGES.length]
}
