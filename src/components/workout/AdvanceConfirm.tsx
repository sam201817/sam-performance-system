import { useTranslation } from '../../hooks/useTranslation'
import './AdvanceConfirm.css'

type AdvanceConfirmProps = {
  onConfirm: () => void
  onCancel: () => void
}

export function AdvanceConfirm({ onConfirm, onCancel }: AdvanceConfirmProps) {
  const { t } = useTranslation()

  return (
    <div className="advance-confirm" role="status">
      <p className="advance-confirm__message">
        {t('workout.advanceConfirm')}
      </p>
      <div className="advance-confirm__actions">
        <button
          type="button"
          className="advance-confirm__button sps-action-secondary"
          onClick={onCancel}
        >
          {t('workout.advanceCancel')}
        </button>
        <button
          type="button"
          className="advance-confirm__button advance-confirm__button--primary sps-action-primary"
          onClick={onConfirm}
        >
          {t('workout.advanceConfirmAction')}
        </button>
      </div>
    </div>
  )
}
