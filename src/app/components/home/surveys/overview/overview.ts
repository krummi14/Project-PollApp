
import { Component, inject, computed, OnInit, signal } from '@angular/core';
import { DropdownMenu } from '../dropdown-menu/dropdown-menu';
import { Card } from './card/card';
import { SupabaseService } from '../../../shared/services/supabase';
import { surveyEndsIn, isSurveyAvailable } from '../../../shared/utils/ends-in-days';
import { RouterLink } from '@angular/router';
import { SelectorButton } from './selector-button/selector-button';
import { DatePipe } from '@angular/common';

/** Overview of all surveys with filters for category and status (active/past). */
@Component({
  selector: 'app-overview',
  imports: [DropdownMenu, Card, RouterLink, SelectorButton, DatePipe],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class Overview implements OnInit {

  /** Service for accessing the Supabase database. */
  readonly surveyService = inject(SupabaseService);
  /** All loaded surveys. */
  readonly allSurveys = this.surveyService.surveys;
  /** Calculates the remaining days until a survey ends. */
  readonly surveyEndsIn = surveyEndsIn;
  /** Checks whether a survey is still available. */
  readonly isSurveyAvailabel = isSurveyAvailable;
  /** Currently selected category (`'allSurveys'` shows all categories). */
  readonly selectedCategory = signal('allSurveys');
  /** Currently selected survey status. */
  readonly selectedSurveyStatus = signal<'active' | 'past'>('active');
  /** Surveys filtered by status and category for display. */
  readonly displayedSurveys = computed(() => {

    const selectedCategory = this.selectedCategory();
    const selectedSurveyStatus = this.selectedSurveyStatus();
    const surveys = this.allSurveys();
    const surveysByStatus = surveys.filter((survey) => selectedSurveyStatus == 'active' ? isSurveyAvailable(survey.date) : !isSurveyAvailable(survey.date));

    return selectedCategory == 'allSurveys' ? surveysByStatus : surveysByStatus.filter(
      (survey) => survey.category == selectedCategory,
    );
  });

  /** Loads all surveys on initialization. */
  async ngOnInit() {
    await this.surveyService.getAllSurveys();
  }

  /**
   * Sets the selected category.
   *
   * @param category - Value of the selected category
   */
  selectCategory(category: string) {
    this.selectedCategory.set(category);
  }
}
