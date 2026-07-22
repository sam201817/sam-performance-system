import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  readJsonStorage,
  removeJsonStorage,
  writeJsonStorage,
} from './jsonStorage'

const TEST_KEY = 'sps.test-json'

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

describe('jsonStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns fallback when key is missing', () => {
    expect(readJsonStorage(TEST_KEY, isStringArray, [])).toEqual([])
  })

  it('returns parsed value when guard passes', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify(['a', 'b']))
    expect(readJsonStorage(TEST_KEY, isStringArray, [])).toEqual(['a', 'b'])
  })

  it('returns fallback when JSON is invalid', () => {
    localStorage.setItem(TEST_KEY, '{not-json')
    expect(readJsonStorage(TEST_KEY, isStringArray, ['fallback'])).toEqual(['fallback'])
  })

  it('returns fallback when guard fails', () => {
    localStorage.setItem(TEST_KEY, JSON.stringify({ invalid: true }))
    expect(readJsonStorage(TEST_KEY, isStringArray, [])).toEqual([])
  })

  it('writes JSON and reports success', () => {
    expect(writeJsonStorage(TEST_KEY, ['saved'])).toBe(true)
    expect(JSON.parse(localStorage.getItem(TEST_KEY) ?? '[]')).toEqual(['saved'])
  })

  it('returns false when write fails', () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota exceeded')
    })

    expect(writeJsonStorage(TEST_KEY, ['saved'])).toBe(false)
    setItem.mockRestore()
  })

  it('removes keys and reports success', () => {
    localStorage.setItem(TEST_KEY, 'value')
    expect(removeJsonStorage(TEST_KEY)).toBe(true)
    expect(localStorage.getItem(TEST_KEY)).toBeNull()
  })
})
