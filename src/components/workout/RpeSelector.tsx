import './RpeSelector.css'

type RpeSelectorProps = {
  id: string
  value: number | null
  onChange: (rpe: number | null) => void
}

const RPE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const

export function RpeSelector({ id, value, onChange }: RpeSelectorProps) {
  return (
    <fieldset className="rpe-selector">
      <legend id={`${id}-legend`} className="rpe-selector__legend">
        RPE
      </legend>
      <div className="rpe-selector__options" role="group" aria-labelledby={`${id}-legend`}>
        {RPE_VALUES.map((rpe) => {
          const selected = value === rpe
          return (
            <button
              key={rpe}
              type="button"
              id={`${id}-rpe-${rpe}`}
              className={`rpe-selector__option${selected ? ' rpe-selector__option--selected' : ''}`}
              aria-pressed={selected}
              aria-label={`RPE ${rpe}`}
              onClick={() => onChange(selected ? null : rpe)}
            >
              {rpe}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
