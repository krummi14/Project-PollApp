import { Component, inject, signal } from '@angular/core';
import { AddQuestionMarkPipe } from '../../shared/pipes/add-question-mark-pipe';
import { CapitalizePipe } from '../../shared/pipes/capitalize-pipe';
import { SupabaseService } from '../../shared/services/supabase';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../../shared/interfaces/survey';

@Component({
  selector: 'app-results',
  imports: [AddQuestionMarkPipe, CapitalizePipe],
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

  async ngOnInit() {
    try {
      const surveys = await this.dbService.getAllSurveys() ?? [];

      this.survey.set(surveys.find((survey) => String(survey.id) === this.surveyId));
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'The surveys could not be loaded.';

      this.loadError.set(message);
    } finally {
      this.isLoading.set(false);
    }
  }
}
