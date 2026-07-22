import { getDailyMessage } from '../utils/dailyMessage'
import './Greeting.css'

const dailyMessage = getDailyMessage()

export function Greeting() {
  return (
    <section className="greeting">
      <h1 className="greeting__title">早安，Sam</h1>
      <p className="greeting__subtitle">{dailyMessage}</p>
    </section>
  )
}
