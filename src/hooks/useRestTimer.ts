import { useEffect, useRef, useState } from 'react'
import { formatTimerDisplay } from '../utils/parseRestDuration'

type RestTimerState = {
  remainingSeconds: number
  display: string
  isRunning: boolean
  isPaused: boolean
  isVisible: boolean
  isComplete: boolean
}

type RestTimerControls = {
  start: (seconds: number) => void
  pause: () => void
  resume: () => void
  skip: () => void
  restart: () => void
}

export function useRestTimer(): RestTimerState & RestTimerControls {
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const endTimeRef = useRef<number | null>(null)
  const durationRef = useRef(0)
  const pausedRemainingRef = useRef(0)

  useEffect(() => {
    if (!isRunning) return

    const tick = () => {
      const endTime = endTimeRef.current
      if (endTime === null) return

      const nextRemaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
      setRemainingSeconds(nextRemaining)

      if (nextRemaining <= 0) {
        setIsRunning(false)
        setIsComplete(true)
        endTimeRef.current = null
      }
    }

    tick()
    const intervalId = window.setInterval(tick, 250)
    return () => window.clearInterval(intervalId)
  }, [isRunning])

  function start(seconds: number) {
    const safeSeconds = Math.max(0, Math.round(seconds))
    durationRef.current = safeSeconds
    pausedRemainingRef.current = safeSeconds
    endTimeRef.current = Date.now() + safeSeconds * 1000
    setRemainingSeconds(safeSeconds)
    setIsVisible(true)
    setIsRunning(true)
    setIsPaused(false)
    setIsComplete(false)
  }

  function pause() {
    if (!isRunning) return
    const endTime = endTimeRef.current
    if (endTime === null) return

    pausedRemainingRef.current = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
    setRemainingSeconds(pausedRemainingRef.current)
    endTimeRef.current = null
    setIsRunning(false)
    setIsPaused(true)
  }

  function resume() {
    if (!isPaused || pausedRemainingRef.current <= 0) return
    endTimeRef.current = Date.now() + pausedRemainingRef.current * 1000
    setIsRunning(true)
    setIsPaused(false)
    setIsComplete(false)
  }

  function skip() {
    endTimeRef.current = null
    setRemainingSeconds(0)
    setIsRunning(false)
    setIsPaused(false)
    setIsVisible(false)
    setIsComplete(false)
  }

  function restart() {
    start(durationRef.current)
  }

  return {
    remainingSeconds,
    display: formatTimerDisplay(remainingSeconds),
    isRunning,
    isPaused,
    isVisible,
    isComplete,
    start,
    pause,
    resume,
    skip,
    restart,
  }
}
