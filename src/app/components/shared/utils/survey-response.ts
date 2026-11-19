import { SurveyResponse } from "../interfaces/survey-response";

/**
 * Merges stored responses with new responses.
 *
 * @remarks
 * Supports both the current format ({@link SurveyResponse}) and the
 * legacy format (object of control names and boolean values).
 * The votes (`selected`) are concatenated per answer.
 *
 * @param existingResponse - The previously stored responses (any format or `null`)
 * @param newResponse - The new responses
 * @returns The merged responses
 * @throws Error if the stored data has an invalid format
 */
export function mergeSurveyResponses(existingResponse: unknown, newResponse: SurveyResponse): SurveyResponse {
  if (existingResponse == null) return newResponse;
  if (isLegacyResponse(existingResponse)) return mergeLegacyResponse(existingResponse, newResponse);
  if (!isSurveyResponse(existingResponse)) throw new Error('The stored response data has an invalid format.');
  return {
    surveyId: newResponse.surveyId,
    questions: newResponse.questions.map((newQuestion) => {
      const existingQuestion = existingResponse.questions.find(
        (question) => question.questionIndex == newQuestion.questionIndex,
      );
      return {
        ...newQuestion,
        answers: newQuestion.answers.map((newAnswer) => {
          const existingAnswer = existingQuestion?.answers.find(
            (answer) => answer.answerIndex === newAnswer.answerIndex,
          );
          return {
            ...newAnswer,
            selected: [...(existingAnswer?.selected ?? []), ...newAnswer.selected],
          };
        }),
      };
    }),
  };
}

/**
 * Merges responses in the legacy format with new responses.
 *
 * @param legacyResponse - Responses in the legacy format (control name → selected)
 * @param newResponse - The new responses
 * @returns The merged responses in the current format
 */
function mergeLegacyResponse(
  legacyResponse: Record<string, boolean>,
  newResponse: SurveyResponse
): SurveyResponse {
  return {
    surveyId: newResponse.surveyId,
    questions: newResponse.questions.map((question) => ({
      ...question,
      answers: question.answers.map((answer) => {
        const controlName = `question${question.questionIndex}Answer${answer.answerIndex}`;
        const selected: boolean[] = legacyResponse[controlName]
          ? [true, ...answer.selected]
          : [...answer.selected];
        return {
          ...answer,
          selected,
        };
      }),
    })),
  };
}

/**
 * Checks whether a value is in the legacy response format.
 *
 * @param value - The value to check
 * @returns `true` if the value is an object containing only boolean values
 */
function isLegacyResponse(value: unknown): value is Record<string, boolean> {
  return typeof value == 'object'
    && value != null
    && !Array.isArray(value)
    && Object.values(value).every((selection) => typeof selection === 'boolean');
}

/**
 * Checks whether a value is a valid {@link SurveyResponse} object.
 *
 * @param value - The value to check
 * @returns `true` if the value matches the format
 */
function isSurveyResponse(value: unknown): value is SurveyResponse {
  if (
    typeof value != 'object'
    || value == null
    || !('surveyId' in value)
    || typeof value.surveyId != 'number'
    || !('questions' in value)
    || !Array.isArray(value.questions)
  ) {
    return false;
  }
  return value.questions.every((question: unknown) => isSurveyResponseQuestion(question));
}

/**
 * Checks whether a value is a valid {@link SurveyResponseQuestion}.
 *
 * @param value - The value to check
 * @returns `true` if the value matches the format
 */
function isSurveyResponseQuestion(value: unknown): boolean {
  if (
    typeof value != 'object'
    || value == null
    || !('questionIndex' in value)
    || typeof value.questionIndex != 'number'
    || !('question' in value)
    || typeof value.question != 'string'
    || !('answers' in value)
    || !Array.isArray(value.answers)
  ) {
    return false;
  }
  return value.answers.every((answer: unknown) => isSurveyResponseAnswer(answer));
}

/**
 * Checks whether a value is a valid {@link SurveyResponseAnswer}.
 *
 * @param value - The value to check
 * @returns `true` if the value matches the format
 */
function isSurveyResponseAnswer(value: unknown): boolean {
  if (
    typeof value != 'object'
    || value == null
    || !('answerIndex' in value)
    || typeof value.answerIndex != 'number'
    || !('answer' in value)
    || typeof value.answer != 'string'
    || !('selected' in value)
    || !Array.isArray(value.selected)
  ) {
    return false;
  }
  return value.selected.every(
    (selection: unknown) => typeof selection == 'boolean'
  );
}

