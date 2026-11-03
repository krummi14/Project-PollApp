import { Component, inject, signal } from '@angular/core';
import { DropdownMenu } from '../../../shared/dropdown-menu/dropdown-menu';
import { Card } from './card/card';
import { Supabase } from '../../../shared/services/supabase';
import { Survey } from '../../../shared/interfaces/survey';
import { surveyEndsIn } from '../../../shared/utils/ends-in-days';
import { RouterLink } from '@angular/router';
import { SelectorButton } from './selector-button/selector-button';

@Component({
  selector: 'app-overview',
  imports: [DropdownMenu, Card, RouterLink, SelectorButton],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  readonly surveyService = inject(Supabase);
  readonly allSurveys = signal<Survey[]>([]);
  readonly surveyEndsIn = surveyEndsIn;

  async ngOnInit() {
    await this.loadAllSurveys();
  }

  async loadAllSurveys() {
    const surveys = (await this.surveyService.getSurveys()) ?? []
    this.allSurveys.set(surveys);
    return surveys;
  }
}
