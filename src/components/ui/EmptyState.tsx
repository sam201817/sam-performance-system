import type { ReactNode } from 'react'
import './EmptyState.css'

export type EmptyStateIcon = 'workout' | 'body' | 'insights' | 'chart' | 'streak'

type EmptyStateProps = {
  icon?: EmptyStateIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  compact?: boolean
  className?: string
}

function EmptyStateIconGraphic({ icon }: { icon: EmptyStateIcon }) {
  const className = 'sps-empty-state__icon-svg'

  switch (icon) {
    case 'workout':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 14h12M8 10h8M10 6h4M5 14v4h14v-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'body':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 4v16M8 8h8M7 20h10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'insights':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 18V12M10 18V8M15 18V14M20 18V6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'chart':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 18h16M7 16V10M12 16V6M17 16v-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'streak':
      return (
        <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )
  }
}

export function EmptyState({
  icon = 'workout',
  title,
  description,
  actionLabel,
  onAction,
  compact = false,
  className = '',
}: EmptyStateProps) {
  const rootClass = [
    'sps-empty-state',
    compact ? 'sps-empty-state--compact' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  let action: ReactNode = null
  if (actionLabel && onAction) {
    action = (
      <button type="button" className="sps-empty-state__action sps-action-primary" onClick={onAction}>
        {actionLabel}
      </button>
    )
  }

  return (
    <div className={rootClass} role="status">
      <div className="sps-empty-state__icon" aria-hidden="true">
        <EmptyStateIconGraphic icon={icon} />
      </div>
      <h3 className="sps-empty-state__title">{title}</h3>
      <p className="sps-empty-state__description">{description}</p>
      {action}
    </div>
  )
}
