import { Survey } from "../interfaces/survey";
import { isSurveyAvailable } from "./ends-in-days";

export function loadSurveysEndingSoon(surveys: Survey[], limit = 3): Survey[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return [...surveys]
    .filter((survey) => isSurveyAvailable(survey.date))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, limit);
}