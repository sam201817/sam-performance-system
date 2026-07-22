import { getLocaleArray } from '../i18n'
import { useTranslation } from '../hooks/useTranslation'
import { formatDashboardDate } from '../utils/dailyMessage'
import './Greeting.css'

type GreetingProps = {
  now?: Date
}

function getGreetingKey(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'greeting.morning'
  if (hour < 18) return 'greeting.afternoon'
  return 'greeting.evening'
}

function getDailyMessageIndex(date: Date): number {
  const dayKey =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  return dayKey
}

export function Greeting({ now = new Date() }: GreetingProps) {
  const { t, language } = useTranslation()
  const messages = getLocaleArray(language, 'greeting.messages')
  const messageIndex =
    messages.length === 0 ? 0 : getDailyMessageIndex(now) % messages.length

  return (
    <section className="greeting" aria-label="Dashboard greeting">
      <h1 className="greeting__title">{t(getGreetingKey(now))}</h1>
      <p className="greeting__date">{formatDashboardDate(now, language)}</p>
      <p className="greeting__subtitle">{messages[messageIndex] ?? ''}</p>
    </section>
  )
}
