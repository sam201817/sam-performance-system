import './HistorySectionHeader.css'

type HistorySectionHeaderProps = {
  title: string
  subtitle?: string
}

export function HistorySectionHeader({ title, subtitle }: HistorySectionHeaderProps) {
  return (
    <header className="history-section-header">
      <h1 className="history-section-header__title">{title}</h1>
      {subtitle && <p className="history-section-header__subtitle">{subtitle}</p>}
    </header>
  )
}
