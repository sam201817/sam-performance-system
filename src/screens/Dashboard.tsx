import { BrandHeader } from '../components/BrandHeader'
import { Greeting } from '../components/Greeting'
import { ReadinessCard } from '../components/ReadinessCard'
import { WorkoutCard } from '../components/WorkoutCard'
import { BodyGoalCard } from '../components/BodyGoalCard'
import { WeeklyConsistency } from '../components/WeeklyConsistency'
import { BottomNav } from '../components/BottomNav'
import type { DashboardProps } from '../types/workout'

export function Dashboard({
  session,
  workoutStatus,
  onStartWorkout,
  activeTab,
  onNavigate,
}: DashboardProps) {
  return (
    <>
      <main className="app__main">
        <div className="app__top">
          <BrandHeader />
          <Greeting />
        </div>

        <div className="app__cards">
          <ReadinessCard />
          <WorkoutCard
            session={session}
            workoutStatus={workoutStatus}
            onStartWorkout={onStartWorkout}
          />
          <BodyGoalCard />
          <WeeklyConsistency />
        </div>
      </main>

      <BottomNav activeTab={activeTab} onNavigate={onNavigate} />
    </>
  )
}
