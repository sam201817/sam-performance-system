import { screen } from '@testing-library/react'
import type { UserEvent } from '@testing-library/user-event'

export async function completeDailyCheckIn(user: UserEvent): Promise<void> {
  await user.click(screen.getByRole('button', { name: '疲勞 3' }))
  await user.click(screen.getByRole('button', { name: '睡眠品質 4' }))
  await user.click(screen.getByRole('button', { name: '動機 4' }))
  await user.click(screen.getByRole('button', { name: '肌肉酸痛 2' }))

  const saveButton = screen.getByRole('button', { name: /儲存並繼續|更新狀態/ })
  await user.click(saveButton)
}
