import './CheckInScaleSelector.css'

type CheckInScaleSelectorProps = {
  id: string
  label: string
  lowLabel: string
  highLabel: string
  value: number | null
  error?: string
  onChange: (value: number) => void
}

const SCALE_VALUES = [1, 2, 3, 4, 5] as const

export function CheckInScaleSelector({
  id,
  label,
  lowLabel,
  highLabel,
  value,
  error,
  onChange,
}: CheckInScaleSelectorProps) {
  return (
    <fieldset className="check-in-scale" aria-describedby={error ? `${id}-error` : undefined}>
      <legend className="check-in-scale__legend">{label}</legend>
      <div className="check-in-scale__labels" aria-hidden="true">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
      <div className="check-in-scale__options" role="group" aria-label={label}>
        {SCALE_VALUES.map((rating) => {
          const selected = value === rating
          return (
            <button
              key={rating}
              type="button"
              id={`${id}-${rating}`}
              className={`check-in-scale__option${selected ? ' check-in-scale__option--selected' : ''}`}
              aria-pressed={selected}
              aria-label={`${label} ${rating}`}
              onClick={() => onChange(rating)}
            >
              {rating}
            </button>
          )
        })}
      </div>
      {error && (
        <p className="check-in-scale__error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
