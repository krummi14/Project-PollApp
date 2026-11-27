
import { Component, computed, inject, signal, input } from '@angular/core';
import { AddQuestionMarkPipe } from '../../shared/pipes/add-question-mark-pipe';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { SupabaseService } from '../../shared/services/supabase';
import { ActivatedRoute } from '@angular/router';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import {
  getAnswerVoteCount as getStoredAnswerVoteCount,
  getQuestionVoteCount as getStoredQuestionVoteCount
} from '../../shared/utils/response-statistic';
import { getAnswerLabel as getAnswerLabelIndex } from '../../shared/utils/answer-label';
import { Survey } from '../../shared/interfaces/survey';
import { SurveyResponseTemplate } from '../../shared/templates/survey-response-model';

/** Displays the results (votes and percentages) of a survey. */
@Component({
  selector: 'app-results',
  imports: [AddQuestionMarkPipe, CapitalizePipe, ProgressBar],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {

  /** Service for accessing the Supabase database. */
  readonly dbService = inject(SupabaseService);
  /** ID of the displayed survey from the `id` route parameter. */
  readonly surveyId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  /** Whether the data is still loading. */
  readonly isLoading = signal(true);
  /** Error message if loading failed. */
  readonly loadError = signal<string | undefined>(undefined);
  /** The displayed survey including its responses, or `undefined`. */
  readonly survey = computed(() => {
    const survey = this.dbService.surveys().find(
      item => item.id == this.surveyId
    );
    if (!survey) {
      return undefined;
    }
    return {
      ...survey,
      response: this.dbService.surveyResponses()[this.surveyId] ?? undefined
    };
  });

  /** Returns the letter (A, B, C, …) for an answer index. */
  readonly getAnswerLabel = getAnswerLabelIndex;

  readonly votePreview = input<Record<string, boolean>>({});

  getAnswerVoteCount(survey: Survey, questionIndex: number, answerIndex: number): number {
    const controlName = SurveyResponseTemplate.getControlName(questionIndex, answerIndex);
    return getStoredAnswerVoteCount(survey, questionIndex, answerIndex)
      + (this.votePreview()[controlName] ? 1 : 0);
  }

  getQuestionVoteCount(survey: Survey, questionIndex: number): number {
    const previewSelections = survey.questions[questionIndex]?.answers
      .filter((_, answerIndex) =>
        this.votePreview()[SurveyResponseTemplate.getControlName(questionIndex, answerIndex)],
      ).length ?? 0;

    return getStoredQuestionVoteCount(survey, questionIndex) + previewSelections;
  }

  getAnswerVotePercentage(survey: Survey, questionIndex: number, answerIndex: number): number {
    const totalVotes = this.getQuestionVoteCount(survey, questionIndex);

    if (totalVotes == 0) {
      return 0;
    }

    return Math.round((this.getAnswerVoteCount(survey, questionIndex, answerIndex) / totalVotes) * 100);
  }

  /** Loads all surveys on initialization and sets the loading and error state. */
  async ngOnInit() {
    try {
      await this.dbService.getAllSurveys();
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'The survey could not be loaded.';
      this.loadError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }
}