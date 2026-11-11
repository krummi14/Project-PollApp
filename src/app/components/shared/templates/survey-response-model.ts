import { Survey } from '../interfaces/survey';
import { SurveyResponse, SurveyResponseQuestion } from '../interfaces/survey-response';

export class SurveyResponseTemplate implements SurveyResponse {
  surveyId: number;
  questions: SurveyResponseQuestion[];

  constructor(survey: Survey, formValue: Record<string, boolean>) {
    if (survey.id == undefined) {
      throw new Error('Survey ID is missing.');
    }

    this.surveyId = survey.id;
    this.questions = survey.questions.map((question, questionIndex) => ({
      questionIndex,
      question: question.question,
      answers: question.answers.map((answer, answerIndex) => {
        const selected: true[] = formValue[
          SurveyResponseTemplate.getControlName(questionIndex, answerIndex)
        ] ? [true] : [];

        return {
          answerIndex,
          answer,
          selected,
        };
      }),
    }));
  }

  static getControlName(questionIndex: number, answerIndex: number): string {
    return `question${questionIndex}Answer${answerIndex}`;
  }
}