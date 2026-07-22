import { describe, expect, it } from 'vitest'
import {
  formatLastUpdatedLabel,
  formatWeightTrendDisplay,
  getWeightTrendArrow,
} from './dashboardDisplay'

describe('dashboardDisplay', () => {
  it('formats last updated labels from day counts', () => {
    expect(formatLastUpdatedLabel(null)).toBe('—')
    expect(formatLastUpdatedLabel(0)).toBe('Today')
    expect(formatLastUpdatedLabel(1)).toBe('Yesterday')
    expect(formatLastUpdatedLabel(2)).toBe('2 days ago')
  })

  it('formats weight trend direction and magnitude', () => {
    expect(formatWeightTrendDisplay(-0.8)).toEqual({
      direction: 'down',
      text: '0.8 kg',
    })
    expect(formatWeightTrendDisplay(1.2)).toEqual({
      direction: 'up',
      text: '1.2 kg',
    })
    expect(getWeightTrendArrow('down')).toBe('▼')
  })
})
