import './HistoryStat.css'

type HistoryStatProps = {
  label: string
  value: string
}

export function HistoryStat({ label, value }: HistoryStatProps) {
  return (
    <div className="history-stat">
      <span className="history-stat__label">{label}</span>
      <strong className="history-stat__value">{value}</strong>
    </div>
  )
}
