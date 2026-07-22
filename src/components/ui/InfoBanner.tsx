import { useTranslation } from '../../hooks/useTranslation'
import './InfoBanner.css'

export type InfoBannerTone = 'success' | 'error'

type InfoBannerProps = {
  message: string
  tone?: InfoBannerTone
  onDismiss?: () => void
}

export function InfoBanner({ message, tone = 'success', onDismiss }: InfoBannerProps) {
  const { t } = useTranslation()
  const isError = tone === 'error'

  return (
    <div
      className={`sps-info-banner sps-info-banner--${tone}`}
      role={isError ? 'alert' : 'status'}
      aria-live="polite"
    >
      <p className="sps-info-banner__message">{message}</p>
      {onDismiss ? (
        <button
          type="button"
          className="sps-info-banner__dismiss"
          aria-label={t('common.dismissMessage')}
          onClick={onDismiss}
        >
          {t('common.dismiss')}
        </button>
      ) : null}
    </div>
  )
}
