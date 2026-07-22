import { Card } from '../Card'
import { EmptyState } from '../ui/EmptyState'
import { useTranslation } from '../../hooks/useTranslation'
import type { StreakSummary } from '../../types/dashboard'
import './StreakCard.css'

type StreakCardProps = {
  streak: StreakSummary
  hasWorkoutHistory: boolean
}

export function StreakCard({ streak, hasWorkoutHistory }: StreakCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="streak-card" delay={0.18} aria-label={t('dashboard.streak')}>
      <h2 className="streak-card__title">{t('dashboard.streak')}</h2>

      {!hasWorkoutHistory ? (
        <EmptyState
          icon="streak"
          title={t('emptyStates.streakTitle')}
          description={t('emptyStates.streakDescription')}
          compact
        />
      ) : (
        <div className="streak-card__layout">
          <div className="streak-card__hero">
            <span className="streak-card__hero-label">{t('dashboard.currentStreak')}</span>
            <strong className="streak-card__hero-value">{streak.currentStreak}</strong>
            <span className="streak-card__hero-unit">{t('dashboard.days')}</span>
          </div>

          <div className="streak-card__secondary">
            <div className="streak-card__metric">
              <span className="streak-card__metric-label">{t('dashboard.longestStreak')}</span>
              <strong className="streak-card__metric-value">
                {streak.longestStreak} {t('dashboard.days')}
              </strong>
            </div>
            <div className="streak-card__metric">
              <span className="streak-card__metric-label">{t('dashboard.totalWorkouts')}</span>
              <strong className="streak-card__metric-value">{streak.totalCompletedWorkouts}</strong>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
