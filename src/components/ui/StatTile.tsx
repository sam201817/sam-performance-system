import { memo } from 'react'
import './StatTile.css'

type StatTileProps = {
  label: string
  value: string
  variant?: 'default' | 'centered'
  className?: string
}

export const StatTile = memo(function StatTile({
  label,
  value,
  variant = 'default',
  className = '',
}: StatTileProps) {
  return (
    <div className={`sps-stat-tile sps-stat-tile--${variant} ${className}`.trim()}>
      <span className="sps-stat-tile__label">{label}</span>
      <strong className="sps-stat-tile__value">{value}</strong>
    </div>
  )
})
