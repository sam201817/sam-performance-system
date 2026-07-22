import { useCallback, useMemo, useState } from 'react'
import { TODAY_WORKOUT } from '../data/todayWorkout'
import { translate } from '../i18n'
import { persistLanguage } from '../i18n/languageStorage'
import type { SpsBackupPayload } from '../types/backup'
import type { BodyMetricEntry, BodyMetricHistory } from '../types/bodyMetrics'
import type { DailyCheckInEntry, DailyCheckInHistory } from '../types/dailyCheckIn'
import type { SettingsFeedback, UserPreferences } from '../types/settings'
import {
  getActiveNavTab,
  type AppScreen,
  type NavTabHandler,
  type NavTabId,
} from '../types/app'
import type { WorkoutProgress, WorkoutSummary } from '../types/workoutProgress'
import { downloadBackup } from '../utils/backupData'
import { ERROR_MESSAGE_KEYS, parseBackupJson } from '../utils/backupValidation'
import { restoreSpsBackup } from '../utils/backupRestore'
import { buildBodyMetricSummary } from '../utils/bodyMetricCalculations'
import { buildDailyCheckInSummary } from '../utils/dailyCheckInCalculations'
import { buildDashboardOverview } from '../utils/dashboardCalculations'
import { buildPerformanceInsights } from '../utils/performanceInsightsEngine'
import {
  addDailyCheckInEntry,
  findCheckInForDate,
  hasTodayCheckIn,
  loadDailyCheckInHistory,
  saveDailyCheckInHistory,
  updateDailyCheckInEntry,
} from '../utils/dailyCheckInStorage'
import {
  addBodyMetricEntry,
  deleteBodyMetricEntry,
  loadBodyMetricHistory,
  saveBodyMetricHistory,
  updateBodyMetricEntry,
} from '../utils/bodyMetricStorage'
import { loadPreferences, savePreferences } from '../utils/preferencesStorage'
import { resetAllSpsData } from '../utils/resetSpsData'
import { buildWorkoutSummary, createWorkoutProgress } from '../utils/workoutProgressFactory'
import { buildHistoryStatistics, ensureHistorySessionSaved } from '../utils/workoutHistoryFactory'
import { loadHistory } from '../utils/workoutHistoryStorage'
import {
  clearWorkoutProgress,
  clearWorkoutSummary,
  deriveWorkoutStatus,
  loadWorkoutProgress,
  loadWorkoutSummary,
  saveWorkoutProgress,
  saveWorkoutSummary,
} from '../utils/workoutProgressStorage'

function resolveHomeScreen(): AppScreen {
  return hasTodayCheckIn(loadDailyCheckInHistory()) ? 'dashboard' : 'daily-check-in'
}

export function useAppState() {
  const [screen, setScreen] = useState<AppScreen>(() => resolveHomeScreen())
  const [progress, setProgress] = useState<WorkoutProgress | null>(() =>
    loadWorkoutProgress(TODAY_WORKOUT),
  )
  const [summary, setSummary] = useState<WorkoutSummary | null>(() => loadWorkoutSummary())
  const [history, setHistory] = useState(() => loadHistory())
  const [bodyHistory, setBodyHistory] = useState<BodyMetricHistory>(() =>
    loadBodyMetricHistory(),
  )
  const [checkInHistory, setCheckInHistory] = useState<DailyCheckInHistory>(() =>
    loadDailyCheckInHistory(),
  )
  const [selectedHistorySessionId, setSelectedHistorySessionId] = useState<string | null>(null)
  const [historyDetailSource, setHistoryDetailSource] = useState<'history' | 'dashboard'>(
    'history',
  )
  const [checkInAllowCancel, setCheckInAllowCancel] = useState(false)
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences())
  const [settingsFeedback, setSettingsFeedback] = useState<SettingsFeedback | null>(null)

  const workoutStatus = deriveWorkoutStatus(progress)
  const historyStatistics = useMemo(
    () => buildHistoryStatistics(history.sessions),
    [history.sessions],
  )
  const bodySummary = useMemo(
    () => buildBodyMetricSummary(bodyHistory.entries),
    [bodyHistory.entries],
  )
  const dashboardOverview = useMemo(
    () => buildDashboardOverview(history.sessions, bodySummary),
    [history.sessions, bodySummary],
  )
  const todayCheckIn = useMemo(
    () => findCheckInForDate(checkInHistory),
    [checkInHistory],
  )
  const checkInSummary = useMemo(
    () => (todayCheckIn ? buildDailyCheckInSummary(todayCheckIn, preferences.language) : null),
    [todayCheckIn, preferences.language],
  )
  const performanceInsights = useMemo(
    () =>
      buildPerformanceInsights({
        sessions: history.sessions,
        bodySummary,
        checkInEntries: checkInHistory.entries,
        todayCheckIn: checkInSummary,
        language: preferences.language,
      }),
    [history.sessions, bodySummary, checkInHistory.entries, checkInSummary, preferences.language],
  )
  const selectedHistorySession = selectedHistorySessionId
    ? history.sessions.find((session) => session.id === selectedHistorySessionId) ?? null
    : null

  const refreshHistory = useCallback(() => {
    setHistory(loadHistory())
  }, [])

  const refreshBodyHistory = useCallback(() => {
    setBodyHistory(loadBodyMetricHistory())
  }, [])

  const refreshCheckInHistory = useCallback(() => {
    setCheckInHistory(loadDailyCheckInHistory())
  }, [])

  const persistBodyHistory = useCallback((nextHistory: BodyMetricHistory) => {
    saveBodyMetricHistory(nextHistory)
    setBodyHistory(nextHistory)
  }, [])

  const persistCheckInHistory = useCallback((nextHistory: DailyCheckInHistory) => {
    saveDailyCheckInHistory(nextHistory)
    setCheckInHistory(nextHistory)
  }, [])

  const refreshAllAppState = useCallback(() => {
    setHistory(loadHistory())
    setBodyHistory(loadBodyMetricHistory())
    setCheckInHistory(loadDailyCheckInHistory())
    setPreferences(loadPreferences())
    setProgress(loadWorkoutProgress(TODAY_WORKOUT))
    setSummary(loadWorkoutSummary())
    setSelectedHistorySessionId(null)
  }, [])

  const goToHome = useCallback(() => {
    const nextCheckInHistory = loadDailyCheckInHistory()
    setCheckInHistory(nextCheckInHistory)
    setSelectedHistorySessionId(null)
    refreshHistory()
    refreshBodyHistory()
    setCheckInAllowCancel(false)
    setScreen(hasTodayCheckIn(nextCheckInHistory) ? 'dashboard' : 'daily-check-in')
  }, [refreshBodyHistory, refreshHistory])

  const openDailyCheckInForEdit = useCallback(() => {
    refreshCheckInHistory()
    setCheckInAllowCancel(true)
    setScreen('daily-check-in')
  }, [refreshCheckInHistory])

  const handleProgressChange = useCallback((next: WorkoutProgress) => {
    setProgress(next)
    saveWorkoutProgress(next)
  }, [])

  const openWorkoutScreen = useCallback(() => {
    setScreen('workout')
  }, [])

  const openProfile = useCallback(() => {
    setSettingsFeedback(null)
    setScreen('profile')
  }, [])

  const openSettings = useCallback(() => {
    setSettingsFeedback(null)
    setScreen('settings')
  }, [])

  const openBodyComposition = useCallback(() => {
    refreshBodyHistory()
    setScreen('body-composition')
  }, [refreshBodyHistory])

  const handleStartWorkout = useCallback(() => {
    const latestCheckInHistory = loadDailyCheckInHistory()
    if (!hasTodayCheckIn(latestCheckInHistory)) {
      setCheckInHistory(latestCheckInHistory)
      setCheckInAllowCancel(false)
      setScreen('daily-check-in')
      return
    }

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
    goToHome()
  }, [goToHome])

  const handleFinishWorkout = useCallback(
    (finalProgress: WorkoutProgress) => {
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
    },
    [refreshHistory, summary?.historySessionId],
  )

  const handleOpenHistorySession = useCallback((sessionId: string) => {
    setHistoryDetailSource('history')
    setSelectedHistorySessionId(sessionId)
    setScreen('history-detail')
  }, [])

  const handleOpenHistorySessionFromDashboard = useCallback((sessionId: string) => {
    setHistoryDetailSource('dashboard')
    setSelectedHistorySessionId(sessionId)
    setScreen('history-detail')
  }, [])

  const handleSaveBodyEntry = useCallback(
    (values: Omit<BodyMetricEntry, 'id' | 'version'>, entryId: string | null) => {
      const nextHistory = entryId
        ? updateBodyMetricEntry(bodyHistory, entryId, values)
        : addBodyMetricEntry(bodyHistory, values)
      persistBodyHistory(nextHistory)
    },
    [bodyHistory, persistBodyHistory],
  )

  const handleDeleteBodyEntry = useCallback(
    (entryId: string) => {
      persistBodyHistory(deleteBodyMetricEntry(bodyHistory, entryId))
    },
    [bodyHistory, persistBodyHistory],
  )

  const handleSaveCheckInEntry = useCallback(
    (values: Omit<DailyCheckInEntry, 'id' | 'version'>, entryId: string | null) => {
      const nextHistory = entryId
        ? updateDailyCheckInEntry(checkInHistory, entryId, values)
        : addDailyCheckInEntry(checkInHistory, values)
      persistCheckInHistory(nextHistory)
      setCheckInAllowCancel(false)
      setScreen('dashboard')
    },
    [checkInHistory, persistCheckInHistory],
  )

  const handlePreferencesChange = useCallback(
    (nextPreferences: UserPreferences) => {
      const languageChanged = nextPreferences.language !== preferences.language
      savePreferences(nextPreferences)
      setPreferences(nextPreferences)
      persistLanguage(nextPreferences.language)

      if (languageChanged) {
        setSettingsFeedback({
          type: 'language-updated',
          message: translate(nextPreferences.language, 'messages.languageUpdated'),
        })
      }
    },
    [preferences.language],
  )

  const handleExportBackup = useCallback(() => {
    const filename = downloadBackup()
    setSettingsFeedback({
      type: 'backup-exported',
      message: translate(preferences.language, 'messages.backupComplete', { filename }),
    })
  }, [preferences.language])

  const handleValidateRestoreFile = useCallback(
    async (file: File) => {
      const text = await file.text()
      const parsed = parseBackupJson(text)
      if (!parsed.valid) {
        const errorKey = ERROR_MESSAGE_KEYS[parsed.code] ?? 'errors.malformedBackup'
        setSettingsFeedback({
          type: parsed.code === 'unsupported-version' ? 'restore-unsupported' : 'restore-invalid',
          message: translate(preferences.language, errorKey),
        })
        return { valid: false as const }
      }

      return { valid: true as const, backup: parsed.backup }
    },
    [preferences.language],
  )

  const handleConfirmRestore = useCallback(
    async (backup: SpsBackupPayload) => {
      const result = restoreSpsBackup(backup)
      if (!result.success) {
        const errorKey =
          ERROR_MESSAGE_KEYS[result.code as keyof typeof ERROR_MESSAGE_KEYS] ??
          'errors.restoreFailed'
        setSettingsFeedback({
          type: result.code === 'unsupported-version' ? 'restore-unsupported' : 'restore-invalid',
          message: translate(preferences.language, errorKey),
        })
        return
      }

      refreshAllAppState()
      setCheckInAllowCancel(false)
      setSettingsFeedback({
        type: 'restore-success',
        message: translate(preferences.language, 'messages.restoreComplete'),
      })
      goToHome()
    },
    [goToHome, preferences.language, refreshAllAppState],
  )

  const handleResetAllData = useCallback(() => {
    resetAllSpsData()
    refreshAllAppState()
    setCheckInAllowCancel(false)
    setSettingsFeedback({
      type: 'reset-success',
      message: translate(preferences.language, 'messages.resetComplete'),
    })
    setScreen('daily-check-in')
  }, [preferences.language, refreshAllAppState])

  const handleCancelCheckIn = useCallback(() => {
    setCheckInAllowCancel(false)
    setScreen('dashboard')
  }, [])

  const handleNavigate = useCallback<NavTabHandler>(
    (tab: NavTabId) => {
      if (tab === 'home') {
        goToHome()
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
        return
      }

      if (tab === 'profile') {
        openProfile()
      }
    },
    [goToHome, handleStartWorkout, openProfile, refreshHistory],
  )

  const activeTab = getActiveNavTab(screen)

  return {
    screen,
    setScreen,
    progress,
    summary,
    history,
    bodyHistory,
    checkInHistory,
    checkInAllowCancel,
    preferences,
    settingsFeedback,
    workoutStatus,
    historyStatistics,
    bodySummary,
    dashboardOverview,
    checkInSummary,
    performanceInsights,
    selectedHistorySession,
    historyDetailSource,
    activeTab,
    goToHome,
    openDailyCheckInForEdit,
    handleProgressChange,
    openProfile,
    openSettings,
    openBodyComposition,
    handleStartWorkout,
    returnHome,
    handleFinishWorkout,
    handleOpenHistorySession,
    handleOpenHistorySessionFromDashboard,
    handleSaveBodyEntry,
    handleDeleteBodyEntry,
    handleSaveCheckInEntry,
    handlePreferencesChange,
    handleExportBackup,
    handleValidateRestoreFile,
    handleConfirmRestore,
    handleResetAllData,
    handleCancelCheckIn,
    handleNavigate,
    dismissSettingsFeedback: () => setSettingsFeedback(null),
  }
}

export type AppState = ReturnType<typeof useAppState>
