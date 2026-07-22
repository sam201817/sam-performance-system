import { I18nProvider } from './i18n/I18nProvider'
import { BodyComposition } from './screens/BodyComposition'
import { DailyCheckIn } from './screens/DailyCheckIn'
import { Dashboard } from './screens/Dashboard'
import { History } from './screens/History'
import { Profile } from './screens/Profile'
import { Settings } from './screens/Settings'
import { Workout } from './screens/Workout'
import { WorkoutComplete } from './screens/WorkoutComplete'
import { WorkoutHistoryDetail } from './screens/WorkoutHistoryDetail'
import { TODAY_WORKOUT } from './data/todayWorkout'
import { useAppState } from './app/useAppState'
import './App.css'

function App() {
  const app = useAppState()

  return (
    <I18nProvider language={app.preferences.language}>
      <div className="app-shell">
        <div className="app-shell__glow" aria-hidden="true" />
        <div className="app">
          {app.screen === 'daily-check-in' && (
            <DailyCheckIn
              history={app.checkInHistory}
              allowCancel={app.checkInAllowCancel}
              onSaveEntry={app.handleSaveCheckInEntry}
              onCancel={app.handleCancelCheckIn}
            />
          )}
          {app.screen === 'dashboard' && (
            app.checkInSummary ? (
            <Dashboard
              session={TODAY_WORKOUT}
              workoutStatus={app.workoutStatus}
              onStartWorkout={app.handleStartWorkout}
              onOpenProfile={app.openProfile}
              activeTab={app.activeTab}
              onNavigate={app.handleNavigate}
              overview={app.dashboardOverview}
              bodySummary={app.bodySummary}
              hasBodyEntries={app.bodyHistory.entries.length > 0}
              onOpenBodyComposition={app.openBodyComposition}
              onOpenHistorySession={app.handleOpenHistorySessionFromDashboard}
              checkInSummary={app.checkInSummary}
              onEditCheckIn={app.openDailyCheckInForEdit}
              insights={app.performanceInsights.topInsights}
            />
            ) : (
              <DailyCheckIn
                history={app.checkInHistory}
                allowCancel={false}
                onSaveEntry={app.handleSaveCheckInEntry}
                onCancel={app.handleCancelCheckIn}
              />
            )
          )}
          {app.screen === 'workout' && app.progress && (
            <Workout
              session={TODAY_WORKOUT}
              progress={app.progress}
              onProgressChange={app.handleProgressChange}
              onBack={app.goToHome}
              onFinish={app.handleFinishWorkout}
            />
          )}
          {app.screen === 'complete' && app.summary && (
            <WorkoutComplete summary={app.summary} onReturnHome={app.returnHome} />
          )}
          {app.screen === 'history' && (
            <History
              sessions={app.history.sessions}
              statistics={app.historyStatistics}
              activeTab={app.activeTab}
              onNavigate={app.handleNavigate}
              onOpenSession={app.handleOpenHistorySession}
            />
          )}
          {app.screen === 'history-detail' && app.selectedHistorySession && (
            <WorkoutHistoryDetail
              session={app.selectedHistorySession}
              onBack={() =>
                app.setScreen(
                  app.historyDetailSource === 'dashboard' ? 'dashboard' : 'history',
                )
              }
            />
          )}
          {app.screen === 'body-composition' && (
            <BodyComposition
              history={app.bodyHistory}
              activeTab={app.activeTab}
              onNavigate={app.handleNavigate}
              onSaveEntry={app.handleSaveBodyEntry}
              onDeleteEntry={app.handleDeleteBodyEntry}
            />
          )}
          {app.screen === 'profile' && (
            <Profile
              activeTab={app.activeTab}
              onNavigate={app.handleNavigate}
              onOpenBodyComposition={app.openBodyComposition}
              onOpenSettings={app.openSettings}
            />
          )}
          {app.screen === 'settings' && (
            <Settings
              preferences={app.preferences}
              activeTab={app.activeTab}
              feedback={app.settingsFeedback}
              onNavigate={app.handleNavigate}
              onBack={app.openProfile}
              onPreferencesChange={app.handlePreferencesChange}
              onExportBackup={app.handleExportBackup}
              onValidateRestoreFile={app.handleValidateRestoreFile}
              onConfirmRestore={app.handleConfirmRestore}
              onResetAllData={app.handleResetAllData}
              onDismissFeedback={app.dismissSettingsFeedback}
            />
          )}
        </div>
      </div>
    </I18nProvider>
  )
}

export default App
