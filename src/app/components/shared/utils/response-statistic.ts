import type { Survey } from '../interfaces/survey';
import type { SurveyResponseQuestion } from '../interfaces/survey-response';

/**
 * Determines the number of votes for an answer.
 *
 * @param survey - The survey including its responses
 * @param questionIndex - Index of the question
 * @param answerIndex - Index of the answer
 * @returns Number of votes (0 if there are none)
 */
export function getAnswerVoteCount(survey: Survey, questionIndex: number, answerIndex: number): number {
  return getVoteQuestions(survey)
    .find((question) => question.questionIndex == questionIndex)
    ?.answers.find((answer) => answer.answerIndex == answerIndex)
    ?.selected.filter(Boolean).length ?? 0;
}

/**
 * Determines the total number of votes for a question.
 *
 * @param survey - The survey including its responses
 * @param questionIndex - Index of the question
 * @returns Sum of the votes of all answers of the question
 */
export function getQuestionVoteCount(survey: Survey, questionIndex: number): number {
  return getVoteQuestions(survey)
    .find((question) => question.questionIndex == questionIndex)
    ?.answers.reduce(
      (total, answer) => total + answer.selected.filter(Boolean).length,
      0
    ) ?? 0;
}

/**
 * Calculates the percentage of votes an answer received within its question.
 *
 * @param survey - The survey including its responses
 * @param questionIndex - Index of the question
 * @param answerIndex - Index of the answer
 * @returns Rounded percentage (0–100); 0 if there are no votes
 */
export function getAnswerVotePercentage(survey: Survey, questionIndex: number, answerIndex: number): number {
  const totalVotes = getQuestionVoteCount(survey, questionIndex);
  if (totalVotes == 0) {
    return 0;
  }
  return Math.round((getAnswerVoteCount(survey, questionIndex, answerIndex) / totalVotes) * 100);
}

/**
 * Returns the response data of the questions of a survey.
 *
 * @param survey - The survey
 * @returns The questions with voting data, or an empty array
 */
function getVoteQuestions(survey: Survey): SurveyResponseQuestion[] {
  const questions = survey.response?.questions;
  return Array.isArray(questions) ? questions : [];
}