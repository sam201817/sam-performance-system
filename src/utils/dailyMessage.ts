import { getLocaleArray, getLocaleTag, translate, type SupportedLanguage } from '../i18n'

export function getDailyMessage(date: Date = new Date(), language: SupportedLanguage): string {
  const messages = getLocaleArray(language, 'greeting.messages')
  const dayKey =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  return messages[dayKey % messages.length] ?? messages[0] ?? ''
}

export function getGreetingTitle(date: Date = new Date(), language: SupportedLanguage): string {
  const hour = date.getHours()
  if (hour < 12) return translate(language, 'greeting.morning')
  if (hour < 18) return translate(language, 'greeting.afternoon')
  return translate(language, 'greeting.evening')
}

export function formatDashboardDate(date: Date = new Date(), language: SupportedLanguage): string {
  return date.toLocaleDateString(getLocaleTag(language), {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
