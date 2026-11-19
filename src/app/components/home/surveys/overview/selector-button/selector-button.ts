import { Component, computed, input, model } from '@angular/core';

/** Status of a survey: active or past. */
type SurveyStatus = 'active' | 'past';

/** Toggle button for selecting the survey status (active/past). */
@Component({
  selector: 'app-selector-button',
  imports: [],
  templateUrl: './selector-button.html',
  styleUrl: './selector-button.scss',
})
export class SelectorButton {
  /** The status this button represents. */
  readonly surveyStatus = input.required<SurveyStatus>();
  /** The currently selected status (two-way binding). */
  readonly selectedSurveyStatus = model.required<SurveyStatus>();
  /** Whether this button is currently selected. */
  readonly isSelected = computed(() => this.selectedSurveyStatus() == this.surveyStatus());

  /** Sets the selected status to the status of this button. */
  protected selectSurveyStatus(): void {
    this.selectedSurveyStatus.set(this.surveyStatus());
  }
}
