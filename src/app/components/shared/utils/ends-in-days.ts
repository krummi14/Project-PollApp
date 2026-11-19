/**
 * Calculates the number of days until a survey ends (rounded up).
 *
 * @param endDate - End date of the survey
 * @returns Remaining days; negative if the date lies in the past
 */
export function surveyEndsIn(endDate: Date | string): number {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Checks whether a survey is still available. A survey is considered available
 * until the end of its end date (23:59:59.999).
 *
 * @param endDate - End date of the survey
 * @param now - Point in time to compare against (default: current time)
 * @returns `true` if the survey has not ended yet
 */
export function isSurveyAvailable(endDate: Date | string, now = new Date()): boolean {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return end.getTime() >= now.getTime();
}
