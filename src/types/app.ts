export type AppScreen =
  | 'dashboard'
  | 'daily-check-in'
  | 'workout'
  | 'complete'
  | 'history'
  | 'history-detail'
  | 'profile'
  | 'body-composition'
  | 'settings'

export type NavigationHandler = () => void

export type NavTabId = 'home' | 'workout' | 'progress' | 'profile'

export type NavTabHandler = (tab: NavTabId) => void

export const ENABLED_NAV_TABS: NavTabId[] = ['home', 'workout', 'progress', 'profile']

export function getActiveNavTab(screen: AppScreen): NavTabId {
  if (screen === 'workout') return 'workout'
  if (screen === 'history' || screen === 'history-detail') return 'progress'
  if (screen === 'profile' || screen === 'body-composition' || screen === 'settings') return 'profile'
  if (screen === 'daily-check-in') return 'home'
  return 'home'
}
