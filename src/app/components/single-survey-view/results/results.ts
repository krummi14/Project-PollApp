
import { Component, computed, inject, signal } from '@angular/core';
import { AddQuestionMarkPipe } from '../../shared/pipes/add-question-mark-pipe';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { SupabaseService } from '../../shared/services/supabase';
import { ActivatedRoute } from '@angular/router';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import {
  getAnswerVoteCount,
  getAnswerVotePercentage,
  getQuestionVoteCount
} from '../../shared/utils/response-statistic';
import { getAnswerLabel as getAnswerLabelIndex } from '../../shared/utils/answer-label';

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
  /** Determines the number of votes for an answer. */
  readonly getAnswerVoteCount = getAnswerVoteCount;
  /** Determines the total number of votes for a question. */
  readonly getQuestionVoteCount = getQuestionVoteCount;
  /** Calculates the percentage of votes for an answer. */
  readonly getAnswerVotePercentage = getAnswerVotePercentage;

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