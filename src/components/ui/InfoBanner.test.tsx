import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InfoBanner } from './InfoBanner'
import { renderWithI18n } from '../../test/renderWithI18n'

describe('InfoBanner', () => {
  it('renders success message with dismiss control', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()

    renderWithI18n(
      <InfoBanner message="Saved successfully." onDismiss={onDismiss} />,
    )

    expect(screen.getByRole('status')).toHaveTextContent('Saved successfully.')
    await user.click(screen.getByRole('button', { name: '關閉訊息' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('renders error tone as alert', () => {
    render(<InfoBanner message="Something failed." tone="error" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Something failed.')
  })
})
