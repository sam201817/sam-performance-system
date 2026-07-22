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
  return (
    <section className="greeting" aria-label="Dashboard greeting">
      <h1 className="greeting__title">{getGreetingTitle(now)}</h1>
      <p className="greeting__date">{formatDashboardDate(now)}</p>
      <p className="greeting__subtitle">{getDailyMessage(now)}</p>
    </section>
  )
}
