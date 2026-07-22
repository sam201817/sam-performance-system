import './SuccessBanner.css'

type SuccessBannerProps = {
  message: string
  onDismiss?: () => void
}

export function SuccessBanner({ message, onDismiss }: SuccessBannerProps) {
  return (
    <div className="sps-success-banner" role="status" aria-live="polite">
      <p className="sps-success-banner__message">{message}</p>
      {onDismiss && (
        <button type="button" className="sps-success-banner__dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  )
}
