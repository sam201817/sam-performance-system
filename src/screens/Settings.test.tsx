import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { Settings } from './Settings'
import { createDefaultPreferences } from '../utils/preferencesStorage'
import { createValidBackup } from '../test/backupFixtures'

describe('Settings screen', () => {
  const backup = createValidBackup()

  function renderSettings(overrides: Partial<ComponentProps<typeof Settings>> = {}) {
    return render(
      <Settings
        preferences={createDefaultPreferences()}
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
    )
  }

  it('renders settings sections and about metadata', () => {
    renderSettings()

    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Preferences' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Data Management' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Privacy' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument()
    expect(screen.getByText('Sam Performance System')).toBeInTheDocument()
    expect(screen.getByText(/Version 1\.0\.0/)).toBeInTheDocument()
  })

  it('updates units preference', async () => {
    const user = userEvent.setup()
    const onPreferencesChange = vi.fn()

    renderSettings({ onPreferencesChange })

    await user.click(screen.getByRole('button', { name: 'Imperial (lb)' }))
    expect(onPreferencesChange).toHaveBeenCalledWith({
      version: 1,
      weightUnit: 'imperial',
      theme: 'system',
    })
  })

  it('shows restore confirmation before applying backup', async () => {
    const user = userEvent.setup()
    const onConfirmRestore = vi.fn().mockResolvedValue(undefined)

    renderSettings({ onConfirmRestore })

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = new File([JSON.stringify(backup)], 'sps-backup-2026-07-22.json', {
      type: 'application/json',
    })

    await user.upload(fileInput, file)

    expect(screen.getByRole('dialog', { name: 'Restore backup?' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Restore Backup' }))
    expect(onConfirmRestore).toHaveBeenCalledWith(backup)
  })

  it('requires double confirmation before reset', async () => {
    const user = userEvent.setup()
    const onResetAllData = vi.fn()

    renderSettings({ onResetAllData })

    await user.click(screen.getByRole('button', { name: 'Reset All Data' }))
    expect(screen.getByRole('dialog', { name: 'Reset all SPS data?' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continue' }))
    expect(screen.getByRole('dialog', { name: 'Final confirmation' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Yes, delete everything' }))
    expect(onResetAllData).toHaveBeenCalledTimes(1)
  })

  it('shows feedback banner when provided', () => {
    renderSettings({
      feedback: {
        type: 'backup-exported',
        message: 'Backup exported as sps-backup-2026-07-22.json.',
      },
    })

    expect(screen.getByText(/Backup exported/i)).toBeInTheDocument()
  })

  it('calls export handler', async () => {
    const user = userEvent.setup()
    const onExportBackup = vi.fn()

    renderSettings({ onExportBackup })
    await user.click(screen.getByRole('button', { name: 'Export Full Backup' }))

    expect(onExportBackup).toHaveBeenCalledTimes(1)
  })

  it('dismisses feedback banner', async () => {
    const user = userEvent.setup()
    const onDismissFeedback = vi.fn()

    renderSettings({
      feedback: {
        type: 'reset-success',
        message: 'All SPS data has been reset.',
      },
      onDismissFeedback,
    })

    await user.click(screen.getByRole('button', { name: 'Dismiss message' }))
    expect(onDismissFeedback).toHaveBeenCalledTimes(1)
  })
})
