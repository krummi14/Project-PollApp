import { Survey } from '../interfaces/survey';
import { SurveyResponse, SurveyResponseQuestion } from '../interfaces/survey-response';

/** Creates a {@link SurveyResponse} object from a survey and the form values. */
export class SurveyResponseTemplate implements SurveyResponse {
  /** ID of the answered survey. */
  surveyId: number;
  /** Responses per question. */
  questions: SurveyResponseQuestion[];

  /**
   * @param survey - The answered survey
   * @param formValue - Form values; keys are the control names from {@link SurveyResponseTemplate.getControlName}
   * @throws Error if the survey has no ID
   */
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

  /**
   * Builds the name of the form control for an answer.
   *
   * @param questionIndex - Index of the question
   * @param answerIndex - Index of the answer
   * @returns Control name in the format `question{questionIndex}Answer{answerIndex}`
   */
  static getControlName(questionIndex: number, answerIndex: number): string {
    return `question${questionIndex}Answer${answerIndex}`;
  }
}