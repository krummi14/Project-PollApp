
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

@Component({
  selector: 'app-results',
  imports: [AddQuestionMarkPipe, CapitalizePipe, ProgressBar],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {

  readonly dbService = inject(SupabaseService);
  readonly surveyId = Number(inject(ActivatedRoute).snapshot.paramMap.get('id'));
  readonly isLoading = signal(true);
  readonly loadError = signal<string | undefined>(undefined);
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

  readonly getAnswerLabel = getAnswerLabelIndex;
  readonly getAnswerVoteCount = getAnswerVoteCount;
  readonly getQuestionVoteCount = getQuestionVoteCount;
  readonly getAnswerVotePercentage = getAnswerVotePercentage;

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