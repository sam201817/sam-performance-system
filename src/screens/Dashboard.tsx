import { BrandHeader } from '../components/BrandHeader'
import { Greeting } from '../components/Greeting'
import { ReadinessCard } from '../components/ReadinessCard'
import { BottomNav } from '../components/BottomNav'
import { HeroWorkoutCard } from '../components/dashboard/HeroWorkoutCard'
import { BodyCompositionDashboardCard } from '../components/dashboard/BodyCompositionDashboardCard'
import { TrainingSummaryCard } from '../components/dashboard/TrainingSummaryCard'
import { LastWorkoutCard } from '../components/dashboard/LastWorkoutCard'
import { StreakCard } from '../components/dashboard/StreakCard'
import { PerformanceInsightsCard } from '../components/dashboard/PerformanceInsightsCard'
import { QuickStatsRow } from '../components/dashboard/QuickStatsRow'
import type { DashboardProps } from '../types/workout'
import './Dashboard.css'

export function Dashboard({
  session,
  workoutStatus,
  onStartWorkout,
  onOpenProfile,
  activeTab,
  onNavigate,
  overview,
  bodySummary,
  hasBodyEntries,
  onOpenBodyComposition,
  onOpenHistorySession,
  checkInSummary,
  onEditCheckIn,
  insights,
}: DashboardProps) {
  return (
    <>
      <main className="app__main dashboard">
        <div className="app__top">
          <BrandHeader onOpenProfile={onOpenProfile} />
          <Greeting />
        </div>

        <div className="dashboard__stack">
          <HeroWorkoutCard
            session={session}
            workoutStatus={workoutStatus}
            hasWorkoutHistory={overview.hasWorkoutHistory}
            onStartWorkout={onStartWorkout}
          />

          <ReadinessCard summary={checkInSummary} onEditCheckIn={onEditCheckIn} />

          <PerformanceInsightsCard insights={insights} />

          <QuickStatsRow
            stats={overview.quickStats}
            hasWorkoutHistory={overview.hasWorkoutHistory}
          />

          <BodyCompositionDashboardCard
            summary={bodySummary}
            hasEntries={hasBodyEntries}
            daysSinceUpdate={overview.daysSinceBodyUpdate}
            onOpenBodyComposition={onOpenBodyComposition}
          />

          <TrainingSummaryCard
            summary={overview.weeklyTraining}
            hasWorkoutHistory={overview.hasWorkoutHistory}
          />

          <div className="dashboard__duo">
            <LastWorkoutCard
              lastWorkout={overview.lastWorkout}
              onOpenSession={onOpenHistorySession}
            />
            <StreakCard
              streak={overview.streak}
              hasWorkoutHistory={overview.hasWorkoutHistory}
            />
          </div>
        </div>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </>
  )
}
