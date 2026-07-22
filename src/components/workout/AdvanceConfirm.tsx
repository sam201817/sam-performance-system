import './AdvanceConfirm.css'

type AdvanceConfirmProps = {
  onConfirm: () => void
  onCancel: () => void
}

export function AdvanceConfirm({ onConfirm, onCancel }: AdvanceConfirmProps) {
  return (
    <div className="advance-confirm" role="status">
      <p className="advance-confirm__message">
        還有未完成的組數，確定要前往下一個動作嗎？
      </p>
      <div className="advance-confirm__actions">
        <button
          type="button"
          className="advance-confirm__button advance-confirm__button--secondary"
          onClick={onCancel}
        >
          取消
        </button>
        <button
          type="button"
          className="advance-confirm__button advance-confirm__button--primary sps-action-primary"
          onClick={onConfirm}
        >
          仍要繼續
        </button>
      </div>
    </div>
  )
}
