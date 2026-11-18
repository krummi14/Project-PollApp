import { Question, Survey } from '../interfaces/survey';

export class Surveytemplate implements Survey {
  id?: number;
  name: string;
  date: string;
  category: string;
  description: string;
  questions: Question[];

  constructor(data: Partial<Survey> = {}) {
    this.id = data.id;
    this.name = data.name ?? '';
    this.date = data.date ?? new Date().toISOString();
    this.category = data.category ?? '';
    this.description = data.description ?? '';
    this.questions = data.questions ?? [];
  }
}