import { Card } from './Card'
import './WeeklyConsistency.css'

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'] as const

function getTodayIndex(): number {
  const day = new Date().getDay()
  return day === 0 ? 6 : day - 1
}

export function WeeklyConsistency() {
  const todayIndex = getTodayIndex()

  return (
    <Card className="weekly-consistency" delay={0.2}>
      <div className="weekly-consistency__header">
        <h2 className="weekly-consistency__title">本週節奏</h2>
        <p className="weekly-consistency__summary">本週完成 0 / 3</p>
      </div>

      <div className="weekly-consistency__days" role="list" aria-label="本週訓練日">
        {DAY_LABELS.map((label, index) => {
          const isToday = index === todayIndex
          return (
            <div
              key={label}
              role="listitem"
              className={`weekly-consistency__day${isToday ? ' weekly-consistency__day--today' : ''}`}
              aria-current={isToday ? 'date' : undefined}
            >
              <span className="weekly-consistency__day-label">{label}</span>
              <span className="weekly-consistency__day-dot" aria-hidden="true" />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
