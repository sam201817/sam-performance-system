import { DailyCheckInForm } from '../components/checkin/DailyCheckInForm'
import type { DailyCheckInEntry, DailyCheckInProps } from '../types/dailyCheckIn'
import { findCheckInForDate } from '../utils/dailyCheckInStorage'
import './DailyCheckIn.css'

export type { DailyCheckInProps }

export function DailyCheckIn({ history, allowCancel, onSaveEntry, onCancel }: DailyCheckInProps) {
  const todayEntry = findCheckInForDate(history)
  const isEditing = todayEntry !== null

  function handleSubmit(values: Omit<DailyCheckInEntry, 'id' | 'version'>) {
    onSaveEntry(values, todayEntry?.id ?? null)
  }

  return (
    <main className="daily-check-in screen-shell">
      <header className="daily-check-in__header">
        <h1 className="daily-check-in__title">Daily Check-in</h1>
        <p className="daily-check-in__subtitle">
          {isEditing
            ? 'Update how you feel today before continuing.'
            : 'How are you feeling today? Complete your check-in to continue.'}
        </p>
      </header>

      <DailyCheckInForm
        entry={todayEntry}
        submitLabel={isEditing ? 'Update Check-in' : 'Save & Continue'}
        onSubmit={handleSubmit}
      />

      {allowCancel && (
        <button
          type="button"
          className="daily-check-in__cancel"
          onClick={onCancel}
        >
          Cancel
        </button>
      )}
    </main>
  )
}
