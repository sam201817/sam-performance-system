export const METRIC_STATES = ['尚未回報', '良好', '普通', '不佳'] as const

export type MetricState = (typeof METRIC_STATES)[number]

export type MetricKey = 'sleep' | 'energy' | 'stomach'

export type ReadinessMetrics = Record<MetricKey, MetricState>

const STORAGE_KEY = 'sps-readiness-metrics'

const DEFAULT: ReadinessMetrics = {
  sleep: '尚未回報',
  energy: '尚未回報',
  stomach: '尚未回報',
}

function isMetricState(value: unknown): value is MetricState {
  return METRIC_STATES.includes(value as MetricState)
}

export function loadReadinessMetrics(): ReadinessMetrics {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT }
    const parsed = JSON.parse(raw) as Partial<ReadinessMetrics>
    return {
      sleep: isMetricState(parsed.sleep) ? parsed.sleep : DEFAULT.sleep,
      energy: isMetricState(parsed.energy) ? parsed.energy : DEFAULT.energy,
      stomach: isMetricState(parsed.stomach) ? parsed.stomach : DEFAULT.stomach,
    }
  } catch {
    return { ...DEFAULT }
  }
}

export function saveReadinessMetrics(metrics: ReadinessMetrics): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics))
  } catch {
    /* storage unavailable */
  }
}

export function cycleMetricState(current: MetricState): MetricState {
  const index = METRIC_STATES.indexOf(current)
  return METRIC_STATES[(index + 1) % METRIC_STATES.length]
}
