import { EmptyState } from '../ui/EmptyState'
import { useTranslation } from '../../hooks/useTranslation'
import type { PerformanceInsight } from '../../types/insights'
import { DashboardSection } from './DashboardSection'
import './PerformanceInsightsCard.css'

type PerformanceInsightsCardProps = {
  insights: PerformanceInsight[]
}

function getCategoryKey(category: PerformanceInsight['category']): string {
  switch (category) {
    case 'body-composition':
      return 'insights.category.bodyComposition'
    case 'training':
      return 'insights.category.training'
    case 'recovery':
      return 'insights.category.recovery'
    case 'consistency':
      return 'insights.category.consistency'
  }
}

export function PerformanceInsightsCard({ insights }: PerformanceInsightsCardProps) {
  const { t } = useTranslation()

  if (insights.length === 0) {
    return (
      <DashboardSection title={t('insights.title')}>
        <EmptyState
          icon="insights"
          title={t('emptyStates.insightsTitle')}
          description={t('emptyStates.insightsDescription')}
          compact
        />
      </DashboardSection>
    )
  }

  return (
    <DashboardSection title={t('insights.title')}>
      <ul className="performance-insights-card__list">
        {insights.map((insight) => (
          <li key={insight.id}>
            <article
              className={`performance-insights-card__item performance-insights-card__item--${insight.severity}`}
              aria-label={`${insight.title}. ${insight.description}`}
            >
              <div className="performance-insights-card__header">
                <h3 className="performance-insights-card__title">{insight.title}</h3>
                <span className="performance-insights-card__category">
                  {t(getCategoryKey(insight.category))}
                </span>
              </div>
              <p className="performance-insights-card__description">{insight.description}</p>
              <span className="performance-insights-card__severity">
                {t(`insights.severity.${insight.severity}`)}
              </span>
            </article>
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}
