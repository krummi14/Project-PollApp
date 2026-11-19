import { Survey } from "../interfaces/survey";
import { isSurveyAvailable } from "./ends-in-days";

/**
 * Determines the still available surveys that end next.
 *
 * @param surveys - All surveys
 * @param limit - Maximum number of surveys to return (default: 3)
 * @returns The available surveys, sorted ascending by end date
 */
export function loadSurveysEndingSoon(surveys: Survey[], limit = 3): Survey[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return [...surveys]
    .filter((survey) => isSurveyAvailable(survey.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
}