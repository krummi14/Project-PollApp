/** Collected responses to a survey. */
export interface SurveyResponse {
    /** ID of the associated survey. */
    surveyId: number;
    /** Responses per question. */
    questions: SurveyResponseQuestion[];
}

/** Voting data for a single answer option. */
export interface SurveyResponseAnswer {
    /** Index of the answer within the question. */
    answerIndex: number;
    /** Text of the answer. */
    answer: string;
    /** List of votes; each `true` entry represents one vote. */
    selected: boolean[];
}

/** Voting data for a single question. */
export interface SurveyResponseQuestion {
    /** Index of the question within the survey. */
    questionIndex: number;
    /** Text of the question. */
    question: string;
    /** Voting data of the answer options. */
    answers: SurveyResponseAnswer[];
}