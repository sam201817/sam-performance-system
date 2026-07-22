import type { ReactNode } from 'react'
import './SettingsSection.css'

type SettingsSectionProps = {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="settings-section" aria-labelledby={`settings-section-${title}`}>
      <div className="settings-section__header">
        <h2 id={`settings-section-${title}`} className="settings-section__title">
          {title}
        </h2>
        {description ? (
          <p className="settings-section__description">{description}</p>
        ) : null}
      </div>
      <div className="settings-section__card">{children}</div>
    </section>
  )
}
