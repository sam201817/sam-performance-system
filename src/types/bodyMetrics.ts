export const BODY_METRIC_VERSION = 1 as const

export type BodyMetricField =
  | 'weightKg'
  | 'bodyFatPercent'
  | 'muscleMassKg'
  | 'waistCm'

export type BodyMetricEntry = {
  id: string
  recordedAt: string
  weightKg: number | null
  bodyFatPercent: number | null
  muscleMassKg: number | null
  waistCm: number | null
  notes: string | null
  version: typeof BODY_METRIC_VERSION
}

export type BodyMetricHistory = {
  version: typeof BODY_METRIC_VERSION
  entries: BodyMetricEntry[]
}

export type BodyMetricDraft = {
  weightKg: string
  bodyFatPercent: string
  muscleMassKg: string
  waistCm: string
  notes: string
}

export type BodyMetricSummary = {
  latestWeightKg: number | null
  previousWeightKg: number | null
  weightChangeKg: number | null
  latestBodyFatPercent: number | null
  previousBodyFatPercent: number | null
  bodyFatChangePercent: number | null
  latestMuscleMassKg: number | null
  previousMuscleMassKg: number | null
  muscleMassChangeKg: number | null
  latestWaistCm: number | null
  previousWaistCm: number | null
  waistChangeCm: number | null
  lastUpdatedAt: string | null
}

export type TrendMetricId = BodyMetricField

export type TrendDirection = 'up' | 'down' | 'flat' | 'unknown'

export type ChartPoint = {
  id: string
  recordedAt: string
  value: number
  x: number
  y: number
}

export type MetricTrendData = {
  metric: TrendMetricId
  points: ChartPoint[]
  latestValue: number | null
  previousValue: number | null
  absoluteChange: number | null
  percentageChange: number | null
  minimum: number | null
  maximum: number | null
  average: number | null
  direction: TrendDirection
}
