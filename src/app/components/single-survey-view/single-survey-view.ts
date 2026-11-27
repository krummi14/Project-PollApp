
import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Button } from '../shared/button/button';
import { Dialog } from '../shared/services/dialog';
import { Content } from './content/content';
import { Results } from './results/results';
import { SupabaseService } from '../shared/services/supabase';
import { DOCUMENT } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Detail view of a single survey with its questions and results. */
@Component({
  selector: 'app-single-survey-view',
  imports: [Button, Content, Results, RouterLink],
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
      survey => survey.id == this.surveyId
    )
  );
  private readonly document = inject(DOCUMENT);
  /** The responses to the displayed survey, or `null`. */
  readonly responses = computed(() =>
    this.surveyService.surveyResponses()[this.surveyId] ?? null
  );
  readonly surveyResultsAreVisible = signal(true);
  /** Current (unsaved) answer selection, shown as a live preview in the results. */
  readonly votePreview = signal<Record<string, boolean>>({});

  constructor() {
    this.document.body.classList.remove('home_page');
    this.document.body.classList.add('single_survey_page');
  }

  /** Loads all surveys on initialization. */
  async ngOnInit() {
    await this.surveyService.getAllSurveys();
  }

  toggleSurveyResultCondition() {
    this.surveyResultsAreVisible.update((isVisible) => !isVisible);
  }

  /**
   * Stores the current answer selection for the live results preview.
   *
   * @param votePreview - Selection state per answer control name
   */
  updateVotePreview(votePreview: Record<string, boolean>) {
    this.votePreview.set(votePreview);
  }
}
