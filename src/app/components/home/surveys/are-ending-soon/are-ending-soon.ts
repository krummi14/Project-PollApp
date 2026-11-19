import { Component, inject, signal } from '@angular/core';
import { EndingSurvey } from './ending-survey/ending-survey';
import { SupabaseService } from '../../../shared/services/supabase';
import { Survey } from '../../../shared/interfaces/survey';
import { surveyEndsIn } from '../../../shared/utils/ends-in-days';
import { loadSurveysEndingSoon } from '../../../shared/utils/surveys-ending-soon';
import { RouterLink } from '@angular/router';

/** Shows the surveys that end next. */
@Component({
  selector: 'app-are-ending-soon',
  imports: [EndingSurvey, RouterLink],
  templateUrl: './are-ending-soon.html',
  styleUrl: './are-ending-soon.scss',
})
export class AreEndingSoon {
  /** Service for accessing the Supabase database. */
  readonly surveyService = inject(SupabaseService);
  /** List of surveys ending soon. */
  readonly surveysEndingSoon = signal<Survey[]>([]);
  /** Calculates the remaining days until a survey ends. */
  readonly surveyEndsIn = surveyEndsIn;

  /** Loads the surveys ending soon on initialization. */
  async ngOnInit() {
    this.loadSurveysEndingSoon();
  }

  /**
   * Loads all surveys and determines the ones ending soon.
   *
   * @returns A promise that resolves once loading has completed
   */
  async loadSurveysEndingSoon() {
    const surveys = (await this.surveyService.getAllSurveys()) ?? [];
    this.surveysEndingSoon.set(loadSurveysEndingSoon(surveys));
  }
}
