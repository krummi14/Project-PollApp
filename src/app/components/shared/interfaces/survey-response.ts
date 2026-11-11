export interface SurveyResponse {
    surveyId: number;
    questions: SurveyResponseQuestion[];
}

export interface SurveyResponseAnswer {
    answerIndex: number;
    answer: string;
    selected: boolean[];
}

export interface SurveyResponseQuestion {
    questionIndex: number;
    question: string;
    answers: SurveyResponseAnswer[];
}