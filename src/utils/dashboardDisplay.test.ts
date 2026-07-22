import { describe, expect, it } from 'vitest'
import {
  formatLastUpdatedLabel,
  formatRelativeDate,
} from './dashboardDisplay'

describe('dashboardDisplay', () => {
  it('formats relative dates in English', () => {
    expect(formatRelativeDate(null, 'en')).toBe('—')
    expect(formatRelativeDate(0, 'en')).toBe('Today')
    expect(formatRelativeDate(1, 'en')).toBe('Yesterday')
    expect(formatRelativeDate(2, 'en')).toBe('2 days ago')
  })

  it('formats relative dates in Traditional Chinese', () => {
    expect(formatRelativeDate(0, 'zh-TW')).toBe('今天')
    expect(formatRelativeDate(1, 'zh-TW')).toBe('昨天')
    expect(formatRelativeDate(2, 'zh-TW')).toBe('2 天前')
  })

  it('keeps formatLastUpdatedLabel as an alias', () => {
    expect(formatLastUpdatedLabel(0, 'en')).toBe('Today')
  })
})
