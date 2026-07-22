import { useCallback, useMemo, useState } from 'react'
import { Dashboard } from './screens/Dashboard'
import { History } from './screens/History'
import { Workout } from './screens/Workout'
import { WorkoutComplete } from './screens/WorkoutComplete'
import { WorkoutHistoryDetail } from './screens/WorkoutHistoryDetail'
import { TODAY_WORKOUT } from './data/todayWorkout'
import {
  buildWorkoutSummary,
  createWorkoutProgress,
} from './utils/workoutProgressFactory'
import {
  buildHistoryStatistics,
  ensureHistorySessionSaved,
} from './utils/workoutHistoryFactory'
import { loadHistory } from './utils/workoutHistoryStorage'
import {
  clearWorkoutProgress,
  clearWorkoutSummary,
  deriveWorkoutStatus,
  loadWorkoutProgress,
  loadWorkoutSummary,
  saveWorkoutProgress,
  saveWorkoutSummary,
} from './utils/workoutProgressStorage'
import {
  getActiveNavTab,
  type AppScreen,
  type NavTabHandler,
  type NavTabId,
} from './types/app'
import type { WorkoutProgress, WorkoutSummary } from './types/workoutProgress'
import './App.css'

function App() {
  const [screen, setScreen] = useState<AppScreen>('dashboard')
  const [progress, setProgress] = useState<WorkoutProgress | null>(() =>
    loadWorkoutProgress(TODAY_WORKOUT),
  )
  const [summary, setSummary] = useState<WorkoutSummary | null>(() =>
    loadWorkoutSummary(),
  )
  const [history, setHistory] = useState(() => loadHistory())
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null)

  const workoutStatus = deriveWorkoutStatus(progress)
  const historyStatistics = useMemo(
    () => buildHistoryStatistics(history.sessions),
    [history.sessions],
  )
  const selectedHistorySession = selectedHistorySessionId
    ? history.sessions.find((session) => session.id === selectedHistorySessionId) ?? null
    : null

  const refreshHistory = useCallback(() => {
    setHistory(loadHistory())
  }, [])

  const handleProgressChange = useCallback((next: WorkoutProgress) => {
    setProgress(next)
    saveWorkoutProgress(next)
  }, [])

  const openWorkoutScreen = useCallback(() => {
    setScreen('workout')
  }, [])

  const handleStartWorkout = useCallback(() => {
    if (progress && progress.completedAt === null) {
      openWorkoutScreen()
      return
    }

    clearWorkoutSummary()
    setSummary(null)

    const freshProgress = createWorkoutProgress(TODAY_WORKOUT)
    setProgress(freshProgress)
    saveWorkoutProgress(freshProgress)
    openWorkoutScreen()
  }, [openWorkoutScreen, progress])

  const returnHome = useCallback(() => {
    clearWorkoutSummary()
    setSummary(null)
    setScreen('dashboard')
  }, [])

  const handleFinishWorkout = useCallback((finalProgress: WorkoutProgress) => {
    const completedProgress: WorkoutProgress = {
      ...finalProgress,
      completedAt: new Date().toISOString(),
    }
    const historySessionId = ensureHistorySessionSaved(
      completedProgress,
      TODAY_WORKOUT,
      summary?.historySessionId,
    )
    const nextSummary: WorkoutSummary = {
      ...buildWorkoutSummary(completedProgress, TODAY_WORKOUT),
      historySessionId,
    }

    saveWorkoutSummary(nextSummary)
    clearWorkoutProgress()
    setProgress(null)
    setSummary(nextSummary)
    refreshHistory()
    setScreen('complete')
  }, [refreshHistory, summary?.historySessionId])

  const handleOpenHistorySession = useCallback((sessionId: string) => {
    setSelectedHistorySessionId(sessionId)
    setScreen('history-detail')
  }, [])

  const handleNavigate = useCallback<NavTabHandler>((tab: NavTabId) => {
    if (tab === 'home') {
      setSelectedHistorySessionId(null)
      setScreen('dashboard')
      return
    }

    if (tab === 'workout') {
      handleStartWorkout()
      return
    }

    if (tab === 'progress') {
      refreshHistory()
      setSelectedHistorySessionId(null)
      setScreen('history')
    }
  }, [handleStartWorkout, refreshHistory])

  const activeTab = getActiveNavTab(screen)

  return (
    <div className="app-shell">
      <div className="app-shell__glow" aria-hidden="true" />
      <div className="app">
        {screen === 'dashboard' && (
          <Dashboard
            session={TODAY_WORKOUT}
            workoutStatus={workoutStatus}
            onStartWorkout={handleStartWorkout}
            activeTab={activeTab}
            onNavigate={handleNavigate}
          />
        )}
        {screen === 'workout' && progress && (
          <Workout
            session={TODAY_WORKOUT}
            progress={progress}
            onProgressChange={handleProgressChange}
            onBack={() => setScreen('dashboard')}
            onFinish={handleFinishWorkout}
          />
        )}
        {screen === 'complete' && summary && (
          <WorkoutComplete summary={summary} onReturnHome={returnHome} />
        )}
        {screen === 'history' && (
          <History
            sessions={history.sessions}
            statistics={historyStatistics}
            activeTab={activeTab}
            onNavigate={handleNavigate}
            onOpenSession={handleOpenHistorySession}
          />
        )}
        {screen === 'history-detail' && selectedHistorySession && (
          <WorkoutHistoryDetail
            session={selectedHistorySession}
            onBack={() => setScreen('history')}
          />
        )}
      </div>
    </div>
  )
}

export default App
