import { useCallback, useState } from 'react'
import { Dashboard } from './screens/Dashboard'
import { Workout } from './screens/Workout'
import { WorkoutComplete } from './screens/WorkoutComplete'
import { TODAY_WORKOUT } from './data/todayWorkout'
import {
  buildWorkoutSummary,
  createWorkoutProgress,
} from './utils/workoutProgressFactory'
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

  const workoutStatus = deriveWorkoutStatus(progress)

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
    const nextSummary = buildWorkoutSummary(completedProgress, TODAY_WORKOUT)

    saveWorkoutSummary(nextSummary)
    clearWorkoutProgress()
    setProgress(null)
    setSummary(nextSummary)
    setScreen('complete')
  }, [])

  const handleNavigate = useCallback<NavTabHandler>((tab: NavTabId) => {
    if (tab === 'home') {
      setScreen('dashboard')
      return
    }

    if (tab === 'workout') {
      handleStartWorkout()
    }
  }, [handleStartWorkout])

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
      </div>
    </div>
  )
}

export default App
