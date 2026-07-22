import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AdvanceConfirm } from './AdvanceConfirm'

describe('AdvanceConfirm', () => {
  it('supports cancel and confirm actions', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(<AdvanceConfirm onCancel={onCancel} onConfirm={onConfirm} />)

    expect(screen.getByRole('status')).toHaveTextContent('還有未完成的組數')

    await user.click(screen.getByRole('button', { name: '取消' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: '仍要繼續' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })
})
