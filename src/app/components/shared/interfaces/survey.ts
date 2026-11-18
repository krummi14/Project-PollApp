import { SurveyResponse } from "./survey-response";

export interface Survey {
  id?: number;
  name: string;
  date: string;
  category: string;
  description: string;
  questions: Question[];
  response?: SurveyResponse;
}

export interface Question {
  question: string;
  multipleChoice: boolean;
  answers: string[];
}