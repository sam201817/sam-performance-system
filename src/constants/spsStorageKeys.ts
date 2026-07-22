export const SPS_STORAGE_KEYS = {
  workoutProgress: 'sps.workout-progress.v1',
  workoutSummary: 'sps.workout-summary.v1',
  workoutHistory: 'sps.workout-history.v1',
  bodyMetrics: 'sps.body-metrics.v1',
  dailyCheckIn: 'sps.daily-check-in.v1',
  preferences: 'sps.preferences.v1',
  legacyReadiness: 'sps-readiness-metrics',
} as const

export const ALL_SPS_STORAGE_KEYS = Object.values(SPS_STORAGE_KEYS)
