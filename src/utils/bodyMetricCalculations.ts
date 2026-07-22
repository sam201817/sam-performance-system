import type {
  BodyMetricEntry,
  BodyMetricField,
  BodyMetricHistory,
  BodyMetricSummary,
  ChartPoint,
  MetricTrendData,
  TrendDirection,
  TrendMetricId,
} from '../types/bodyMetrics'

export function sortEntriesNewestFirst(
  entries: readonly BodyMetricEntry[],
): BodyMetricEntry[] {
  return [...entries].sort(
    (left, right) => Date.parse(right.recordedAt) - Date.parse(left.recordedAt),
  )
}

export function getLocalDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getEntryDateKey(recordedAt: string): string | null {
  const date = new Date(recordedAt)
  if (!Number.isFinite(date.getTime())) return null
  return getLocalDateKey(date)
}

export function formatRelativeBodyDate(
  recordedAt: string,
  now: Date = new Date(),
): string {
  const date = new Date(recordedAt)
  if (!Number.isFinite(date.getTime())) return 'Unknown'

  const todayKey = getLocalDateKey(now)
  const entryKey = getLocalDateKey(date)
  if (entryKey === todayKey) return 'Today'

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  if (entryKey === getLocalDateKey(yesterday)) return 'Yesterday'

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

export function getMetricValue(entry: BodyMetricEntry, metric: BodyMetricField): number | null {
  return entry[metric]
}

export function getEntriesWithMetric(
  entries: readonly BodyMetricEntry[],
  metric: BodyMetricField,
): BodyMetricEntry[] {
  return sortEntriesNewestFirst(entries).filter((entry) => entry[metric] !== null)
}

export function getLatestValidValue(
  entries: readonly BodyMetricEntry[],
  metric: BodyMetricField,
): number | null {
  const match = getEntriesWithMetric(entries, metric)[0]
  return match ? match[metric] : null
}

export function getPreviousValidValue(
  entries: readonly BodyMetricEntry[],
  metric: BodyMetricField,
): number | null {
  const matches = getEntriesWithMetric(entries, metric)
  return matches.length > 1 ? matches[1][metric] : null
}

export function calculateAbsoluteChange(
  latest: number | null,
  previous: number | null,
): number | null {
  if (latest === null || previous === null) return null
  return Math.round((latest - previous) * 10) / 10
}

export function calculatePercentageChange(
  latest: number | null,
  previous: number | null,
): number | null {
  if (latest === null || previous === null || previous === 0) return null
  return Math.round(((latest - previous) / previous) * 1000) / 10
}

export function calculateAverage(values: readonly number[]): number | null {
  if (values.length === 0) return null
  const total = values.reduce((sum, value) => sum + value, 0)
  return Math.round((total / values.length) * 10) / 10
}

export function getTrendDirection(change: number | null): TrendDirection {
  if (change === null) return 'unknown'
  if (change > 0) return 'up'
  if (change < 0) return 'down'
  return 'flat'
}

export function buildBodyMetricSummary(entries: readonly BodyMetricEntry[]): BodyMetricSummary {
  const latestWeightKg = getLatestValidValue(entries, 'weightKg')
  const previousWeightKg = getPreviousValidValue(entries, 'weightKg')
  const latestBodyFatPercent = getLatestValidValue(entries, 'bodyFatPercent')
  const previousBodyFatPercent = getPreviousValidValue(entries, 'bodyFatPercent')
  const latestMuscleMassKg = getLatestValidValue(entries, 'muscleMassKg')
  const previousMuscleMassKg = getPreviousValidValue(entries, 'muscleMassKg')
  const latestWaistCm = getLatestValidValue(entries, 'waistCm')
  const previousWaistCm = getPreviousValidValue(entries, 'waistCm')

  const sorted = sortEntriesNewestFirst(entries)

  return {
    latestWeightKg,
    previousWeightKg,
    weightChangeKg: calculateAbsoluteChange(latestWeightKg, previousWeightKg),
    latestBodyFatPercent,
    previousBodyFatPercent,
    bodyFatChangePercent: calculateAbsoluteChange(latestBodyFatPercent, previousBodyFatPercent),
    latestMuscleMassKg,
    previousMuscleMassKg,
    muscleMassChangeKg: calculateAbsoluteChange(latestMuscleMassKg, previousMuscleMassKg),
    latestWaistCm,
    previousWaistCm,
    waistChangeCm: calculateAbsoluteChange(latestWaistCm, previousWaistCm),
    lastUpdatedAt: sorted[0]?.recordedAt ?? null,
  }
}

export function normalizeChartPoints(
  entries: readonly BodyMetricEntry[],
  metric: BodyMetricField,
  limit = 30,
): ChartPoint[] {
  const validEntries = sortEntriesNewestFirst(entries)
    .filter((entry) => entry[metric] !== null)
    .slice(0, limit)
    .reverse()

  if (validEntries.length === 0) return []

  const values = validEntries.map((entry) => entry[metric] as number)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min
  const denominator = validEntries.length === 1 ? 1 : validEntries.length - 1

  return validEntries.map((entry, index) => {
    const value = entry[metric] as number
    const normalizedY =
      range === 0 ? 0.5 : 1 - (value - min) / range

    return {
      id: entry.id,
      recordedAt: entry.recordedAt,
      value,
      x: index / denominator,
      y: normalizedY,
    }
  })
}

export function buildMetricTrendData(
  entries: readonly BodyMetricEntry[],
  metric: TrendMetricId,
): MetricTrendData {
  const metricEntries = getEntriesWithMetric(entries, metric)
  const values = metricEntries.map((entry) => entry[metric] as number)
  const latestValue = values[0] ?? null
  const previousValue = values[1] ?? null
  const absoluteChange = calculateAbsoluteChange(latestValue, previousValue)
  const percentageChange = calculatePercentageChange(latestValue, previousValue)

  return {
    metric,
    points: normalizeChartPoints(entries, metric),
    latestValue,
    previousValue,
    absoluteChange,
    percentageChange,
    minimum: values.length > 0 ? Math.min(...values) : null,
    maximum: values.length > 0 ? Math.max(...values) : null,
    average: calculateAverage(values),
    direction: getTrendDirection(absoluteChange),
  }
}

export function formatMetricValue(metric: BodyMetricField, value: number): string {
  switch (metric) {
    case 'weightKg':
    case 'muscleMassKg':
      return `${value} kg`
    case 'bodyFatPercent':
      return `${value}%`
    case 'waistCm':
      return `${value} cm`
  }
}

export function formatChangeValue(
  metric: BodyMetricField,
  change: number | null,
): string | null {
  if (change === null) return null
  const prefix = change > 0 ? '+' : ''
  switch (metric) {
    case 'weightKg':
    case 'muscleMassKg':
      return `${prefix}${change} kg`
    case 'bodyFatPercent':
      return `${prefix}${change}%`
    case 'waistCm':
      return `${prefix}${change} cm`
  }
}

export function getMetricLabel(metric: BodyMetricField): string {
  switch (metric) {
    case 'weightKg':
      return 'Weight'
    case 'bodyFatPercent':
      return 'Body Fat'
    case 'muscleMassKg':
      return 'Muscle'
    case 'waistCm':
      return 'Waist'
  }
}

export function hasBodyMetricEntries(history: BodyMetricHistory): boolean {
  return history.entries.length > 0
}
