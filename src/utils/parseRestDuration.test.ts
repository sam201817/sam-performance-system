import { describe, expect, it } from 'vitest'
import { formatTimerDisplay, parseRestDuration } from './parseRestDuration'

describe('parseRestDuration', () => {
  it('parses seconds in English', () => {
    expect(parseRestDuration('45 sec')).toBe(45)
  })

  it('parses seconds in Chinese', () => {
    expect(parseRestDuration('60 秒')).toBe(60)
    expect(parseRestDuration('90 秒')).toBe(90)
  })

  it('parses minutes', () => {
    expect(parseRestDuration('1 min')).toBe(60)
  })

  it('parses combined minute and second strings using the seconds segment', () => {
    expect(parseRestDuration('1 min 30 sec')).toBe(30)
  })

  it('falls back for invalid strings', () => {
    expect(parseRestDuration('rest a bit')).toBe(60)
  })

  it('falls back for undefined rest', () => {
    expect(parseRestDuration(undefined)).toBe(60)
  })

  it('handles zero values', () => {
    expect(parseRestDuration('0 sec')).toBe(0)
  })

  it('handles plain digits as seconds', () => {
    expect(parseRestDuration('75')).toBe(75)
  })
})

describe('formatTimerDisplay', () => {
  it('formats seconds as MM:SS', () => {
    expect(formatTimerDisplay(45)).toBe('00:45')
    expect(formatTimerDisplay(90)).toBe('01:30')
  })

  it('never formats negative values', () => {
    expect(formatTimerDisplay(-5)).toBe('00:00')
  })
})
