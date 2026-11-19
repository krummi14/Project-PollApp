import { Question, Survey } from '../interfaces/survey';

/** Class for creating a survey with default values for missing fields. */
export class Surveytemplate implements Survey {
  /** Unique ID (assigned by the database). */
  id?: number;
  /** Name of the survey. */
  name: string;
  /** End date of the survey. */
  date: string;
  /** Category of the survey. */
  category: string;
  /** Description of the survey. */
  description: string;
  /** Questions of the survey. */
  questions: Question[];

  /**
   * @param data - Partial survey data; missing values are filled with defaults
   */
  constructor(data: Partial<Survey> = {}) {
    this.id = data.id;
    this.name = data.name ?? '';
    this.date = data.date ?? new Date().toISOString();
    this.category = data.category ?? '';
    this.description = data.description ?? '';
    this.questions = data.questions ?? [];
  }
}