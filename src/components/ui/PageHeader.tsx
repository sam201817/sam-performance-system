import type { ReactNode } from 'react'
import './PageHeader.css'

type PageHeaderProps = {
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
}

export function PageHeader({ title, subtitle, children, className = '' }: PageHeaderProps) {
  return (
    <header className={`sps-page-header ${className}`.trim()}>
      <h1 className="sps-page-header__title sps-h1">{title}</h1>
      {subtitle ? (
        <p className="sps-page-header__subtitle sps-body-small sps-text-secondary">{subtitle}</p>
      ) : null}
      {children}
    </header>
  )
}
