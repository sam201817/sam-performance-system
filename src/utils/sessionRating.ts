export type SessionRatingLabel = 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement'

export type SessionRatingVariant = 'excellent' | 'good' | 'fair' | 'needs-improvement'

export type SessionRating = {
  label: SessionRatingLabel
  variant: SessionRatingVariant
}

export function getSessionRating(
  completionPercentage: number,
  averageRpe: number | null,
): SessionRating {
  const hasExcellentRpe =
    averageRpe !== null && averageRpe >= 7 && averageRpe <= 9

  if (completionPercentage >= 95 && hasExcellentRpe) {
    return { label: 'Excellent', variant: 'excellent' }
  }

  if (completionPercentage >= 85) {
    return { label: 'Good', variant: 'good' }
  }

  if (completionPercentage >= 70) {
    return { label: 'Fair', variant: 'fair' }
  }

  return { label: 'Needs Improvement', variant: 'needs-improvement' }
}
