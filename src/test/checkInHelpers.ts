import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

export async function completeDailyCheckIn(user: UserEvent): Promise<void> {
  await user.click(screen.getByRole('button', { name: 'Fatigue 3' }))
  await user.click(screen.getByRole('button', { name: 'Sleep quality 4' }))
  await user.click(screen.getByRole('button', { name: 'Motivation 4' }))
  await user.click(screen.getByRole('button', { name: 'Muscle soreness 2' }))

  const saveButton = screen.getByRole('button', { name: /Save & Continue|Update Check-in/ })
  await user.click(saveButton)
}
