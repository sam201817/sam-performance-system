import type { SettingsFeedback } from '../../types/settings'
import './SettingsFeedbackBanner.css'

type SettingsFeedbackBannerProps = {
  feedback: SettingsFeedback
  onDismiss: () => void
}

export function SettingsFeedbackBanner({ feedback, onDismiss }: SettingsFeedbackBannerProps) {
  const isError =
    feedback.type === 'restore-invalid' ||
    feedback.type === 'restore-unsupported' ||
    feedback.type === 'error'

  return (
    <div
      className={`settings-feedback${isError ? ' settings-feedback--error' : ' settings-feedback--success'}`}
      role={isError ? 'alert' : 'status'}
      aria-live="polite"
    >
      <p className="settings-feedback__message">{feedback.message}</p>
      <button
        type="button"
        className="settings-feedback__dismiss"
        aria-label="Dismiss message"
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  )
}
