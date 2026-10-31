import { Question, Survey } from '../interfaces/survey';

export class Surveytemplate implements Survey {
  name: string;
  date: Date;
  category: string;
  description: string;
  questions: Question[];

  constructor(data: Partial<Survey> = {}) {
    this.name = data.name ?? '';
    this.date = data.date ?? new Date();
    this.category = data.category ?? '';
    this.description = data.description ?? '';
    this.questions = data.questions ?? [];
  }
}