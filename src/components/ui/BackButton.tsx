import './BackButton.css'

type BackButtonProps = {
  onClick: () => void
  label?: string
}

export function BackButton({ onClick, label = '返回' }: BackButtonProps) {
  return (
    <button
      type="button"
      className="back-button"
      onClick={onClick}
      aria-label="返回首頁"
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
      {label}
    </button>
  )
}
