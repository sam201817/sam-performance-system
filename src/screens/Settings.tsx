import { useRef, useState } from 'react'
import { BottomNav } from '../components/BottomNav'
import { ConfirmDialog } from '../components/settings/ConfirmDialog'
import { SettingsSection } from '../components/settings/SettingsSection'
import { InfoBanner, type InfoBannerTone } from '../components/ui/InfoBanner'
import { APP_METADATA } from '../data/appMetadata'
import { useTranslation } from '../hooks/useTranslation'
import { getLocaleArray } from '../i18n'
import type { SpsBackupPayload } from '../types/backup'
import type {
  AppLanguage,
  SettingsFeedback,
  UserPreferences,
  WeightUnit,
} from '../types/settings'
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

function getFeedbackTone(feedback: SettingsFeedback): InfoBannerTone {
  if (
    feedback.type === 'restore-invalid' ||
    feedback.type === 'restore-unsupported' ||
    feedback.type === 'error'
  ) {
    return 'error'
  }

  return 'success'
}

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
  const { t, language } = useTranslation()
  const privacyItems = getLocaleArray(language, 'settings.privacyItems')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [resetStep, setResetStep] = useState<ResetStep>('none')
  const [restoreStep, setRestoreStep] = useState<RestoreStep>('none')
  const [pendingBackup, setPendingBackup] = useState<SpsBackupPayload | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)

  function handleLanguageChange(language: AppLanguage) {
    onPreferencesChange({ ...preferences, language })
  }

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
            {t('buttons.back')}
          </button>
          <h1 className="settings__title sps-h1">{t('settings.title')}</h1>
          <p className="settings__subtitle sps-body-small sps-text-secondary">{t('settings.subtitle')}</p>
        </header>

        {feedback ? (
          <InfoBanner
            message={feedback.message}
            tone={getFeedbackTone(feedback)}
            onDismiss={onDismissFeedback}
          />
        ) : null}

        <SettingsSection
          title={t('settings.preferences')}
          description={t('settings.preferencesHint')}
        >
          <div className="settings-row">
            <div className="settings-row__content">
              <span className="settings-row__label">{t('settings.language')}</span>
              <span className="settings-row__hint">{t('settings.languageHint')}</span>
            </div>
            <div className="settings-row__control settings-row__control--segmented sps-segment-group">
              <button
                type="button"
                className={`sps-segment${preferences.language === 'zh-TW' ? ' sps-segment--active' : ''}`}
                aria-pressed={preferences.language === 'zh-TW'}
                onClick={() => handleLanguageChange('zh-TW')}
              >
                {t('settings.languageZhTW')}
              </button>
              <button
                type="button"
                className={`sps-segment${preferences.language === 'en' ? ' sps-segment--active' : ''}`}
                aria-pressed={preferences.language === 'en'}
                onClick={() => handleLanguageChange('en')}
              >
                {t('settings.languageEn')}
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row__content">
              <span className="settings-row__label">{t('settings.units')}</span>
              <span className="settings-row__hint">{t('settings.unitsHint')}</span>
            </div>
            <div className="settings-row__control settings-row__control--segmented sps-segment-group">
              <button
                type="button"
                className={`sps-segment${preferences.weightUnit === 'metric' ? ' sps-segment--active' : ''}`}
                aria-pressed={preferences.weightUnit === 'metric'}
                onClick={() => handleWeightUnitChange('metric')}
              >
                {t('settings.unitsMetric')}
              </button>
              <button
                type="button"
                className={`sps-segment${preferences.weightUnit === 'imperial' ? ' sps-segment--active' : ''}`}
                aria-pressed={preferences.weightUnit === 'imperial'}
                onClick={() => handleWeightUnitChange('imperial')}
              >
                {t('settings.unitsImperial')}
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-row__content">
              <span className="settings-row__label">{t('settings.theme')}</span>
              <span className="settings-row__hint">{t('settings.themeHint')}</span>
            </div>
            <span className="settings-row__value">{t('settings.themeSystem')}</span>
          </div>

          <p className="settings__footnote">
            {t('settings.unitsFootnote', {
              label: formatWeightUnitLabel(preferences.weightUnit, language),
            })}
          </p>
        </SettingsSection>

        <SettingsSection
          title={t('settings.dataManagement')}
          description={t('settings.dataManagementHint')}
        >
          <p className="settings__info">{t('settings.storageInfo')}</p>

          <button
            type="button"
            className="settings-action settings-action--primary sps-action-primary"
            onClick={handleExportClick}
          >
            {t('settings.exportBackup')}
          </button>

          <button
            type="button"
            className="settings-action"
            onClick={handleRestoreClick}
          >
            {t('settings.restoreBackup')}
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
            {t('settings.resetAllData')}
          </button>
        </SettingsSection>

        <SettingsSection title={t('settings.privacy')}>
          <ul className="settings-list">
            {privacyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </SettingsSection>

        <SettingsSection title={t('settings.about')}>
          <div className="settings-about">
            <p className="settings-about__name">{APP_METADATA.name}</p>
            <p className="settings-about__short">{APP_METADATA.shortName}</p>
            <p className="settings-about__version">Version {APP_METADATA.version}</p>
            <p className="settings-about__description">{APP_METADATA.description}</p>
            <p className="settings-about__badge">{t('settings.localFirstBadge')}</p>
          </div>
        </SettingsSection>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />

      {restoreStep === 'confirm' && pendingBackup ? (
        <ConfirmDialog
          title={t('settings.restoreTitle')}
          description={t('settings.restoreDescription', {
            date: new Date(pendingBackup.exportedAt).toLocaleString(),
            version: pendingBackup.appVersion,
          })}
          confirmLabel={isRestoring ? t('settings.restoring') : t('settings.restoreConfirm')}
          cancelLabel={t('buttons.cancel')}
          tone="danger"
          onConfirm={() => {
            if (!isRestoring) void handleConfirmRestore()
          }}
          onCancel={handleCancelRestore}
        />
      ) : null}

      {resetStep === 'first' ? (
        <ConfirmDialog
          title={t('settings.resetFirstTitle')}
          description={t('settings.resetFirstDescription')}
          confirmLabel={t('settings.resetContinue')}
          cancelLabel={t('buttons.cancel')}
          tone="danger"
          onConfirm={handleResetFirstConfirm}
          onCancel={handleResetCancel}
        />
      ) : null}

      {resetStep === 'final' ? (
        <ConfirmDialog
          title={t('settings.resetFinalTitle')}
          description={t('settings.resetFinalDescription')}
          confirmLabel={t('settings.resetFinalConfirm')}
          cancelLabel={t('settings.goBack')}
          tone="danger"
          onConfirm={handleResetFinalConfirm}
          onCancel={handleResetCancel}
        />
      ) : null}
    </>
  )
}
