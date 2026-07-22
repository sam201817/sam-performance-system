import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { SetLog } from '../../types/workoutProgress'
import { SetRow } from './SetRow'

const baseSet: SetLog = {
  setNumber: 1,
  targetReps: '10',
  actualReps: '10',
  weight: '24 kg',
  rpe: null,
  completed: false,
}

describe('SetRow', () => {
  it('renders initial reps and weight with labels', () => {
    render(
      <SetRow
        set={baseSet}
        inputIdPrefix="set-1"
        onChange={() => undefined}
        onComplete={() => undefined}
      />,
    )

    expect(screen.getByLabelText('實際次數')).toHaveValue('10')
    expect(screen.getByLabelText('重量')).toHaveValue('24 kg')
  })

  it('updates reps and weight through onChange', () => {
    const onChange = vi.fn()

    render(
      <SetRow
        set={baseSet}
        inputIdPrefix="set-1"
        onChange={onChange}
        onComplete={() => undefined}
      />,
    )

    fireEvent.change(screen.getByLabelText('實際次數'), { target: { value: '12' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ actualReps: '12' }))

    fireEvent.change(screen.getByLabelText('重量'), { target: { value: '26 kg' } })
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ weight: '26 kg' }))
  })

  it('shows accessible completed state and triggers onComplete', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onComplete = vi.fn()

    const { rerender } = render(
      <SetRow
        set={baseSet}
        inputIdPrefix="set-1"
        onChange={onChange}
        onComplete={onComplete}
      />,
    )

    await user.click(screen.getByRole('button', { name: '完成組數' }))
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ completed: true }))
    expect(onComplete).toHaveBeenCalledTimes(1)

    rerender(
      <SetRow
        set={{ ...baseSet, completed: true }}
        inputIdPrefix="set-1"
        onChange={onChange}
        onComplete={onComplete}
      />,
    )

    expect(screen.getByLabelText('已完成')).toHaveTextContent('已完成')
    expect(screen.getByRole('button', { name: '取消完成' })).toHaveAttribute('aria-pressed', 'true')
  })
})
