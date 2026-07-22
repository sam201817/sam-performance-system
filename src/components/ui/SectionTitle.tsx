import type { ReactNode } from 'react'
import './SectionTitle.css'

type SectionTitleProps = {
  title: string
  description?: string
  as?: 'h2' | 'h3'
  className?: string
  children?: ReactNode
}

export function SectionTitle({
  title,
  description,
  as: Heading = 'h2',
  className = '',
  children,
}: SectionTitleProps) {
  return (
    <div className={`sps-section-title ${className}`.trim()}>
      <Heading className="sps-section-title__heading sps-overline">{title}</Heading>
      {description ? (
        <p className="sps-section-title__description sps-body-small sps-text-secondary">
          {description}
        </p>
      ) : null}
      {children}
    </div>
  )
}
