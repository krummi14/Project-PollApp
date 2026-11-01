import { Survey } from "../interfaces/survey";

export function loadSurveysEndingSoon(surveys: Survey[]): Survey[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return [...surveys]
    .filter(survey => new Date(survey.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
}