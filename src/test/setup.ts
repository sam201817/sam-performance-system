import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

const PROGRESS_KEY = 'sps.workout-progress.v1'
const SUMMARY_KEY = 'sps.workout-summary.v1'
const HISTORY_KEY = 'sps.workout-history.v1'
const BODY_METRICS_KEY = 'sps.body-metrics.v1'
const DAILY_CHECK_IN_KEY = 'sps.daily-check-in.v1'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  cleanup()
  vi.clearAllTimers()
  vi.useRealTimers()
  localStorage.removeItem(PROGRESS_KEY)
  localStorage.removeItem(SUMMARY_KEY)
  localStorage.removeItem(HISTORY_KEY)
  localStorage.removeItem(BODY_METRICS_KEY)
  localStorage.removeItem(DAILY_CHECK_IN_KEY)
})
