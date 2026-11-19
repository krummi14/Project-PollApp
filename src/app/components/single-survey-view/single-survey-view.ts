
import { Component, inject, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Button } from '../shared/button/button';
import { Dialog } from '../shared/services/dialog';
import { Content } from './content/content';
import { Results } from './results/results';
import { SupabaseService } from '../shared/services/supabase';

/** Detail view of a single survey with its questions and results. */
@Component({
  selector: 'app-single-survey-view',
  imports: [Button, Content, Results],
  templateUrl: './single-survey-view.html',
  styleUrl: './single-survey-view.scss',
})
export class SingleSurveyView implements OnInit {

  /** Service controlling the "Create new survey" dialog. */
  readonly dialog = inject(Dialog);
  /** Current route used to read the survey ID. */
  private readonly route = inject(ActivatedRoute);
  /** Service for accessing the Supabase database. */
  readonly surveyService = inject(SupabaseService);
  /** ID of the displayed survey from the `id` route parameter. */
  readonly surveyId = Number(this.route.snapshot.paramMap.get('id'));
  /** The displayed survey, or `undefined` if it was not found. */
  readonly survey = computed(() =>
    this.surveyService.surveys().find(
      survey => survey.id === this.surveyId
    )
  );
  /** The responses to the displayed survey, or `null`. */
  readonly responses = computed(() =>
    this.surveyService.surveyResponses()[this.surveyId] ?? null
  );

  /** Loads all surveys on initialization. */
  async ngOnInit() {
    await this.surveyService.getAllSurveys();
  }
}
