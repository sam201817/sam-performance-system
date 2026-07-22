import { useTranslation } from '../hooks/useTranslation'
import {
  formatDashboardDate,
  getDailyMessage,
  getGreetingTitle,
} from '../utils/dailyMessage'
import './Greeting.css'

type GreetingProps = {
  now?: Date
}

export function Greeting({ now = new Date() }: GreetingProps) {
  const { t, language } = useTranslation()

  return (
    <section className="greeting" aria-label={t('common.dashboardGreeting')}>
      <h1 className="greeting__title">{getGreetingTitle(now, language)}</h1>
      <p className="greeting__date">{formatDashboardDate(now, language)}</p>
      <p className="greeting__subtitle">{getDailyMessage(now, language)}</p>
    </section>
  )
}
