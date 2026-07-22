import type { CSSProperties, ReactNode } from 'react'
import './Card.css'

type CardProps = {
  children: ReactNode
  className?: string
  delay?: number
  'aria-labelledby'?: string
  'aria-label'?: string
}

export function Card({
  children,
  className = '',
  delay = 0,
  'aria-labelledby': ariaLabelledBy,
  'aria-label': ariaLabel,
}: CardProps) {
  const style = { '--card-delay': `${delay}s` } as CSSProperties
  const isRegion = Boolean(ariaLabelledBy ?? ariaLabel)

  return (
    <div
      className={`card ${className}`.trim()}
      style={style}
      role={isRegion ? 'region' : undefined}
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  )
}
