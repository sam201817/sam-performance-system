import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { I18nProvider } from '../i18n/I18nProvider'
import { Settings } from './Settings'
import { createDefaultPreferences } from '../utils/preferencesStorage'
import { createValidBackup } from '../test/backupFixtures'

function renderSettings(
  language: 'zh-TW' | 'en' = 'zh-TW',
  overrides: Partial<ComponentProps<typeof Settings>> = {},
) {
  const backup = createValidBackup()
  return render(
    <I18nProvider language={language}>
      <Settings
        preferences={{ ...createDefaultPreferences(), language }}
        activeTab="profile"
        feedback={null}
        onNavigate={vi.fn()}
        onBack={vi.fn()}
        onPreferencesChange={vi.fn()}
        onExportBackup={vi.fn()}
        onValidateRestoreFile={vi.fn().mockResolvedValue({ valid: true, backup })}
        onConfirmRestore={vi.fn().mockResolvedValue(undefined)}
        onResetAllData={vi.fn()}
        onDismissFeedback={vi.fn()}
        {...overrides}
      />
    </I18nProvider>,
  )
}

describe('Settings screen', () => {
  it('renders settings sections in Traditional Chinese', () => {
    renderSettings('zh-TW')

    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '偏好設定' })).toBeInTheDocument()
    expect(screen.getByText(/Version 1\.0\.1/)).toBeInTheDocument()
  })

  it('renders settings sections in English', () => {
    renderSettings('en')

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument()
  })

  it('updates units preference', async () => {
    const user = userEvent.setup()
    const onPreferencesChange = vi.fn()

    renderSettings('zh-TW', { onPreferencesChange })

    await user.click(screen.getByRole('button', { name: '英制 (lb)' }))
    expect(onPreferencesChange).toHaveBeenCalledWith({
      version: 2,
      weightUnit: 'imperial',
      theme: 'system',
      language: 'zh-TW',
    })
  })

  it('updates language preference', async () => {
    const user = userEvent.setup()
    const onPreferencesChange = vi.fn()

    renderSettings('zh-TW', { onPreferencesChange })

    await user.click(screen.getByRole('button', { name: 'English' }))
    expect(onPreferencesChange).toHaveBeenCalledWith({
      version: 2,
      weightUnit: 'metric',
      theme: 'system',
      language: 'en',
    })
  })
})
