import { useRef, useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { ConfirmDialog } from '../components/settings/ConfirmDialog'
import { SettingsFeedbackBanner } from '../components/settings/SettingsFeedbackBanner'
import { SettingsSection } from '../components/settings/SettingsSection'
import { APP_METADATA } from '../data/appMetadata'
import type { SpsBackupPayload } from '../types/backup'
import type { SettingsFeedback, UserPreferences, WeightUnit } from '../types/settings'
import type { NavTabHandler, NavTabId } from '../types/app'
import { formatWeightUnitLabel } from '../utils/preferencesStorage'
import './Settings.css'

export type SettingsProps = {
  preferences: UserPreferences
  activeTab: NavTabId
  feedback: SettingsFeedback | null
  onNavigate: NavTabHandler
  onBack: () => void
  onPreferencesChange: (preferences: UserPreferences) => void
  onExportBackup: () => void
  onValidateRestoreFile: (file: File) => Promise<
    | { valid: true; backup: SpsBackupPayload }
    | { valid: false }
  >
  onConfirmRestore: (backup: SpsBackupPayload) => Promise<void>
  onResetAllData: () => void
  onDismissFeedback: () => void
}

type ResetStep = 'none' | 'first' | 'final'
type RestoreStep = 'none' | 'confirm'

export function Settings({
  preferences,
  activeTab,
  feedback,
  onNavigate,
  onBack,
  onPreferencesChange,
  onExportBackup,
  onValidateRestoreFile,
  onConfirmRestore,
  onResetAllData,
  onDismissFeedback,
}: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [resetStep, setResetStep] = useState<ResetStep>('none')
  const [restoreStep, setRestoreStep] = useState<RestoreStep>('none')
  const [pendingBackup, setPendingBackup] = useState<SpsBackupPayload | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  function handleWeightUnitChange(unit: WeightUnit) {
    onPreferencesChange({
      ...preferences,
      weightUnit: unit,
    })
  }

  function handleExportClick() {
    onExportBackup()
  }

  function handleRestoreClick() {
    fileInputRef.current?.click()
  }

  async function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    const result = await onValidateRestoreFile(file)
    if (!result.valid) return

    setPendingBackup(result.backup)
    setRestoreStep('confirm')
  }

  async function handleConfirmRestore() {
    if (!pendingBackup) return

    setIsRestoring(true)
    try {
      await onConfirmRestore(pendingBackup)
    } finally {
      setIsRestoring(false)
      setRestoreStep('none')
      setPendingBackup(null)
    }
  }

  function handleCancelRestore() {
    setRestoreStep('none')
    setPendingBackup(null)
  }

  function handleResetClick() {
    setResetStep('first')
  }

  function handleResetFirstConfirm() {
    setResetStep('final')
  }

  function handleResetFinalConfirm() {
    onResetAllData()
    setResetStep('none')
  }

  function handleResetCancel() {
    setResetStep('none')
  }

  return (
    <>
      <main className="settings screen-shell">
        <header className="settings__header">
          <button type="button" className="settings__back" onClick={onBack}>
            Back
          </button>
          <h1 className="settings__title">Settings</h1>
          <p className="settings__subtitle">Preferences, backups, and local data controls.</p>
        </header>

        {feedback ? (
          <SettingsFeedbackBanner feedback={feedback} onDismiss={onDismissFeedback} />
        ) : null}

        <SettingsSection
          title="Preferences"
          description="Display and measurement preferences for future updates."
        >
          <div className="settings-row">
            <div className="settings-row__content">
              <span className="settings-row__label">Units</span>
              <span className="settings-row__hint">Stored for future unit conversion support.</span>
            </div>
            <div className="settings-row__control settings-row__control--segmented">
              <button
                type="button"
                className={`settings-segment${preferences.weightUnit === 'metric' ? ' settings-segment--active' : ''}`}
                aria-pressed={preferences.weightUnit === 'metric'}
                onClick={() => handleWeightUnitChange('metric')}
              >
                Metric (kg)
              </button>
              <button
                type="button"
                className={`settings-segment${preferences.weightUnit === 'imperial' ? ' settings-segment--active' : ''}`}
                aria-pressed={preferences.weightUnit === 'imperial'}
                onClick={() => handleWeightUnitChange('imperial')}
              >
                Imperial (lb)
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row__content">
              <span className="settings-row__label">Theme</span>
              <span className="settings-row__hint">Follows your device appearance.</span>
            </div>
            <span className="settings-row__value">System default</span>
          </div>

          <p className="settings__footnote">
            Current units preference: {formatWeightUnitLabel(preferences.weightUnit)}.
          </p>
        </SettingsSection>

        <SettingsSection
          title="Data Management"
          description="Export, restore, or reset your SPS records stored in this browser."
        >
          <p className="settings__info">
            SPS data is stored locally in this browser using localStorage. Clearing browser
            data for this site may remove your records.
          </p>

          <button
            type="button"
            className="settings-action settings-action--primary sps-action-primary"
            onClick={handleExportClick}
          >
            Export Full Backup
          </button>

          <button
            type="button"
            className="settings-action"
            onClick={handleRestoreClick}
          >
            Restore from Backup
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="settings__file-input"
            aria-hidden="true"
            tabIndex={-1}
            onChange={handleFileSelected}
          />

          <button
            type="button"
            className="settings-action settings-action--danger"
            onClick={handleResetClick}
          >
            Reset All Data
          </button>
        </SettingsSection>

        <SettingsSection title="Privacy">
          <ul className="settings-list">
            <li>Your SPS data stays on this device in local browser storage.</li>
            <li>No account is required and no data is sent to a server.</li>
            <li>Clearing browser data for this site may permanently remove your records.</li>
            <li>Export backups regularly so you can recover your history if needed.</li>
          </ul>
        </SettingsSection>

        <SettingsSection title="About">
          <div className="settings-about">
            <p className="settings-about__name">{APP_METADATA.name}</p>
            <p className="settings-about__short">{APP_METADATA.shortName}</p>
            <p className="settings-about__version">Version {APP_METADATA.version}</p>
            <p className="settings-about__description">{APP_METADATA.description}</p>
            <p className="settings-about__badge">Local-first · No backend required</p>
          </div>
        </SettingsSection>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />

      {restoreStep === 'confirm' && pendingBackup ? (
        <ConfirmDialog
          title="Restore backup?"
          description={`This will replace all current SPS data on this device with the backup exported on ${new Date(pendingBackup.exportedAt).toLocaleString()} (app version ${pendingBackup.appVersion}). Your existing local data will be overwritten.`}
          confirmLabel={isRestoring ? 'Restoring…' : 'Restore Backup'}
          cancelLabel="Cancel"
          tone="danger"
          onConfirm={() => {
            if (!isRestoring) void handleConfirmRestore()
          }}
          onCancel={handleCancelRestore}
        />
      ) : null}

      {resetStep === 'first' ? (
        <ConfirmDialog
          title="Reset all SPS data?"
          description="This will permanently delete workout history, body composition records, daily check-ins, preferences, and in-progress workout data stored by SPS on this device. Unrelated browser storage will not be affected."
          confirmLabel="Continue"
          cancelLabel="Cancel"
          tone="danger"
          onConfirm={handleResetFirstConfirm}
          onCancel={handleResetCancel}
        />
      ) : null}

      {resetStep === 'final' ? (
        <ConfirmDialog
          title="Final confirmation"
          description="This action cannot be undone. All SPS-owned local data will be removed and the app will return to its first-use state."
          confirmLabel="Yes, delete everything"
          cancelLabel="Go back"
          tone="danger"
          onConfirm={handleResetFinalConfirm}
          onCancel={handleResetCancel}
        />
      ) : null}
    </>
  )
}
