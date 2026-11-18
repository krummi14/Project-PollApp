
import { Component, inject, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Button } from '../shared/button/button';
import { Dialog } from '../shared/services/dialog';
import { Content } from './content/content';
import { Results } from './results/results';
import { SupabaseService } from '../shared/services/supabase';

@Component({
  selector: 'app-single-survey-view',
  imports: [Button, Content, Results],
  templateUrl: './single-survey-view.html',
  styleUrl: './single-survey-view.scss',
})
export class SingleSurveyView implements OnInit {

  readonly dialog = inject(Dialog);
  private readonly route = inject(ActivatedRoute);
  readonly surveyService = inject(SupabaseService);
  readonly surveyId = Number(this.route.snapshot.paramMap.get('id'));
  readonly survey = computed(() =>
    this.surveyService.surveys().find(
      survey => survey.id === this.surveyId
    )
  );
  readonly responses = computed(() =>
    this.surveyService.surveyResponses()[this.surveyId] ?? null
  );

  async ngOnInit() {
    await this.surveyService.getAllSurveys();
  }
}
