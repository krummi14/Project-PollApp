import { Component, inject, signal } from '@angular/core';
import { EndingSurvey } from './ending-survey/ending-survey';
import { SupabaseService } from '../../../shared/services/supabase';
import { Survey } from '../../../shared/interfaces/survey';
import { surveyEndsIn } from '../../../shared/utils/ends-in-days';
import { loadSurveysEndingSoon } from '../../../shared/utils/surveys-ending-soon';

@Component({
  selector: 'app-are-ending-soon',
  imports: [EndingSurvey],
  templateUrl: './are-ending-soon.html',
  styleUrl: './are-ending-soon.scss',
})
export class AreEndingSoon {
  readonly surveyService = inject(SupabaseService);
  readonly surveysEndingSoon = signal<Survey[]>([]);
  readonly surveyEndsIn = surveyEndsIn;

  async ngOnInit() {
    this.loadSurveysEndingSoon();
  }

  async loadSurveysEndingSoon() {
    const surveys = (await this.surveyService.getAllSurveys()) ?? [];
    this.surveysEndingSoon.set(loadSurveysEndingSoon(surveys));
  }
}
