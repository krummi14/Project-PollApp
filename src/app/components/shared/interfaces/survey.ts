import { SurveyResponse } from "./survey-response";

/** A survey with its questions. */
export interface Survey {
  /** Unique ID (assigned by the database). */
  id?: number;
  /** Name of the survey. */
  name: string;
  /** End date of the survey as an ISO date string. */
  date: string;
  /** Category of the survey. */
  category: string;
  /** Description of the survey. */
  description: string;
  /** Questions of the survey. */
  questions: Question[];
  /** Optional collected responses to the survey. */
  response?: SurveyResponse;
}

/** A single question of a survey. */
export interface Question {
  /** Text of the question. */
  question: string;
  /** Whether multiple answers may be selected. */
  multipleChoice: boolean;
  /** Answer options of the question. */
  answers: string[];
}