import type { ReactNode } from 'react'
import './DashboardSection.css'

type DashboardSectionProps = {
  title: string
  children: ReactNode
  className?: string
}

export function DashboardSection({ title, children, className = '' }: DashboardSectionProps) {
  return (
    <section className={`dashboard-section ${className}`.trim()} aria-label={title}>
      <h2 className="dashboard-section__title">{title}</h2>
      {children}
    </section>
  )
}
