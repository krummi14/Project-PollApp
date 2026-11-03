import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Supabase } from '../shared/services/supabase';
import { Survey } from '../shared/interfaces/survey';
import { Button } from '../shared/button/button';

@Component({
  selector: 'app-single-survey-view',
  imports: [Button],
  templateUrl: './single-survey-view.html',
  styleUrl: './single-survey-view.scss',
})
export class SingleSurveyView {
  readonly surveyId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly dbService = inject(Supabase);
  readonly survey = signal<Survey | undefined>(undefined);

  async ngOnInit() {
    const surveys = await this.dbService.getSurveys() ?? [];
    const survey = surveys.find((item) => String(item.id) == this.surveyId);
    this.survey.set(survey);
  }
}
