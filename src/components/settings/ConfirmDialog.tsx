import { useEffect, useRef } from 'react'
import { useTranslation } from '../../hooks/useTranslation'
import './ConfirmDialog.css'

type ConfirmDialogProps = {
  title: string
  description: string
  confirmLabel: string
  cancelLabel?: string
  tone?: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dialogRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCancel()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  return (
    <div className="confirm-dialog-overlay">
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        tabIndex={-1}
      >
        <h2 id="confirm-dialog-title" className="confirm-dialog__title">
          {title}
        </h2>
        <p id="confirm-dialog-description" className="confirm-dialog__description">
          {description}
        </p>
        <div className="confirm-dialog__actions">
          <button
            type="button"
            className="confirm-dialog__button confirm-dialog__button--secondary"
            onClick={onCancel}
          >
            {cancelLabel ?? t('buttons.cancel')}
          </button>
          <button
            type="button"
            className={`confirm-dialog__button confirm-dialog__button--primary${
              tone === 'danger' ? ' confirm-dialog__button--danger' : ' sps-action-primary'
            }`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
