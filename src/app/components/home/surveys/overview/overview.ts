import { Component, inject, signal, computed } from '@angular/core';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { Card } from './card/card';
import { SupabaseService } from '../../../shared/services/supabase';
import { Survey } from '../../../shared/interfaces/survey';
import { surveyEndsIn, isSurveyAvailable } from '../../../shared/utils/ends-in-days';
import { RouterLink } from '@angular/router';
import { SelectorButton } from './selector-button/selector-button';

@Component({
  selector: 'app-overview',
  imports: [DropdownMenu, Card, RouterLink, SelectorButton],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview {
  readonly surveyService = inject(SupabaseService);
  readonly allSurveys = signal<Survey[]>([]);
  readonly surveyEndsIn = surveyEndsIn;
  readonly selectedCategory = signal('allSurveys');
  readonly selectedSurveyStatus = signal<'active' | 'past'>('active');
  readonly displayedSurveys = computed(() => {
    const selectedCategory = this.selectedCategory();
    const selectedSurveyStatus = this.selectedSurveyStatus();
    const surveys = this.allSurveys();
    const surveysByStatus = surveys.filter((survey) =>
      selectedSurveyStatus == 'active' ? isSurveyAvailable(survey.date) : !isSurveyAvailable(survey.date),
    );
    return selectedCategory == 'allSurveys' ? surveysByStatus : surveysByStatus.filter((survey) => survey.category == selectedCategory);
  });

  async ngOnInit() {
    await this.loadAllSurveys();
  }

  async loadAllSurveys() {
    const surveys = (await this.surveyService.getAllSurveys()) ?? []
    this.allSurveys.set(surveys);
    return surveys;
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
