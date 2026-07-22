import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useRestTimer } from './useRestTimer'

describe('useRestTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-01T10:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts with the requested duration', () => {
    const { result } = renderHook(() => useRestTimer())

    act(() => {
      result.current.start(45)
    })

    expect(result.current.remainingSeconds).toBe(45)
    expect(result.current.display).toBe('00:45')
    expect(result.current.isRunning).toBe(true)
    expect(result.current.isVisible).toBe(true)
  })

  it('counts down automatically', () => {
    const { result } = renderHook(() => useRestTimer())

    act(() => {
      result.current.start(10)
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.remainingSeconds).toBeLessThanOrEqual(6)
    expect(result.current.remainingSeconds).toBeGreaterThanOrEqual(5)
  })

  it('pauses and resumes', () => {
    const { result } = renderHook(() => useRestTimer())

    act(() => {
      result.current.start(20)
      vi.advanceTimersByTime(5000)
    })

    act(() => {
      result.current.pause()
    })

    const pausedRemaining = result.current.remainingSeconds
    expect(result.current.isPaused).toBe(true)
    expect(result.current.isRunning).toBe(false)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.remainingSeconds).toBe(pausedRemaining)

    act(() => {
      result.current.resume()
    })

    expect(result.current.isRunning).toBe(true)
    expect(result.current.isPaused).toBe(false)
  })

  it('skips the timer', () => {
    const { result } = renderHook(() => useRestTimer())

    act(() => {
      result.current.start(30)
      result.current.skip()
    })

    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.isVisible).toBe(false)
    expect(result.current.isRunning).toBe(false)
  })

  it('restarts from the original duration', () => {
    const { result } = renderHook(() => useRestTimer())

    act(() => {
      result.current.start(15)
      vi.advanceTimersByTime(7000)
      result.current.restart()
    })

    expect(result.current.remainingSeconds).toBe(15)
    expect(result.current.isRunning).toBe(true)
  })

  it('reaches zero without going negative', () => {
    const { result } = renderHook(() => useRestTimer())

    act(() => {
      result.current.start(2)
    })

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.remainingSeconds).toBe(0)
    expect(result.current.display).toBe('00:00')
    expect(result.current.isComplete).toBe(true)
    expect(result.current.isRunning).toBe(false)
  })

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(window, 'clearInterval')
    const { result, unmount } = renderHook(() => useRestTimer())

    act(() => {
      result.current.start(10)
    })

    unmount()

    expect(clearIntervalSpy).toHaveBeenCalled()
    clearIntervalSpy.mockRestore()
  })
})
