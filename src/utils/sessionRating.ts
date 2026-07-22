import { translate, type SupportedLanguage } from '../i18n'

export type SessionRatingLabelKey =
  | 'sessionRating.excellent'
  | 'sessionRating.good'
  | 'sessionRating.fair'
  | 'sessionRating.needsImprovement'

export type SessionRatingVariant = 'excellent' | 'good' | 'fair' | 'needs-improvement'

export type SessionRating = {
  labelKey: SessionRatingLabelKey
  variant: SessionRatingVariant
}

const SESSION_RATING_LABEL_KEYS: Record<SessionRatingVariant, SessionRatingLabelKey> = {
  excellent: 'sessionRating.excellent',
  good: 'sessionRating.good',
  fair: 'sessionRating.fair',
  'needs-improvement': 'sessionRating.needsImprovement',
}

export function getSessionRatingLabel(
  rating: SessionRating | SessionRatingVariant,
  language: SupportedLanguage,
): string {
  const variant = typeof rating === 'string' ? rating : rating.variant
  return translate(language, SESSION_RATING_LABEL_KEYS[variant])
}

export function getSessionRating(
  completionPercentage: number,
  averageRpe: number | null,
): SessionRating {
  const hasExcellentRpe =
    averageRpe !== null && averageRpe >= 7 && averageRpe <= 9

  if (completionPercentage >= 95 && hasExcellentRpe) {
    return { labelKey: 'sessionRating.excellent', variant: 'excellent' }
  }

  if (completionPercentage >= 85) {
    return { labelKey: 'sessionRating.good', variant: 'good' }
  }

  if (completionPercentage >= 70) {
    return { labelKey: 'sessionRating.fair', variant: 'fair' }
  }

  return { labelKey: 'sessionRating.needsImprovement', variant: 'needs-improvement' }
}
