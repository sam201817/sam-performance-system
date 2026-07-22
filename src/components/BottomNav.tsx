import { memo } from 'react'
import { useTranslation } from '../hooks/useTranslation'
import { ENABLED_NAV_TABS, type NavTabId } from '../types/app'
import type { BottomNavProps } from '../types/workout'
import './BottomNav.css'

const TABS: NavTabId[] = ['home', 'workout', 'progress', 'profile']

function isTabEnabled(id: NavTabId): boolean {
  return ENABLED_NAV_TABS.includes(id)
}

function NavIcon({ id, active }: { id: NavTabId; active: boolean }) {
  const stroke = active ? 'var(--primary)' : 'currentColor'

  switch (id) {
    case 'home':
      return (
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H5.5A1.5 1.5 0 0 1 4 19v-8.5z"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'workout':
      return (
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 14h12M8 10h8M10 6h4"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <rect
            x="5"
            y="14"
            width="14"
            height="4"
            rx="1.5"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
          />
        </svg>
      )
    case 'progress':
      return (
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M5 18V12M10 18V8M15 18V14M20 18V6"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'profile':
      return (
        <svg className="bottom-nav__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle
            cx="12"
            cy="8.5"
            r="3.5"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
          />
          <path
            d="M5.5 19c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6"
            fill="none"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
  }
}

export const BottomNav = memo(function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  const { t } = useTranslation()

  function handleTabClick(id: NavTabId) {
    if (!isTabEnabled(id)) return
    onNavigate(id)
  }

  const tabs = TABS.map((id) => ({ id, labelKey: `nav.${id}` as const }))

  return (
    <nav className="bottom-nav" aria-label={t('nav.main')}>
      <div className="bottom-nav__inner">
        {tabs.map(({ id, labelKey }) => {
          const enabled = isTabEnabled(id)
          const isActive = enabled && activeTab === id

          return (
            <button
              key={id}
              type="button"
              className={`bottom-nav__item${isActive ? ' bottom-nav__item--active' : ''}${!enabled ? ' bottom-nav__item--disabled' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={!enabled}
              disabled={!enabled}
              onClick={() => handleTabClick(id)}
            >
              <NavIcon id={id} active={isActive} />
              <span className="bottom-nav__label">{t(labelKey)}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
})
