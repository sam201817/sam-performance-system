import type { PerformanceInsight } from '../../types/insights'
import { DashboardSection } from './DashboardSection'
import './PerformanceInsightsCard.css'

type PerformanceInsightsCardProps = {
  insights: PerformanceInsight[]
}

const SEVERITY_LABEL: Record<PerformanceInsight['severity'], string> = {
  info: 'Info',
  positive: 'Positive',
  warning: 'Attention',
  critical: 'Important',
}

function formatCategoryLabel(category: PerformanceInsight['category']): string {
  switch (category) {
    case 'body-composition':
      return 'Body'
    case 'training':
      return 'Training'
    case 'recovery':
      return 'Recovery'
    case 'consistency':
      return 'Consistency'
  }
}

export function PerformanceInsightsCard({ insights }: PerformanceInsightsCardProps) {
  if (insights.length === 0) {
    return (
      <DashboardSection title="Performance Insights">
        <p className="performance-insights-card__empty" role="status">
          Keep logging workouts, check-ins, and body metrics to unlock personalized insights.
        </p>
      </DashboardSection>
    )
  }

  return (
    <DashboardSection title="Performance Insights">
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
                  {formatCategoryLabel(insight.category)}
                </span>
              </div>
              <p className="performance-insights-card__description">{insight.description}</p>
              <span className="performance-insights-card__severity">
                {SEVERITY_LABEL[insight.severity]}
              </span>
            </article>
          </li>
        ))}
      </ul>
    </DashboardSection>
  )
}
