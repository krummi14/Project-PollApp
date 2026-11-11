import { Component, inject, signal } from '@angular/core';
import { AddQuestionMarkPipe } from '../../shared/pipes/add-question-mark-pipe';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { SupabaseService } from '../../shared/services/supabase';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../../shared/interfaces/survey';
import { ProgressBar } from '../../shared/progress-bar/progress-bar';
import { getAnswerVoteCount, getAnswerVotePercentage, getQuestionVoteCount } from '../../shared/utils/response-statistic';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-results',
  imports: [AddQuestionMarkPipe, CapitalizePipe, ProgressBar, JsonPipe],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  readonly dbService = inject(SupabaseService);
  readonly surveyId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly survey = signal<Survey | undefined>(undefined);
  readonly isLoading = signal(true);
  readonly loadError = signal<string | undefined>(undefined);

  getAnswerLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  readonly getAnswerVoteCount = getAnswerVoteCount;
  readonly getQuestionVoteCount = getQuestionVoteCount;
  readonly getAnswerVotePercentage = getAnswerVotePercentage;

  async ngOnInit() {
    try {
      const surveys = await this.dbService.getAllSurveys() ?? [];

      const survey = surveys.find(
        (item) => String(item.id) === this.surveyId
      );

      if (!survey) {
        return;
      }

      if (survey.id !== undefined) {
        survey.response = await this.dbService.getSurveyResponse(survey.id) ?? undefined;
      }

      this.survey.set(survey);

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
