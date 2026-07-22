export type AppScreen = 'dashboard' | 'workout' | 'complete'

export type NavigationHandler = () => void

export type NavTabId = 'home' | 'workout' | 'progress' | 'profile'

export type NavTabHandler = (tab: NavTabId) => void

export const ENABLED_NAV_TABS: NavTabId[] = ['home', 'workout']

export function getActiveNavTab(screen: AppScreen): NavTabId {
  return screen === 'workout' ? 'workout' : 'home'
}
