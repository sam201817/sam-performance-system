import { translate, type SupportedLanguage } from '../i18n'

export function formatRelativeDate(
  daysSinceUpdate: number | null,
  language: SupportedLanguage,
): string {
  if (daysSinceUpdate === null) return '—'
  if (daysSinceUpdate === 0) return translate(language, 'common.today')
  if (daysSinceUpdate === 1) return translate(language, 'common.yesterday')
  return translate(language, 'common.daysAgo', { count: daysSinceUpdate })
}

/** @deprecated Use formatRelativeDate instead. */
export function formatLastUpdatedLabel(
  daysSinceUpdate: number | null,
  language: SupportedLanguage,
): string {
  return formatRelativeDate(daysSinceUpdate, language)
}

export function formatWeightTrendDisplay(
  changeKg: number | null,
): { direction: 'down' | 'up' | 'flat'; text: string } | null {
  if (changeKg === null) return null

  const absolute = Math.abs(changeKg)
  const formatted = `${absolute} kg`

  if (changeKg < 0) {
    return { direction: 'down', text: formatted }
  }

  if (changeKg > 0) {
    return { direction: 'up', text: formatted }
  }

  return { direction: 'flat', text: formatted }
}

export function getWeightTrendArrow(direction: 'down' | 'up' | 'flat'): string {
  switch (direction) {
    case 'down':
      return '▼'
    case 'up':
      return '▲'
    default:
      return '—'
  }
}
