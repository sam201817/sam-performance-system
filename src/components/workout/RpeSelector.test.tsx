import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { RpeSelector } from './RpeSelector'

describe('RpeSelector', () => {
  it('renders values 1 through 10', () => {
    render(<RpeSelector id="rpe-test" value={null} onChange={() => undefined} />)

    for (let value = 1; value <= 10; value += 1) {
      expect(screen.getByRole('button', { name: `RPE ${value}` })).toBeInTheDocument()
    }
  })

  it('exposes selected value with aria-pressed', () => {
    render(<RpeSelector id="rpe-test" value={7} onChange={() => undefined} />)

    expect(screen.getByRole('button', { name: 'RPE 7' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'RPE 6' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('selects and clears values through the change handler', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    const { rerender } = render(
      <RpeSelector id="rpe-test" value={null} onChange={onChange} />,
    )

    await user.click(screen.getByRole('button', { name: 'RPE 5' }))
    expect(onChange).toHaveBeenCalledWith(5)

    onChange.mockClear()
    rerender(<RpeSelector id="rpe-test" value={5} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'RPE 5' }))
    expect(onChange).toHaveBeenCalledWith(null)
  })
})
