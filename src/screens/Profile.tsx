import { BottomNav } from '../components/BottomNav'
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
  return (
    <>
      <main className="profile screen-shell">
        <header className="profile__header">
          <h1 className="profile__title">Profile</h1>
          <p className="profile__subtitle">Manage your body data and app settings.</p>
        </header>

        <div className="profile__links">
          <button
            type="button"
            className="profile-link"
            onClick={onOpenBodyComposition}
          >
            <span className="profile-link__title">Body Composition</span>
            <span className="profile-link__description">
              Track weight, body fat, muscle, and waist trends.
            </span>
          </button>

          <button
            type="button"
            className="profile-link"
            onClick={onOpenSettings}
          >
            <span className="profile-link__title">Settings</span>
            <span className="profile-link__description">
              Preferences, backups, privacy, and data management.
            </span>
          </button>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </>
  )
}
