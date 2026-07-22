import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithI18n } from '../test/renderWithI18n'
import { Settings } from './Settings'
import { createDefaultPreferences } from '../utils/preferencesStorage'
import { createValidBackup } from '../test/backupFixtures'

function renderSettings(
  language: 'zh-TW' | 'en' = 'zh-TW',
  overrides: Partial<ComponentProps<typeof Settings>> = {},
) {
  const backup = createValidBackup()
  return renderWithI18n(
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
    />,
    { language },
  )
}

describe('Settings screen', () => {
  it('renders settings sections in Traditional Chinese', () => {
    renderSettings('zh-TW')

    expect(screen.getByRole('heading', { name: '設定' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '偏好設定' })).toBeInTheDocument()
    expect(screen.getByText(/版本 1\.0\.1/)).toBeInTheDocument()
  })

  it('shows measurement and appearance as informational rows', () => {
    renderSettings('zh-TW')

    expect(screen.getByText('公制 (kg、cm)')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '英制 (lb)' })).not.toBeInTheDocument()
  })

  it('renders settings sections in English', () => {
    renderSettings('en')

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument()
    expect(screen.getByText(/Version 1\.0\.1/)).toBeInTheDocument()
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
