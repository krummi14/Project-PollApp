/**
 * Available survey categories with internal value and display label.
 *
 * @remarks
 * `allSurveys` serves as the filter option for "all categories".
 */
export const SURVEY_CATEGORIES = [
  { value: 'allSurveys', label: 'All Surveys' },
  { value: 'teamActivities', label: 'Team Activities' },
  { value: 'healthAndWellness', label: 'Health & Wellness' },
  { value: 'gaming', label: 'Gaming & Entertainment' },
  { value: 'educationAndLearning', label: 'Education & Learning' },
  { value: 'lifestyleAndPreferences', label: 'Lifestyle & Preferences' },
  { value: 'technologyAndInnovation', label: 'Technology & Innovation' },
] as const;