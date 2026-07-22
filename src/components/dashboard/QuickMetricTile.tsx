import { memo } from 'react'
import './QuickMetricTile.css'

type QuickMetricTileProps = {
  label: string
  value: string
}

export const QuickMetricTile = memo(function QuickMetricTile({
  label,
  value,
}: QuickMetricTileProps) {
  return (
    <div className="quick-metric-tile">
      <strong className="quick-metric-tile__value">{value}</strong>
      <span className="quick-metric-tile__label">{label}</span>
    </div>
  )
})
