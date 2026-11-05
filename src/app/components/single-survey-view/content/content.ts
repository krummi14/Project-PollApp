import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Supabase } from '../../shared/services/supabase';
import { Survey } from '../../shared/interfaces/survey';

@Component({
  selector: 'app-content',
  imports: [],
  templateUrl: './content.html',
  styleUrl: './content.scss',
})
export class Content {
  readonly surveyId = inject(ActivatedRoute).snapshot.paramMap.get('id');
  readonly dbService = inject(Supabase);
  readonly survey = signal<Survey | undefined>(undefined);

  loadAnswerOpertunities(index: number): string {
    return String.fromCharCode(65 + index);
  }

  async ngOnInit() {
    const surveys = await this.dbService.getSurveys() ?? [];
    const survey = surveys.find((item) => String(item.id) == this.surveyId);
    if (survey) {
      survey.questions = JSON.parse(survey.questions as any);
      this.survey.set(survey);
    }
  }
}
