import { useTranslation } from '../../hooks/useTranslation'
import './BackButton.css'

type BackButtonProps = {
  onClick: () => void
  label?: string
  ariaLabel?: string
}

export function BackButton({ onClick, label, ariaLabel }: BackButtonProps) {
  const { t } = useTranslation()

  return (
    <button
      type="button"
      className="back-button"
      onClick={onClick}
      aria-label={ariaLabel ?? t('workout.backHome')}
    >
      <svg className="back-button__icon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M15 6l-6 6 6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label ?? t('buttons.back')}
    </button>
  )
}
