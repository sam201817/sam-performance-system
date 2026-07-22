import { DailyCheckInForm } from '../components/checkin/DailyCheckInForm'
import { useTranslation } from '../hooks/useTranslation'
import type { DailyCheckInEntry, DailyCheckInProps } from '../types/dailyCheckIn'
import { findCheckInForDate } from '../utils/dailyCheckInStorage'
import './DailyCheckIn.css'

export type { DailyCheckInProps }

export function DailyCheckIn({ history, allowCancel, onSaveEntry, onCancel }: DailyCheckInProps) {
  const { t } = useTranslation()
  const todayEntry = findCheckInForDate(history)
  const isEditing = todayEntry !== null

  function handleSubmit(values: Omit<DailyCheckInEntry, 'id' | 'version'>) {
    onSaveEntry(values, todayEntry?.id ?? null)
  }

  return (
    <main className="daily-check-in screen-shell">
      <header className="daily-check-in__header">
        <h1 className="daily-check-in__title">{t('dailyCheckIn.title')}</h1>
        <p className="daily-check-in__subtitle">
          {isEditing ? t('dailyCheckIn.editSubtitle') : t('dailyCheckIn.subtitle')}
        </p>
      </header>

      <DailyCheckInForm
        entry={todayEntry}
        submitLabel={isEditing ? t('dailyCheckIn.updateCheckIn') : t('dailyCheckIn.saveContinue')}
        onSubmit={handleSubmit}
      />

      {allowCancel && (
        <button
          type="button"
          className="daily-check-in__cancel"
          onClick={onCancel}
        >
          {t('buttons.cancel')}
        </button>
      )}
    </main>
  )
}
