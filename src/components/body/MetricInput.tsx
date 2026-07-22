import { useId } from 'react'
import './MetricInput.css'

type MetricInputProps = {
  id?: string
  label: string
  unit: string
  value: string
  error?: string
  onChange: (value: string) => void
}

export function MetricInput({
  id,
  label,
  unit,
  value,
  error,
  onChange,
}: MetricInputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`

  return (
    <div className="metric-input">
      <label className="metric-input__label" htmlFor={inputId}>
        {label}
        <span className="metric-input__unit"> ({unit})</span>
      </label>
      <input
        id={inputId}
        className="metric-input__field"
        type="text"
        inputMode="decimal"
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && (
        <p className="metric-input__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
