
import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { Card } from './card/card';
import { SupabaseService } from '../../../shared/services/supabase';
import { surveyEndsIn, isSurveyAvailable } from '../../../shared/utils/ends-in-days';
import { RouterLink } from '@angular/router';
import { SelectorButton } from './selector-button/selector-button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-overview',
  imports: [DropdownMenu, Card, RouterLink, SelectorButton, DatePipe],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview implements OnInit {

  readonly surveyService = inject(SupabaseService);
  readonly allSurveys = this.surveyService.surveys;
  readonly surveyEndsIn = surveyEndsIn;
  readonly isSurveyAvailabel = isSurveyAvailable;
  readonly selectedCategory = signal('allSurveys');
  readonly selectedSurveyStatus = signal<'active' | 'past'>('active');
  readonly displayedSurveys = computed(() => {

    const selectedCategory = this.selectedCategory();
    const selectedSurveyStatus = this.selectedSurveyStatus();
    const surveys = this.allSurveys();
    const surveysByStatus = surveys.filter((survey) => selectedSurveyStatus == 'active' ? isSurveyAvailable(survey.date) : !isSurveyAvailable(survey.date));

    return selectedCategory == 'allSurveys' ? surveysByStatus : surveysByStatus.filter(
      (survey) => survey.category == selectedCategory,
    );
  });

  async ngOnInit() {
    await this.surveyService.getAllSurveys();
  }

  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
