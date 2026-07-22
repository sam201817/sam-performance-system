import { BottomNav } from '../components/BottomNav'
import { useTranslation } from '../hooks/useTranslation'
import type { NavTabHandler, NavTabId } from '../types/app'
import './Profile.css'

export type ProfileProps = {
  activeTab: NavTabId
  onNavigate: NavTabHandler
  onOpenBodyComposition: () => void
  onOpenSettings: () => void
}

export function Profile({
  activeTab,
  onNavigate,
  onOpenBodyComposition,
  onOpenSettings,
}: ProfileProps) {
  const { t } = useTranslation()

  return (
    <>
      <main className="profile screen-shell">
        <header className="profile__header">
          <h1 className="profile__title">{t('profile.title')}</h1>
          <p className="profile__subtitle">{t('profile.subtitle')}</p>
        </header>

        <div className="profile__links">
          <button
            type="button"
            className="profile-link"
            onClick={onOpenBodyComposition}
          >
            <span className="profile-link__title">{t('profile.bodyComposition')}</span>
            <span className="profile-link__description">
              {t('profile.bodyCompositionDescription')}
            </span>
          </button>

          <button
            type="button"
            className="profile-link"
            onClick={onOpenSettings}
          >
            <span className="profile-link__title">{t('profile.settings')}</span>
            <span className="profile-link__description">
              {t('profile.settingsDescription')}
            </span>
          </button>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </>
  )
}
