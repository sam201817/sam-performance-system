import type { ReactNode } from 'react'
import { SectionTitle } from '../ui/SectionTitle'
import './DashboardSection.css'

type DashboardSectionProps = {
  title: string
  children: ReactNode
  className?: string
}

export function DashboardSection({ title, children, className = '' }: DashboardSectionProps) {
  return (
    <section className={`dashboard-section ${className}`.trim()} aria-label={title}>
      <SectionTitle as="h2" title={title} />
      {children}
    </section>
  )
}
