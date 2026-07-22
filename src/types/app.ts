export type AppScreen = 'dashboard' | 'workout' | 'complete' | 'history' | 'history-detail'

export type NavigationHandler = () => void

export type NavTabId = 'home' | 'workout' | 'progress' | 'profile'

export type NavTabHandler = (tab: NavTabId) => void

export const ENABLED_NAV_TABS: NavTabId[] = ['home', 'workout', 'progress']

export function getActiveNavTab(screen: AppScreen): NavTabId {
  if (screen === 'workout') return 'workout'
  if (screen === 'history' || screen === 'history-detail') return 'progress'
  return 'home'
}
